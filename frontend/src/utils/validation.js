import { z } from "zod";

const nullableNumber = z.preprocess((value) => {
  if (value === "" || value === undefined || value === null) {
    return null;
  }

  return Number(value);
}, z.number().nullable());

export const loginSchema = z.object({
  email: z.string().email("Format email tidak valid."),
  password: z.string().min(6, "Password minimal 6 karakter."),
});

export const registerSchema = z
  .object({
    name: z.string().min(3, "Nama minimal 3 karakter."),
    email: z.string().email("Format email tidak valid."),
    password: z
      .string()
      .min(8, "Password minimal 8 karakter.")
      .regex(/[A-Z]/, "Password harus mengandung huruf besar.")
      .regex(/[0-9]/, "Password harus mengandung angka."),
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Konfirmasi password tidak sesuai.",
  });

export const profileSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter."),
  phone: z.string().min(8, "Nomor telepon minimal 8 karakter.").optional(),
  occupation: z.string().optional(),
  city: z.string().optional(),
  birthDate: z.string().optional(),
  gender: z.string().optional(),
  bio: z.string().max(300, "Bio maksimal 300 karakter.").optional(),
  emergencyContact: z.string().optional(),
});

export const adminQuestionSchema = z.object({
  title: z.string().min(10, "Pertanyaan minimal 10 karakter."),
  key: z
    .string()
    .min(3, "Key minimal 3 karakter.")
    .regex(/^[a-zA-Z][a-zA-Z0-9]+$/, "Gunakan format camelCase tanpa spasi."),
  helperText: z.string().optional(),
  inputType: z.enum(["choice", "slider", "number", "textarea"]),
  placeholder: z.string().optional(),
  order: z.coerce.number().min(1, "Urutan minimal 1."),
  min: nullableNumber.optional(),
  max: nullableNumber.optional(),
  step: nullableNumber.optional(),
  required: z.boolean(),
  optionsText: z.string().optional(),
});
