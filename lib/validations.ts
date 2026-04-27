import { z } from "zod";
import { categories } from "@/lib/marketplace-data";

const categoryValues = categories as unknown as [string, ...string[]];

export const createServiceSchema = z.object({
  mode: z.enum(["REQUEST", "OFFER"]),
  title: z.string().trim().min(3).max(100),
  category: z.enum(categoryValues),
  categories: z.array(z.enum(categoryValues)).min(1).optional(),
  location: z.string().trim().min(2).max(100),
  whatsapp: z.string().regex(/^55[1-9][1-9]9?\d{8}$/),
  priceLabel: z.string().trim().min(1).max(80),
  description: z.string().trim().min(10).max(500)
});

export const createRatingSchema = z.object({
  serviceId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(500).optional()
});
