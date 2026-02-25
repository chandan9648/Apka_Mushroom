import jwt from "jsonwebtoken";


function toExpiresIn(value: string): jwt.SignOptions["expiresIn"] {
  if (/^\d+$/.test(value)) return Number(value);
  return value as unknown as jwt.SignOptions["expiresIn"];
}

export function signAccessToken(payload: { sub: string; role: "user" | "admin" }) {
  return jwt.sign(payload, String(process.env.JWT_ACCESS_SECRET), { expiresIn: toExpiresIn( String(process.env.JWT_ACCESS_EXPIRES_IN)) });
}

export function signRefreshToken(payload: { sub: string; role: "user" | "admin" }) {
  return jwt.sign(payload, String(process.env.JWT_REFRESH_SECRET), { expiresIn: toExpiresIn(String(process.env.JWT_REFRESH_EXPIRES_IN)) });
}
