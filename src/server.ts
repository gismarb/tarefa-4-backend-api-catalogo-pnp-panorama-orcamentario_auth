import "dotenv/config";
import cors from "cors";
import express from "express";
import { prisma } from "./lib/prisma.js";
import { Prisma } from "./generated/prisma/client.js";
import { ZodError } from "zod";
import {
  createBudgetIndicatorSchema,
  updateBudgetIndicatorSchema,
} from "./schemas/budget-indicator.schema.js";
import {
  formatZodIssues,
  parsePositiveIntegerId,
} from "./utils/http.js";

const app = express();
const PORT = Number(process.env.PORT ?? 3002);
const ALLOWED_ORIGIN =
  process.env.ALLOWED_ORIGIN ?? "http://localhost:5173";

app.use(
  cors({
    origin: ALLOWED_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  }),
);

app.use(express.json());

app.get("/", (_request, response) => {
  response.json({
    status: "ok",
    message: "API do Panorama Orçamentário da PNP em execução",
  });
});

app.get("/api/budget-indicators", async (_request, response) => {
  try {
    const indicators = await prisma.budgetIndicator.findMany({
      orderBy: {
        id: "asc",
      },
    });

    response.json(indicators);
  } catch (error) {
    console.error("Erro ao consultar indicadores:", error);

    response.status(500).json({
      error: "Erro interno ao consultar o panorama orçamentário.",
    });
  }
});

app.get("/api/budget-indicators/:id", async (request, response) => {
  const id = parsePositiveIntegerId(request.params.id);

  if (id === null) {
    response.status(400).json({
      error: "O id informado deve ser um número inteiro positivo.",
    });
    return;
  }

  try {
    const indicator = await prisma.budgetIndicator.findUnique({
      where: {
        id,
      },
    });

    if (!indicator) {
      response.status(404).json({
        error: "Indicador orçamentário não encontrado.",
      });
      return;
    }

    response.json(indicator);
  } catch (error) {
    console.error("Erro ao consultar indicador:", error);

    response.status(500).json({
      error: "Erro interno ao consultar o indicador orçamentário.",
    });
  }
});

app.post("/api/budget-indicators", async (request, response) => {
  try {
    const data = createBudgetIndicatorSchema.parse(request.body);

    const newIndicator = await prisma.budgetIndicator.create({
      data,
    });

    response.status(201).json(newIndicator);
  } catch (error) {
    if (error instanceof ZodError) {
      response.status(400).json({
        error: "Payload inválido.",
        issues: formatZodIssues(error),
      });
      return;
    }

    console.error("Erro ao criar indicador:", error);

    response.status(500).json({
      error: "Erro interno ao criar o indicador orçamentário.",
    });
  }
});

app.put("/api/budget-indicators/:id", async (request, response) => {
  const id = parsePositiveIntegerId(request.params.id);

  if (id === null) {
    response.status(400).json({
      error: "O id informado deve ser um número inteiro positivo.",
    });
    return;
  }

  try {
    const data = updateBudgetIndicatorSchema.parse(request.body);

    const updatedIndicator = await prisma.budgetIndicator.update({
      where: {
        id,
      },
      data,
    });

    response.status(200).json(updatedIndicator);
  } catch (error) {
    if (error instanceof ZodError) {
      response.status(400).json({
        error: "Payload inválido.",
        issues: formatZodIssues(error),
      });
      return;
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      response.status(404).json({
        error: "Indicador orçamentário não encontrado.",
      });
      return;
    }

    console.error(`Erro ao atualizar o indicador ${id}:`, error);

    response.status(500).json({
      error: "Erro interno ao atualizar o indicador orçamentário.",
    });
  }
});

app.delete("/api/budget-indicators/:id", async (request, response) => {
  const id = parsePositiveIntegerId(request.params.id);

  if (id === null) {
    response.status(400).json({
      error: "O id informado deve ser um número inteiro positivo.",
    });
    return;
  }

  try {
    await prisma.budgetIndicator.delete({
      where: {
        id,
      },
    });

    response.status(204).send();
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      response.status(404).json({
        error: "Indicador orçamentário não encontrado.",
      });
      return;
    }

    console.error(`Erro ao excluir o indicador ${id}:`, error);

    response.status(500).json({
      error: "Erro interno ao excluir o indicador orçamentário.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor executando em http://localhost:${PORT}`);
});