import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { isAdminEmail } from "@/admin/config";
import { fetchAdminData } from "@/admin/data";
import type { AdminDataType } from "@/admin/types";

export const dynamic = "force-dynamic";

function isAdminDataType(value: string | null): value is AdminDataType {
  return value === "register" || value === "quiz";
}

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json(
      {
        ok: false,
        type: "register",
        rows: [],
        total: 0,
        fetchedAt: new Date().toISOString(),
        setup: {
          ready: false,
          secretConfigured: false,
          sourceConfigured: false,
          issues: []
        },
        error: {
          code: "unauthorized",
          message: "Authentification requise"
        }
      },
      { status: 401 }
    );
  }

  if (!isAdminEmail(session.user.email)) {
    return NextResponse.json(
      {
        ok: false,
        type: "register",
        rows: [],
        total: 0,
        fetchedAt: new Date().toISOString(),
        setup: {
          ready: false,
          secretConfigured: false,
          sourceConfigured: false,
          issues: []
        },
        error: {
          code: "forbidden",
          message: "Acces admin requis"
        }
      },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  if (!isAdminDataType(type)) {
    return NextResponse.json(
      {
        ok: false,
        type: "register",
        rows: [],
        total: 0,
        fetchedAt: new Date().toISOString(),
        setup: {
          ready: false,
          secretConfigured: false,
          sourceConfigured: false,
          issues: []
        },
        error: {
          code: "invalid_type",
          message: "type doit valoir register ou quiz"
        }
      },
      { status: 400 }
    );
  }

  const response =
    type === "register"
      ? await fetchAdminData("register")
      : await fetchAdminData("quiz");
  if (!response.ok && response.error) {
    const status =
      response.error.code === "missing_config"
        ? 503
        : response.error.code === "database_error"
          ? 500
          : response.error.code === "invalid_payload" || response.error.code === "upstream_failed"
          ? 502
          : 400;

    return NextResponse.json(response, { status });
  }

  return NextResponse.json(response);
}
