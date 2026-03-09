import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-4">
      <div className="w-full space-y-4">
        <LoginForm />
        <p className="text-center text-sm">
          Pas encore de compte ?{" "}
          <Link href="/signup" className="font-semibold underline">
            Inscription
          </Link>
        </p>
      </div>
    </main>
  );
}