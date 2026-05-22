import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter."),
  email: z.string().email("Format email tidak valid."),
  password: z
    .string()
    .min(8, "Password minimal 8 karakter.")
    .regex(/[A-Z]/, "Password harus mengandung huruf besar.")
    .regex(/[0-9]/, "Password harus mengandung angka."),
});

export const loginSchema = z.object({
  email: z.string().email("Format email tidak valid."),
  password: z.string().min(6, "Password minimal 6 karakter."),
});

export const googleAuthSchema = z.object({
  credential: z.string().min(20, "Credential Google tidak valid."),
});

export const verifyEmailQuerySchema = z.object({
  token: z.string().min(20, "Token verifikasi tidak valid."),
});

export const resendVerificationSchema = z.object({
  email: z.string().email("Format email tidak valid."),
});

export const updateProfileSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter."),
  phone: z.string().optional().or(z.literal("")),
  occupation: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  birthDate: z.string().optional().or(z.literal("")),
  gender: z.string().optional().or(z.literal("")),
  bio: z.string().max(300, "Bio maksimal 300 karakter.").optional().or(z.literal("")),
  emergencyContact: z.string().optional().or(z.literal("")),
});

export const answerScreeningSchema = z.object({
  screeningId: z.string().min(1),
  questionId: z.string().min(1),
  value: z.any(),
});

export const submitScreeningSchema = z.object({
  screeningId: z.string().min(1),
});

export const idParamSchema = z.object({
  id: z.string().min(1),
});

export const adminQuestionSchema = z.object({
  title: z.string().min(10, "Pertanyaan minimal 10 karakter."),
  key: z
    .string()
    .min(3, "Key minimal 3 karakter.")
    .regex(/^[a-zA-Z][a-zA-Z0-9]+$/, "Gunakan format camelCase tanpa spasi."),
  helperText: z.string().optional().or(z.literal("")),
  inputType: z.enum(["choice", "slider", "number", "textarea"]),
  placeholder: z.string().optional().or(z.literal("")),
  min: z.number().nullable().optional(),
  max: z.number().nullable().optional(),
  step: z.number().nullable().optional(),
  required: z.boolean(),
  order: z.number().int().min(1),
  options: z
    .array(
      z.object({
        label: z.string().min(1),
        value: z.string().min(1),
      }),
    )
    .optional(),
});
