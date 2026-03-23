import { auth } from "@/auth";
import { getApplicantPersistenceSetup } from "@/applicant/config";
import { createApplicantAiMessage, getApplicantAiChat } from "@/applicant/data";
import type { ApplicantApplicationRecord } from "@/applicant/types";
import { hasGroqApiKey, requestGroqCompletion } from "@/lib/groq";

type SupportedLocale = "fr" | "en" | "ar";

interface ChatPayload {
  body?: unknown;
  locale?: unknown;
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function resolveLocale(value: unknown): SupportedLocale {
  return value === "en" || value === "ar" ? value : "fr";
}

function buildApplicationSnapshot(application: ApplicantApplicationRecord | null): string {
  if (!application) {
    return "No applicant application is available yet.";
  }

  return [
    `Team ID: ${application.teamId || "N/A"}`,
    `Status: ${application.status || "draft"}`,
    `Participation: ${application.participationType || "individual"}`,
    `Contact name: ${application.contactFullName || "N/A"}`,
    `Phone: ${application.phone || "N/A"}`,
    `University: ${application.university || "N/A"}`,
    `Branch: ${application.branch || "N/A"}`,
    `Team name: ${application.teamName || "N/A"}`,
    `Project title: ${application.projectTitle || "N/A"}`,
    `Project domain: ${application.projectDomain || "N/A"}`,
    `Project summary: ${application.projectDesc || "N/A"}`,
    `Innovation: ${application.innovation || "N/A"}`,
    `Demo format: ${application.demoFormat || "N/A"}`
  ].join("\n");
}

function buildSystemPrompt(locale: SupportedLocale, application: ApplicantApplicationRecord | null): string {
  const applicationSnapshot = buildApplicationSnapshot(application);

  if (locale === "en") {
    return `You are the applicant portal assistant for Innov'Industry 2026 at ENSA Fes.

Your job:
- help the applicant understand the competition, portal tools, quiz, games, evaluation flow, and contact process
- answer in English
- stay concise, practical, and accurate
- use the saved application context when it helps
- if information is missing, say so plainly instead of inventing details
- never claim final jury decisions or guaranteed selection outcomes

Saved applicant context:
${applicationSnapshot}`;
  }

  if (locale === "ar") {
    return `أنت مساعد بوابة المترشحين الخاصة بفعالية Innov'Industry 2026 في ENSA Fes.

مهامك:
- ساعد المترشح على فهم المسابقة وأدوات البوابة والاختبار والألعاب وصفحة التقييم والتواصل
- أجب باللغة العربية
- كن واضحا وعمليا ومختصرا
- استعمل معطيات الطلب المحفوظة عندما تكون مفيدة
- إذا كانت معلومة غير متوفرة فقل ذلك بوضوح
- لا تعد بنتائج نهائية ولا تضمن القبول

معطيات الطلب المحفوظة:
${applicationSnapshot}`;
  }

  return `Tu es l'assistant du portail candidat Innov'Industry 2026 a l'ENSA Fes.

Ta mission :
- aider le candidat a comprendre la competition, les outils du portail, le quiz, les jeux, l'auto-evaluation et le contact
- repondre en francais
- rester concis, concret et utile
- utiliser le contexte de candidature quand il est pertinent
- dire clairement quand une information manque au lieu d'inventer
- ne jamais promettre un resultat final ni une selection

Contexte candidat enregistre :
${applicationSnapshot}`;
}

export async function GET() {
  const session = await auth().catch(() => null);
  if (!session?.user?.email) {
    return Response.json({ error: { code: "unauthorized", message: "Authentication required" } }, { status: 401 });
  }

  const state = await getApplicantAiChat(session.user.email);
  if (!state.setup.ready) {
    return Response.json(
      {
        error: { code: "setup_required", message: "Applicant persistence is not configured" },
        setup: state.setup,
        application: null,
        messages: []
      },
      { status: 503 }
    );
  }

  if (state.error) {
    return Response.json(
      {
        error: { code: "database_error", message: state.error },
        setup: state.setup,
        application: state.application,
        messages: []
      },
      { status: 500 }
    );
  }

  return Response.json({
    setup: state.setup,
    application: state.application,
    messages: state.messages
  });
}

export async function POST(request: Request) {
  const session = await auth().catch(() => null);
  if (!session?.user?.email) {
    return Response.json({ error: { code: "unauthorized", message: "Authentication required" } }, { status: 401 });
  }

  const setup = getApplicantPersistenceSetup();
  if (!setup.ready) {
    return Response.json(
      {
        error: { code: "setup_required", message: "Applicant persistence is not configured" },
        setup
      },
      { status: 503 }
    );
  }

  if (!hasGroqApiKey()) {
    return Response.json(
      {
        error: { code: "ai_unavailable", message: "AI API key is missing" },
        setup
      },
      { status: 503 }
    );
  }

  try {
    const payload = (await request.json()) as ChatPayload;
    const body = text(payload.body);
    const locale = resolveLocale(payload.locale);

    if (!body) {
      return Response.json(
        {
          error: { code: "invalid_body", message: "Message body is required" },
          setup
        },
        { status: 400 }
      );
    }

    const chat = await getApplicantAiChat(session.user.email, {
      ensureApplication: true,
      accountName: session.user.name,
      locale
    });

    if (chat.error || !chat.application) {
      return Response.json(
        {
          error: {
            code: chat.errorCode || "database_error",
            message: chat.error || "Applicant workspace is unavailable"
          },
          setup,
          application: chat.application,
          messages: []
        },
        { status: 500 }
      );
    }

    const conversation = [
      { role: "system" as const, content: buildSystemPrompt(locale, chat.application) },
      ...chat.messages.map((message) => ({
        role: message.role === "assistant" ? ("assistant" as const) : ("user" as const),
        content: message.content
      })),
      { role: "user" as const, content: body }
    ];

    const assistantContent = await requestGroqCompletion(conversation, {
      temperature: 0.65,
      maxTokens: 700
    });

    if (!assistantContent) {
      throw new Error("Could not generate assistant reply");
    }

    const userMessage = await createApplicantAiMessage({
      applicationId: chat.application.id,
      role: "user",
      content: body
    });

    const assistantMessage = await createApplicantAiMessage({
      applicationId: chat.application.id,
      role: "assistant",
      content: assistantContent
    });

    return Response.json({
      setup,
      application: chat.application,
      messages: [userMessage, assistantMessage]
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not generate assistant reply";
    return Response.json({ error: { code: "ai_failed", message }, setup }, { status: 500 });
  }
}
