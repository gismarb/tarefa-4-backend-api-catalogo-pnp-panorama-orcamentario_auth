import { z } from "zod";

const emailSchema = z
  .string({
    error: "O e-mail é obrigatório.",
  })
  .trim()
  .toLowerCase()
  .pipe(z.email({
    error: "Informe um e-mail válido.",
  }));

const passwordSchema = z
  .string({
    error: "A senha é obrigatória.",
  })
  .refine((value) => Buffer.byteLength(value, "utf8") <= 72, {
    message: "A senha deve ter no máximo 72 bytes em UTF-8.",
  });

export const registerSchema = z
  .object({
    email: emailSchema,

    password: passwordSchema.refine((value) => value.length >= 6, {
      message: "A senha deve ter pelo menos 6 caracteres.",
    }),

    name: z
      .string({
        error: "O nome deve ser um texto.",
      })
      .trim()
      .min(1, "O nome não pode estar vazio.")
      .max(255, "O nome deve ter no máximo 255 caracteres.")
      .optional(),
  })
  .strict();

export const loginSchema = z
  .object({
    email: emailSchema,

    password: passwordSchema.refine((value) => value.length > 0, {
      message: "A senha é obrigatória.",
    }),
  })
  .strict();

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;