import { Suspense } from "react";
import { notFound } from "next/navigation";
import { CollectionListing } from "@/components/CollectionListing";
import { getCategoryBySlug, getCategories } from "@/lib/catalog";

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map(({ slug }) => ({ slug }));
}

async function CategoryContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const products = category.products.map((p) => ({
    id: p.id,
    title: p.titleFr,
    category: category.nameFr,
    price: Number(p.price),
    oldPrice: p.oldPrice ? Number(p.oldPrice) : undefined,
    rating: 5.0,
    reviewsCount: 12,
    badge: p.badge || undefined,
    imageBg: "bg-orange-50",
    slug: p.slug,
    variantSku: p.variants[0]?.sku,
  }));

  return (
    <CollectionListing
      categoryTitle={category.nameFr}
      categoryDescription={category.description || ""}
      products={products}
    />
  );
}

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" aria-busy="true" />}>
      <CategoryContent params={params} />
    </Suspense>
  );
}