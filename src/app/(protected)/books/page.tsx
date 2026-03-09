import { db } from "@/lib/db";
import { BookCard } from "@/components/books/book-card";
import { requireUser } from "@/lib/session";

type BooksPageProps = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    page?: string;
  }>;
};

const PAGE_SIZE = 6;

export default async function BooksPage({ searchParams }: BooksPageProps) {
  await requireUser();

  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const category = params.category?.trim() ?? "";
  const page = Number(params.page ?? "1");

  const where = {
    AND: [
      q
        ? {
            OR: [
              {
                title: {
                  contains: q,
                },
              },
              {
                author: {
                  contains: q,
                },
              },
            ],
          }
        : {},
      category ? { category } : {},
    ],
  };

  const [books, total, categories] = await Promise.all([
    db.book.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        title: true,
        author: true,
        year: true,
        category: true,
        available: true,
      },
    }),
    db.book.count({ where }),
    db.book.findMany({
      distinct: ["category"],
      select: { category: true },
      where: {
        category: {
          not: null,
        },
      },
      orderBy: {
        category: "asc",
      },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Catalogue</h1>
          <p className="mt-1 text-slate-600">
            Consulte les livres disponibles de la bibliothèque
          </p>
        </div>

        <span className="rounded-full bg-slate-100 px-4 py-2 text-sm">
          {total} résultat{total > 1 ? "s" : ""}
        </span>
      </div>

      <form className="mb-6 grid gap-4 rounded-3xl bg-white p-4 shadow md:grid-cols-[1fr_220px_140px]">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Rechercher un titre ou un auteur"
          className="rounded-full border px-4 py-3"
        />

        <select
          name="category"
          defaultValue={category}
          className="rounded-full border px-4 py-3"
        >
          <option value="">Toutes les catégories</option>
          {categories.map((item) =>
            item.category ? (
              <option key={item.category} value={item.category}>
                {item.category}
              </option>
            ) : null,
          )}
        </select>

        <button
          type="submit"
          className="rounded-full bg-slate-900 px-4 py-3 text-white"
        >
          Filtrer
        </button>
      </form>

      {books.length === 0 ? (
        <div className="rounded-3xl bg-white p-8 text-center shadow">
          <p className="text-slate-600">Aucun livre trouvé.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}

      <div className="mt-8 flex items-center justify-between">
        <span className="text-sm text-slate-600">
          Page {page} sur {totalPages}
        </span>

        <div className="flex gap-2">
          <a
            href={`/books?q=${encodeURIComponent(q)}&category=${encodeURIComponent(
              category,
            )}&page=${Math.max(1, page - 1)}`}
            className={`rounded-full border px-4 py-2 text-sm ${
              page <= 1 ? "pointer-events-none opacity-50" : ""
            }`}
          >
            Précédent
          </a>

          <a
            href={`/books?q=${encodeURIComponent(q)}&category=${encodeURIComponent(
              category,
            )}&page=${Math.min(totalPages, page + 1)}`}
            className={`rounded-full border px-4 py-2 text-sm ${
              page >= totalPages ? "pointer-events-none opacity-50" : ""
            }`}
          >
            Suivant
          </a>
        </div>
      </div>
    </main>
  );
}