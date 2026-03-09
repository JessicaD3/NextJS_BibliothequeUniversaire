import { redirect } from "next/navigation";
import { getAccessTokenCookie } from "./cookies";
import { verifyAccessToken } from "./auth";

export async function getSessionUser() {
  const token = await getAccessTokenCookie();

  if (!token) {
    return null;
  }

  try {
    const payload = await verifyAccessToken(token);

    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  } catch {
    return null;
  }
}

export async function requireUser() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}