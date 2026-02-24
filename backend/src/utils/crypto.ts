import crypto from "crypto";

export function randomNumericCode(length: number) {
  const digits = "0123456789";
  let out = "";
  for (let i = 0; i < length; i++) out += digits[Math.floor(Math.random() * digits.length)];
  return out;
}

export function sha256(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}
