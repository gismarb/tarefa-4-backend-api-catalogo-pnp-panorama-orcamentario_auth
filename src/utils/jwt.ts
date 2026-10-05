import "dotenv/config";
import jwt from "jsonwebtoken";

function readJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.trim() === "") {
    throw new Error("JWT_SECRET não definida.");
  }

  return secret;
}

const JWT_SECRET = readJwtSecret();

export function generateToken(userId: number): string {
  return jwt.sign(
    { userId },
    JWT_SECRET,
    {
      algorithm: "HS256",
      expiresIn: "7d",
    },
  );
}

export function verifyToken(token: string): number {
  const decoded = jwt.verify(token, JWT_SECRET, {
    algorithms: ["HS256"],
  });

  if (
    typeof decoded === "string" ||
    typeof decoded.userId !== "number" ||
    !Number.isSafeInteger(decoded.userId) ||
    decoded.userId <= 0
  ) {
    throw new jwt.JsonWebTokenError("Identificador de usuário inválido.");
  }

  return decoded.userId;
}