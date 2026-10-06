import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import { verifyToken } from "../utils/jwt.js";

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    name: string | null;
  };
}

export async function authMiddleware(
  request: AuthRequest,
  response: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    response.status(401).json({
      error: "Token de acesso não fornecido.",
    });
    return;
  }

  const match = /^Bearer ([^\s]+)$/i.exec(authHeader);

  if (!match) {
    response.status(401).json({
      error: "Use Authorization: Bearer <token>.",
    });
    return;
  }

  try {
    const userId = verifyToken(match[1]);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!user) {
      response.status(401).json({
        error: "Usuário do token não encontrado.",
      });
      return;
    }

    request.user = user;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      response.status(401).json({
        error: "Token expirado.",
      });
      return;
    }

    if (
      error instanceof jwt.JsonWebTokenError ||
      error instanceof jwt.NotBeforeError
    ) {
      response.status(401).json({
        error: "Token inválido.",
      });
      return;
    }

    console.error("Erro ao verificar autenticação:", error);

    response.status(500).json({
      error: "Erro interno ao verificar a autenticação.",
    });
    return;
  }

  next();
}