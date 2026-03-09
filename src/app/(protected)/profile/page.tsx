import { requireUser } from "@/lib/session";
import { db } from "@/lib/db";
import { logoutAction } from "@/actions/auth.actions";

function getBorrowingStatus(dueDate: Date, returnedAt: Date | null) {
  if (returnedAt) return "Rendu";
  if (dueDate < new Date()) return "En retard";
  return "En cours";
}

export default async function ProfilePage() {
  const user = await requireUser();

  const dbUser = await db.user.findUnique({
    where: { id: user.id },
    select: {
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      borrowings: {
        where: { returnedAt: null },
        orderBy: { borrowedAt: "desc" },
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
      },
    },
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        
        <aside className="rounded-3xl bg-white p-6 shadow">
          <h1 className="text-2xl font-bold">Mon profil</h1>

          <p className="mt-4">
            {dbUser?.firstName} {dbUser?.lastName}
          </p>

          <p className="text-sm text-slate-600">{dbUser?.email}</p>

          <p className="mt-2 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">
            {dbUser?.role}
          </p>

          <div className="mt-6 rounded-2xl bg-slate-50 p-4">
            <p className="text-sm font-medium">Emprunts en cours</p>
            <p className="mt-2 text-3xl font-bold">
              {dbUser?.borrowings.length ?? 0}/3
            </p>
          </div>

          <form action={logoutAction} className="mt-6">
            <button className="rounded-full bg-slate-900 px-4 py-3 text-white">
              Déconnexion
            </button>
          </form>
        </aside>

        <section className="rounded-3xl bg-white p-6 shadow">
          <h2 className="text-xl font-bold">Emprunts en cours</h2>

          <div className="mt-4 space-y-4">
            {dbUser?.borrowings.map((borrowing) => (
              <article
                key={borrowing.id}
                className="rounded-2xl border p-4"
              >
                <h3 className="font-semibold">
                  {borrowing.book.title}
                </h3>

                <p className="text-sm text-slate-600">
                  {borrowing.book.author}
                </p>

                <p className="mt-2 text-sm">
                  Retour prévu :{" "}
                  {borrowing.dueDate.toLocaleDateString("fr-FR")}
                </p>

                <p className="mt-1 text-sm font-medium">
                  Statut :{" "}
                  {getBorrowingStatus(
                    borrowing.dueDate,
                    borrowing.returnedAt
                  )}
                </p>
              </article>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}