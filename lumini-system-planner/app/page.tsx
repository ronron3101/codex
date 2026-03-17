import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center gap-10 px-6 py-16">
      <section className="space-y-6 text-center">
        <p className="text-sm uppercase tracking-[0.24em] text-lumini-700">LUMINI Trade Tools</p>
        <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">LUMINI System Planner</h1>
        <p className="mx-auto max-w-2xl text-lg text-lumini-700">
          Size transformers, validate voltage drop, and produce practical installation guidance for
          premium architectural outdoor lighting systems.
        </p>
      </section>
      <div className="rounded-2xl border border-lumini-300 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-medium">Build a production-ready plan in minutes.</h2>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-lumini-700">
          <li>Voltage-aware fixture loading</li>
          <li>Cable resistance driven voltage-drop analysis</li>
          <li>Opinionated recommendations your installers can use onsite</li>
        </ul>
        <Link
          href="/calculator"
          className="mt-8 inline-flex rounded-md bg-lumini-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-lumini-700"
        >
          Start Planning
        </Link>
      </div>
    </main>
  );
}
