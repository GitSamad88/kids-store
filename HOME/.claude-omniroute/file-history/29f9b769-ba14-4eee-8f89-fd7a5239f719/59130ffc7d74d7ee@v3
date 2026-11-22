import { PrismaClient, Prisma } from '@prisma/client';
import type { Prisma as PrismaType } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

export const ProductQuerySchema = z.object({
  category: z.string().optional(),
  search: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  sort: z.enum(['popular', 'price-asc', 'price-desc', 'rating']).default('popular'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

export async function getCategories() {
  return await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
  });
}

export async function getCategoryBySlug(slug: string) {
  return await prisma.category.findUnique({
    where: { slug },
    include: {
      products: {
        where: { isActive: true },
        include: {
          variants: true,
          images: true,
          inventory: true,
        },
      },
    },
  });
}

export async function getProducts(rawQuery: unknown) {
  const parseResult = ProductQuerySchema.safeParse(rawQuery);
  if (!parseResult.success) {
    throw new Error('Paramètres de requête invalides');
  }

  const { category, search, minPrice, maxPrice, sort, page, limit } = parseResult.data;

  const where: PrismaType.ProductWhereInput = {
    isActive: true,
  };

  if (category) {
    where.category = { slug: category };
  }

  if (search) {
    where.OR = [
      { titleFr: { contains: search, mode: 'insensitive' } },
      { descriptionFr: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  let orderBy: PrismaType.ProductOrderByWithRelationInput = { createdAt: 'desc' };
  if (sort === 'price-asc') orderBy = { price: 'asc' };
  if (sort === 'price-desc') orderBy = { price: 'desc' };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        variants: true,
        images: true,
        inventory: true,
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getProductBySlug(slug: string) {
  return await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      variants: true,
      images: true,
      inventory: true,
    },
  });
}

export async function getFeaturedProducts() {
  return await prisma.product.findMany({
    where: { isFeatured: true, isActive: true },
    include: {
      category: true,
      variants: true,
      images: true,
      inventory: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

export function getCategoryContent(slug: string) {
  return {
    slug,
  };
}