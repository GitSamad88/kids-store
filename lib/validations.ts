import { z } from "zod";

export const ProductQuerySchema = z.object({
  category: z.string().optional(),
  search: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  sort: z.enum(["popular", "price-asc", "price-desc", "rating"]).default("popular"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

export const CartItemInputSchema = z.object({
  variantSku: z.string().trim().min(1).max(100),
  quantity: z.number().int().min(1).max(99),
});

export const CheckoutInputSchema = z.object({
  customerName: z.string().min(2, "Le nom complet est requis"),
  customerPhone: z.string().regex(/^(\+212|0)([5-7]\d{8})$/, "Numéro de téléphone marocain invalide"),
  customerEmail: z.string().email("Email invalide").optional().or(z.literal("")),
  shippingAddress: z.string().min(5, "L'adresse de livraison est requise"),
  city: z.string().min(2, "La ville est requise"),
  paymentMethod: z.literal("COD"),
});

export const RegisterSchema = z.object({
  fullName: z.string().min(2, "Le nom complet est requis"),
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  phone: z
    .string()
    .regex(/^(\+212|0)([5-7]\d{8})$/, "Numéro de téléphone marocain invalide")
    .optional()
    .or(z.literal("")),
});

export const LoginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

export type ProductQueryInput = z.infer<typeof ProductQuerySchema>;
export type CartItemInput = z.infer<typeof CartItemInputSchema>;
export type CheckoutInput = z.infer<typeof CheckoutInputSchema>;
