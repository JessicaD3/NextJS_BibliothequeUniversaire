export default function ProfileLoading() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <div className="rounded-3xl bg-white p-6 shadow">
          <div className="h-8 w-32 animate-pulse rounded bg-slate-200" />
          <div className="mt-6 h-5 w-40 animate-pulse rounded bg-slate-200" />
          <div className="mt-3 h-4 w-52 animate-pulse rounded bg-slate-200" />
          <div className="mt-4 h-6 w-20 animate-pulse rounded-full bg-slate-200" />

          <div className="mt-6 rounded-2xl bg-slate-50 p-4">
            <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
            <div className="mt-3 h-10 w-16 animate-pulse rounded bg-slate-200" />
          </div>

          <div className="mt-6 h-12 w-36 animate-pulse rounded-full bg-slate-200" />
        </div>

        <div className="rounded-3xl bg-white p-6 shadow">
          <div className="h-7 w-48 animate-pulse rounded bg-slate-200" />

          <div className="mt-6 space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="rounded-2xl border p-4">
                <div className="h-5 w-48 animate-pulse rounded bg-slate-200" />
                <div className="mt-3 h-4 w-32 animate-pulse rounded bg-slate-200" />
                <div className="mt-3 h-4 w-40 animate-pulse rounded bg-slate-200" />
                <div className="mt-3 h-4 w-24 animate-pulse rounded bg-slate-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}