export default function BooksLoading() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-64 animate-pulse rounded-3xl bg-slate-200"
          />
        ))}
      </div>
    </main>
  );
}