export const dynamic = "force-dynamic";

import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { adminCreateCategory } from "@/lib/admin";
import Link from "next/link";
import { ArrowLeft, Plus, FolderKanban } from "lucide-react";

export default async function AdminCategoriesPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { products: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  async function createCategoryAction(formData: FormData) {
    "use server";
    try {
      await adminCreateCategory({
        nameFr: formData.get("nameFr"),
        nameAr: formData.get("nameAr"),
        description: formData.get("description") || undefined,
      });
      redirect("/admin/categories");
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="p-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-white">Gestion des Catégories</h1>
          <p className="text-slate-400 text-sm mt-1">Créez et organisez les rayons et catégories de la boutique.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Create Category Form */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Plus className="w-5 h-5 text-orange-500" /> Ajouter une catégorie
          </h2>

          <form action={createCategoryAction} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Nom (Français)</label>
              <input
                type="text"
                name="nameFr"
                required
                placeholder="ex: Plein air"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Nom (Arabe)</label>
              <input
                type="text"
                name="nameAr"
                required
                placeholder="ألعاب الهواء الطلق"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Description (Optionnel)</label>
              <textarea
                name="description"
                rows={2}
                placeholder="Description courte..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl transition-colors shadow-lg text-xs"
            >
              Créer la catégorie
            </button>
          </form>
        </div>

        {/* Categories List */}
        <div className="md:col-span-2 bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-orange-500" /> Catégories existantes ({categories.length})
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Nom (FR / AR)</th>
                  <th className="pb-3 font-semibold">Slug</th>
                  <th className="pb-3 font-semibold text-end">Produits</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="py-4">
                      <div className="font-bold text-white">{cat.nameFr}</div>
                      <div className="text-xs text-orange-400">{cat.nameAr}</div>
                    </td>
                    <td className="py-4 text-xs text-slate-400 font-mono">{cat.slug}</td>
                    <td className="py-4 text-end font-semibold text-slate-200">
                      <span className="px-2.5 py-1 rounded-full bg-slate-700 text-xs">
                        {cat._count.products} prod(s)
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}