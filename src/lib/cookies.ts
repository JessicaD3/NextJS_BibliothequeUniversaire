import { cookies } from "next/headers";
import { env } from "./env";

const accessTokenName = "access_token";
const refreshTokenName = "refresh_token";

const cookieOptions = {
  httpOnly: true,
  secure: env.IS_PROD,
  sameSite: "strict" as const,
  path: "/",
};

export async function setAuthCookies(
  accessToken: string,
  refreshToken: string,
) {
  const cookieStore = await cookies();

  cookieStore.set(accessTokenName, accessToken, {
    ...cookieOptions,
    maxAge: 60 * 15,
  });

  cookieStore.set(refreshTokenName, refreshToken, {
    ...cookieOptions,
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(accessTokenName);
  cookieStore.delete(refreshTokenName);
}

export async function getAccessTokenCookie() {
  const cookieStore = await cookies();
  return cookieStore.get(accessTokenName)?.value;
}

export async function getRefreshTokenCookie() {
  const cookieStore = await cookies();
  return cookieStore.get(refreshTokenName)?.value;
}