import { Router } from "express";
import bcrypt from "bcryptjs";
import { ZodError } from "zod";
import { Prisma } from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";
import {
  registerSchema,
  loginSchema,
} from "../schemas/auth.schema.js";
import { formatZodIssues } from "../utils/http.js";
import { generateToken } from "../utils/jwt.js";
import {
  authMiddleware,
  type AuthRequest,
} from "../middlewares/auth.middleware.js";

export const authRouter = Router();

authRouter.post("/register", async (request, response) => {
  try {
    const { email, password, name } = registerSchema.parse(request.body);

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      response.status(409).json({
        error: "O e-mail informado já está em uso.",
      });
      return;
    }

    // A senha original não é persistida.
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    const token = generateToken(user.id);

    response.status(201).json({
      message: "Usuário cadastrado com sucesso.",
      token,
      user,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      response.status(400).json({
        error: "Payload inválido.",
        issues: formatZodIssues(error),
      });
      return;
    }

    // Também cobre cadastros simultâneos com o mesmo e-mail.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      response.status(409).json({
        error: "O e-mail informado já está em uso.",
      });
      return;
    }

    console.error("Erro ao cadastrar usuário:", error);

    response.status(500).json({
      error: "Erro interno ao cadastrar o usuário.",
    });
  }
});

authRouter.post("/login", async (request, response) => {
  try {
    const { email, password } = loginSchema.parse(request.body);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      response.status(401).json({
        error: "E-mail ou senha incorretos.",
      });
      return;
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      response.status(401).json({
        error: "E-mail ou senha incorretos.",
      });
      return;
    }

    const token = generateToken(user.id);

    response.status(200).json({
      message: "Login realizado com sucesso.",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      response.status(400).json({
        error: "Payload inválido.",
        issues: formatZodIssues(error),
      });
      return;
    }

    console.error("Erro ao autenticar usuário:", error);

    response.status(500).json({
      error: "Erro interno ao autenticar o usuário.",
    });
  }
});

authRouter.get("/me", authMiddleware, (request: AuthRequest, response) => {
  response.status(200).json({
    message: "Usuário autenticado.",
    user: request.user,
  });
});