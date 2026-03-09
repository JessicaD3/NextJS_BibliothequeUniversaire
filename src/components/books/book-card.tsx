import Link from "next/link";

type BookCardProps = {
  book: {
    id: string;
    title: string;
    author: string;
    year: number | null;
    category: string | null;
    available: boolean;
  };
};

export function BookCard({ book }: BookCardProps) {
  return (
    <article className="rounded-3xl border bg-white p-5 shadow-sm">
      <div className="mb-4 rounded-2xl bg-slate-100 p-8 text-center text-sm text-slate-500">
        Couverture
      </div>

      <h2 className="text-lg font-bold">{book.title}</h2>
      <p className="text-sm text-slate-600">{book.author}</p>

      <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
        <span>{book.year ?? "—"}</span>
        <span>{book.category ?? "Sans catégorie"}</span>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            book.available
              ? "bg-emerald-100 text-emerald-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {book.available ? "Disponible" : "Indisponible"}
        </span>

        <Link
          href={`/books/${book.id}`}
          className="rounded-full border px-4 py-2 text-sm font-medium"
        >
          Voir
        </Link>
      </div>
    </article>
  );
}