import Link from "next/link";
import { getCategories } from "@/lib/catalog";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-black text-slate-900">Nos catégories</h1>
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-orange-500 hover:shadow-lg"
          >
            <h2 className="text-lg font-bold text-slate-900">{category.nameFr}</h2>
            <p className="mt-2 text-sm text-slate-600">{category.description || ""}</p>
            <p className="mt-4 text-xs font-semibold text-orange-600">{category._count.products} articles</p>
          </Link>
        ))}
      </div>
    </section>
  );
}