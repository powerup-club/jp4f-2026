import { redirect } from "next/navigation";
import { getValidatedLocale } from "@/lib/locale-page";

export default async function CompetitionRegisterPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await getValidatedLocale(params);
  redirect(`/${locale}/application`);
}
