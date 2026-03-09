"use client";

import { useActionState } from "react";
import { signupAction } from "@/actions/auth.actions";
import type { ActionState } from "@/lib/action-result";

const initialState: ActionState = {
  success: false,
  message: "",
};

export function SignupForm() {
  const [state, formAction, pending] = useActionState(
    signupAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4 rounded-3xl bg-white p-6 shadow">
      <h1 className="text-2xl font-bold">Inscription</h1>

      <input
        name="firstName"
        placeholder="Prénom"
        className="w-full rounded-full border px-4 py-3"
      />

      <input
        name="lastName"
        placeholder="Nom"
        className="w-full rounded-full border px-4 py-3"
      />

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
        {pending ? "Inscription..." : "Créer mon compte"}
      </button>
    </form>
  );
}