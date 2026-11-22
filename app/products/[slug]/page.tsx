import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/ProductDetail";
import { getProductBySlug, getProducts } from "@/lib/catalog";

export async function generateStaticParams() {
  const { products } = await getProducts({ limit: 50 });
  return products.map(({ slug }) => ({ slug }));
}

async function ProductContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p || !p.isActive) notFound();

  const product = {
    id: p.id,
    title: p.titleFr,
    category: p.category.nameFr,
    price: Number(p.price),
    oldPrice: p.oldPrice ? Number(p.oldPrice) : undefined,
    rating: 5.0,
    reviewsCount: 12,
    description: p.descriptionFr,
    variants: p.variants.map((v) => ({ sku: v.sku, name: v.nameFr })),
    colors: [
      { name: "Standard", hex: "#334155", variantSku: p.variants[0]?.sku },
    ],
    inStock: (p.inventory?.stock ?? 0) > 0,
  };

  return <ProductDetail product={product} />;
}

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" aria-busy="true" />}>
      <ProductContent params={params} />
    </Suspense>
  );
}