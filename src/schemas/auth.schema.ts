import { z } from "zod";

export const registerSchema = z.object({
  phone: z.string().min(4, "Phone number is required."),
  password: z.string().min(8).max(32).regex(/^[a-zA-Z0-9!@#$%^&*()\-_=+{}[\]|;:'",.<>/?]+$/),
});

export const loginSchema = z.object({
  phone: z.string(),
  password: z.string(),
});

export const jwtPayloadSchema = z.object({
  id: z.string(),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
export type JwtPayloadSchema = z.infer<typeof jwtPayloadSchema>;
