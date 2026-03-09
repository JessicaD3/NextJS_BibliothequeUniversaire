"use client";

import { useActionState } from "react";
import { loginAction, type ActionState } from "@/actions/auth.actions";

const initialState: ActionState = {
  success: false,
  message: "",
};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(
    loginAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4 rounded-3xl bg-white p-6 shadow">
      <h1 className="text-2xl font-bold">Connexion</h1>

      <input
        name="email"
        type="email"
        placeholder="Email"
        className="w-full rounded-full border px-4 py-3"
      />

      <input
        name="password"
        type="password"
        placeholder="Mot de passe"
        className="w-full rounded-full border px-4 py-3"
      />

      {state.message ? (
        <p className="text-sm text-red-600">{state.message}</p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-slate-900 px-4 py-3 text-white disabled:opacity-50"
      >
        {pending ? "Connexion..." : "Se connecter"}
      </button>
    </form>
  );
}