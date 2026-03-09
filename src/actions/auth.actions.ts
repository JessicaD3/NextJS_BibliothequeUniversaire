"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { loginSchema, signupSchema } from "@/lib/validations/auth";
import { clearAuthCookies, setAuthCookies } from "@/lib/cookies";
import { signAccessToken, signRefreshToken } from "@/lib/auth";
import {
  createErrorState,
  type ActionState,
} from "@/lib/action-result";

export async function signupAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const parsed = signupSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
      firstName: formData.get("firstName") || undefined,
      lastName: formData.get("lastName") || undefined,
    });

    if (!parsed.success) {
      return createErrorState(
        parsed.error.issues[0]?.message ?? "Données invalides",
      );
    }

    const existingUser = await db.user.findUnique({
      where: { email: parsed.data.email },
      select: { id: true },
    });

    if (existingUser) {
      return createErrorState("Un compte existe déjà avec cet email");
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 10);

    const user = await db.user.create({
      data: {
        email: parsed.data.email,
        passwordHash,
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
      },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    const accessToken = await signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = await signRefreshToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    await setAuthCookies(accessToken, refreshToken);
  } catch {
    return createErrorState("Erreur serveur pendant l'inscription");
  }

  redirect("/profile");
}

export async function loginAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const parsed = loginSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!parsed.success) {
      return createErrorState(
        parsed.error.issues[0]?.message ?? "Données invalides",
      );
    }

    const user = await db.user.findUnique({
      where: { email: parsed.data.email },
      select: {
        id: true,
        email: true,
        role: true,
        passwordHash: true,
      },
    });

    if (!user) {
      return createErrorState("Identifiants invalides");
    }

    const isPasswordValid = await bcrypt.compare(
      parsed.data.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      return createErrorState("Identifiants invalides");
    }

    const accessToken = await signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = await signRefreshToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    await setAuthCookies(accessToken, refreshToken);
  } catch {
    return createErrorState("Erreur serveur pendant la connexion");
  }

  redirect("/profile");
}

export async function logoutAction() {
  await clearAuthCookies();
  redirect("/login");
}