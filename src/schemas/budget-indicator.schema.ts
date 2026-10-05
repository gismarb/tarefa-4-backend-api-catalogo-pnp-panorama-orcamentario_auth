import { z } from "zod";

const BRAZILIAN_REGIONS = [
  "Centro-Oeste",
  "Nordeste",
  "Norte",
  "Sudeste",
  "Sul",
] as const;

const monetaryValueSchema = (fieldName: string) =>
  z.preprocess(
    (value) => {
      if (typeof value === "string" && value.trim() === "") {
        return undefined;
      }

      return value;
    },
    z.coerce
      .number({
        error: `${fieldName} deve ser um número válido.`,
      })
      .finite(`${fieldName} deve ser um número finito.`)
      .nonnegative(`${fieldName} não pode ser negativo.`),
  );

export const createBudgetIndicatorSchema = z
  .object({
    year: z.coerce
      .number({
        error: "O ano deve ser um número válido.",
      })
      .int("O ano deve ser um número inteiro.")
      .min(2000, "O ano deve ser igual ou posterior a 2000.")
      .max(2100, "O ano deve ser igual ou anterior a 2100."),

    institutionCode: z
      .string({
        error: "O código da instituição é obrigatório.",
      })
      .trim()
      .min(2, "O código da instituição deve ter pelo menos 2 caracteres.")
      .max(30, "O código da instituição deve ter no máximo 30 caracteres."),

    institutionName: z
      .string({
        error: "O nome da instituição é obrigatório.",
      })
      .trim()
      .min(3, "O nome da instituição deve ter pelo menos 3 caracteres.")
      .max(255, "O nome da instituição deve ter no máximo 255 caracteres."),

    region: z.enum(BRAZILIAN_REGIONS, {
      error: "A região informada é inválida.",
    }),

    state: z
      .string({
        error: "O estado é obrigatório.",
      })
      .trim()
      .min(2, "O estado deve ter pelo menos 2 caracteres.")
      .max(50, "O estado deve ter no máximo 50 caracteres."),

    stateCode: z
      .string({
        error: "A sigla do estado é obrigatória.",
      })
      .trim()
      .regex(
        /^[A-Z]{2}$/,
        "A sigla do estado deve conter exatamente duas letras maiúsculas.",
      ),

    updatedBudget: monetaryValueSchema("O orçamento atualizado"),
    committedExpense: monetaryValueSchema("O valor da despesa empenhada"),
    liquidatedExpense: monetaryValueSchema("O valor da despesa liquidada"),
    paidExpense: monetaryValueSchema("O valor da despesa paga"),
    availableCredit: monetaryValueSchema("O crédito disponível"),
  })
  .strict();

export const updateBudgetIndicatorSchema = createBudgetIndicatorSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Informe pelo menos um campo para atualização.",
  });

export type CreateBudgetIndicatorInput = z.infer<
  typeof createBudgetIndicatorSchema
>;

export type UpdateBudgetIndicatorInput = z.infer<
  typeof updateBudgetIndicatorSchema
>;