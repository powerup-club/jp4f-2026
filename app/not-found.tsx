import Link from "next/link";

export default function NotFound() {
  return (
    <div className="section-shell py-32 text-center">
      <p className="badge-line">404</p>
      <h1 className="mt-4 font-display text-6xl font-semibold uppercase text-ink">Page not found</h1>
      <p className="mt-3 text-lg text-ink/70">The requested page does not exist in this locale.</p>
      <Link href="/fr" className="mt-6 inline-flex rounded-full bg-accent px-6 py-3 font-display text-xl uppercase tracking-[0.08em] text-white">
        Back to home
      </Link>
    </div>
  );
}
