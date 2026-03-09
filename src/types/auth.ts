export type AccessTokenPayload = {
  sub: string;
  email: string;
  role: string;
  type: "access";
};

export type RefreshTokenPayload = {
  sub: string;
  email: string;
  role: string;
  type: "refresh";
};