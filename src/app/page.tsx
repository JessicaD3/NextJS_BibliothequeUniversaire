import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold">Bibliothèque universitaire</h1>
      <p className="mt-4 text-slate-600">
        Application de gestion des emprunts réalisée avec Next.js et MySQL.
      </p>

      <div className="mt-8 flex gap-4">
        <Link
          href="/login"
          className="rounded-full bg-slate-900 px-5 py-3 text-white"
        >
          Connexion
        </Link>
        <Link
          href="/signup"
          className="rounded-full border px-5 py-3"
        >
          Inscription
        </Link>
      </div>
    </main>
  );
}