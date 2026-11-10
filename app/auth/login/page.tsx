import { redirect } from "next/navigation";

interface AuthLoginPageProps {
  searchParams: Promise<{
    mode?: string | string[];
  }>;
}

function firstValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export default async function AuthLoginPage({ searchParams }: AuthLoginPageProps) {
  const params = await searchParams;
  if (firstValue(params.mode) !== "admin") {
    redirect("/fr");
  }

  redirect("/admin/login");
}
