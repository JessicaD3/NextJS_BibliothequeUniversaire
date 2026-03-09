import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { borrowBook } from "@/actions/borrow.actions";

type BookDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function BookDetailPage({ params }: BookDetailPageProps) {
  await requireUser();

  const { id } = await params;

  const book = await db.book.findUnique({
    where: { id },
    select: {
      id: true,
      isbn: true,
      title: true,
      author: true,
      year: true,
      category: true,
      available: true,
    },
  });

  if (!book) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="rounded-3xl bg-white p-8 shadow">
        <p className="text-sm text-slate-500">ISBN : {book.isbn}</p>
        <h1 className="mt-2 text-3xl font-bold">{book.title}</h1>
        <p className="mt-2 text-slate-600">{book.author}</p>
      </div>
      <form
  action={async () => {
    "use server";
    await borrowBook(book.id);
  }}
  className="mt-6"
>
  <button
    disabled={!book.available}
    className="rounded-full bg-slate-900 px-6 py-3 text-white disabled:opacity-50"
  >
    {book.available ? "Emprunter ce livre" : "Livre indisponible"}
  </button>
</form>
    </main>
  );
}