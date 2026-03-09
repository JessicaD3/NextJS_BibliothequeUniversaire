import { SignJWT, jwtVerify, errors } from "jose";
import { env } from "./env";
import type { AccessTokenPayload, RefreshTokenPayload } from "@/types/auth";

const accessSecret = new TextEncoder().encode(env.JWT_ACCESS_SECRET);
const refreshSecret = new TextEncoder().encode(env.JWT_REFRESH_SECRET);

export async function signAccessToken(
  payload: Omit<AccessTokenPayload, "type">,
) {
  return new SignJWT({ ...payload, type: "access" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(accessSecret);
}

export async function signRefreshToken(
  payload: Omit<RefreshTokenPayload, "type">,
) {
  return new SignJWT({ ...payload, type: "refresh" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(refreshSecret);
}

export async function verifyAccessToken(token: string) {
  const result = await jwtVerify(token, accessSecret);
  return result.payload as AccessTokenPayload;
}

export async function verifyRefreshToken(token: string) {
  const result = await jwtVerify(token, refreshSecret);
  return result.payload as RefreshTokenPayload;
}

export function isTokenExpiredError(error: unknown) {
  return error instanceof errors.JWTExpired;
}