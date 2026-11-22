import { CollectionListing } from "@/components/CollectionListing";
import { prisma } from "@/lib/prisma";

export default async function PromotionsPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true, oldPrice: { not: null } },
    include: { category: true, variants: true, images: true, inventory: true },
    orderBy: { createdAt: "desc" },
  });

  const formattedProducts = products.map((p) => ({
    id: p.id,
    title: p.titleFr,
    category: p.category.nameFr,
    price: Number(p.price),
    oldPrice: p.oldPrice ? Number(p.oldPrice) : undefined,
    rating: 5.0,
    reviewsCount: 12,
    badge: p.badge || "Promo",
    imageBg: "bg-orange-50",
    slug: p.slug,
    variantSku: p.variants[0]?.sku,
  }));

  return (
    <CollectionListing
      categoryTitle="Promotions"
      categoryDescription="Retrouvez les offres et prix réduits disponibles dans notre sélection."
      products={formattedProducts}
    />
  );
}