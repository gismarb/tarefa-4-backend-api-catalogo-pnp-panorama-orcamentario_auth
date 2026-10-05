import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL não definida.");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("Preparando o banco para executar o seed...");

  await prisma.$executeRawUnsafe(
    'TRUNCATE TABLE "budget_indicators" RESTART IDENTITY',
  );
  const indicators = [
    {
      year: 2025,
      institutionCode: "IFB",
      institutionName: "Instituto Federal de Brasília",
      region: "Centro-Oeste",
      state: "Distrito Federal",
      stateCode: "DF",
      updatedBudget: "416480326.62",
      committedExpense: "412374349.47",
      liquidatedExpense: "370103372.64",
      paidExpense: "344492173.07",
      availableCredit: "3250055.15",
    },
    {
      year: 2025,
      institutionCode: "IFBA",
      institutionName: "Instituto Federal da Bahia",
      region: "Nordeste",
      state: "Bahia",
      stateCode: "BA",
      updatedBudget: "926500233.64",
      committedExpense: "926240925.55",
      liquidatedExpense: "904149969.99",
      paidExpense: "815048350.36",
      availableCredit: "204108.09",
    },
    {
      year: 2025,
      institutionCode: "IFPA",
      institutionName: "Instituto Federal do Pará",
      region: "Norte",
      state: "Pará",
      stateCode: "PA",
      updatedBudget: "758416592.36",
      committedExpense: "756715275.51",
      liquidatedExpense: "733229634.89",
      paidExpense: "657134034.98",
      availableCredit: "979003.85",
    },
    {
      year: 2025,
      institutionCode: "IF SUDESTE MG",
      institutionName: "Instituto Federal do Sudeste de Minas Gerais",
      region: "Sudeste",
      state: "Minas Gerais",
      stateCode: "MG",
      updatedBudget: "455823119.35",
      committedExpense: "454467292.95",
      liquidatedExpense: "434920443.58",
      paidExpense: "394819619.45",
      availableCredit: "1355826.40",
    },
    {
      year: 2025,
      institutionCode: "IFSC",
      institutionName: "Instituto Federal de Santa Catarina",
      region: "Sul",
      state: "Santa Catarina",
      stateCode: "SC",
      updatedBudget: "911105786.00",
      committedExpense: "908155495.78",
      liquidatedExpense: "884588016.98",
      paidExpense: "775732697.55",
      availableCredit: "2939850.22",
    },
  ];

  const result = await prisma.budgetIndicator.createMany({
    data: indicators,
  });

  console.log(
    `${result.count} indicadores do panorama orçamentário inseridos com sucesso.`,
  );
}

main()
  .catch((error) => {
    console.error("Erro ao executar o seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });