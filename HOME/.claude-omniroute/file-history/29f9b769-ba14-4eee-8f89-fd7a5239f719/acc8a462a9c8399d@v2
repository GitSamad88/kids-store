import { SearchFilterSort } from "@/components/SearchFilterSort";
import { getProducts } from "@/lib/catalog";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const rawQuery = {
    category: typeof resolvedParams.category === "string" ? resolvedParams.category : undefined,
    search: typeof resolvedParams.search === "string" ? resolvedParams.search : undefined,
    minPrice: typeof resolvedParams.minPrice === "string" ? resolvedParams.minPrice : undefined,
    maxPrice: typeof resolvedParams.maxPrice === "string" ? resolvedParams.maxPrice : undefined,
    sort: typeof resolvedParams.sort === "string" ? resolvedParams.sort : "popular",
    page: typeof resolvedParams.page === "string" ? resolvedParams.page : "1",
    limit: "50",
  };

  const { products } = await getProducts(rawQuery);

  const formattedProducts = products.map((p) => ({
    id: p.id,
    title: p.titleFr,
    category: p.category.nameFr,
    price: Number(p.price),
    oldPrice: p.oldPrice ? Number(p.oldPrice) : undefined,
    rating: 5.0,
    reviewsCount: 12,
    badge: p.badge || undefined,
    imageBg: "bg-orange-50",
    slug: p.slug,
    variantSku: p.variants[0]?.sku,
  }));

  return <SearchFilterSort initialProducts={formattedProducts} />;
}