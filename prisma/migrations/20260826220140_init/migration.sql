-- CreateTable
CREATE TABLE "budget_indicators" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "institution_code" TEXT NOT NULL,
    "institution_name" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "state_code" TEXT NOT NULL,
    "updated_budget" DECIMAL(18,2) NOT NULL,
    "committed_expense" DECIMAL(18,2) NOT NULL,
    "liquidated_expense" DECIMAL(18,2) NOT NULL,
    "paid_expense" DECIMAL(18,2) NOT NULL,
    "available_credit" DECIMAL(18,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "budget_indicators_pkey" PRIMARY KEY ("id")
);
