import Link from "next/link";
import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-4">
      <div className="w-full space-y-4">
        <SignupForm />
        <p className="text-center text-sm">
          Déjà un compte ?{" "}
          <Link href="/login" className="font-semibold underline">
            Connexion
          </Link>
        </p>
      </div>
    </main>
  );
}