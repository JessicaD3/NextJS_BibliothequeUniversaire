import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { returnBook } from "@/actions/return.actions";

function getStatus(dueDate: Date, returnedAt: Date | null) {
  if (returnedAt) return "Rendu";
  if (dueDate < new Date()) return "En retard";
  return "En cours";
}

function getLateDays(dueDate: Date, returnedAt: Date | null) {
  if (returnedAt || dueDate >= new Date()) return 0;

  const diff = Date.now() - dueDate.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

type HistoryPageProps = {
  searchParams: Promise<{
    message?: string;
    type?: string;
  }>;
};

export default async function HistoryPage({ searchParams }: HistoryPageProps) {
  await requireUser();
  const user = await requireUser();
  const params = await searchParams;

  const message = params.message ?? "";
  const type = params.type ?? "";

  const borrowings = await db.borrowing.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      borrowedAt: "desc",
    },
    select: {
      id: true,
      borrowedAt: true,
      dueDate: true,
      returnedAt: true,
      book: {
        select: {
          title: true,
          author: true,
        },
      },
    },
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="rounded-3xl bg-white p-6 shadow">
        <h1 className="text-2xl font-bold">Historique des emprunts</h1>

        {message ? (
          <div
            className={`mt-4 rounded-2xl px-4 py-3 text-sm font-medium ${
              type === "success"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        ) : null}

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-3">Livre</th>
                <th className="py-3">Emprunté le</th>
                <th className="py-3">Retour prévu</th>
                <th className="py-3">Statut</th>
                <th className="py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {borrowings.map((borrowing) => {
                const status = getStatus(borrowing.dueDate, borrowing.returnedAt);
                const lateDays = getLateDays(borrowing.dueDate, borrowing.returnedAt);

                return (
                  <tr key={borrowing.id} className="border-b align-top">
                    <td className="py-4">
                      <p className="font-semibold">{borrowing.book.title}</p>
                      <p className="text-slate-500">{borrowing.book.author}</p>
                    </td>

                    <td className="py-4">
                      {borrowing.borrowedAt.toLocaleDateString("fr-FR")}
                    </td>

                    <td className="py-4">
                      {borrowing.dueDate.toLocaleDateString("fr-FR")}
                    </td>

                    <td className="py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          status === "En retard"
                            ? "bg-red-100 text-red-700"
                            : status === "Rendu"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {status}
                      </span>

                      {lateDays > 0 ? (
                        <p className="mt-2 text-xs font-medium text-red-600">
                          +{lateDays} jour(s)
                        </p>
                      ) : null}
                    </td>

                    <td className="py-4">
                      {!borrowing.returnedAt ? (
                        <form
                          action={async () => {
                            "use server";
                            await returnBook(borrowing.id);
                          }}
                        >
                          <button className="rounded-full border px-4 py-2">
                            Rendre
                          </button>
                        </form>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}