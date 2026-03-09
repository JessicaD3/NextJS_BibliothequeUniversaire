export default function BooksLoading() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="h-8 w-40 animate-pulse rounded bg-slate-200" />
        <div className="h-10 w-28 animate-pulse rounded-full bg-slate-200" />
      </div>

      <div className="mb-6 grid gap-4 rounded-3xl bg-white p-4 shadow md:grid-cols-[1fr_220px_140px]">
        <div className="h-12 animate-pulse rounded-full bg-slate-200" />
        <div className="h-12 animate-pulse rounded-full bg-slate-200" />
        <div className="h-12 animate-pulse rounded-full bg-slate-200" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="mb-4 h-32 animate-pulse rounded-2xl bg-slate-200" />
            <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />
            <div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-slate-200" />
            <div className="mt-4 h-4 w-2/3 animate-pulse rounded bg-slate-200" />
            <div className="mt-6 flex items-center justify-between">
              <div className="h-8 w-24 animate-pulse rounded-full bg-slate-200" />
              <div className="h-8 w-16 animate-pulse rounded-full bg-slate-200" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}