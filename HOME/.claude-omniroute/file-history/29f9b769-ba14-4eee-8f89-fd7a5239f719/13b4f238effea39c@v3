export const dynamic = "force-dynamic";

import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { adminDeleteProduct } from "@/lib/admin";
import { Plus, Package, CheckCircle2, XCircle, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

export default async function AdminProductsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const products = await prisma.product.findMany({
    include: { category: true, inventory: true, variants: true },
    orderBy: { createdAt: "desc" },
  });

  async function deleteProductAction(formData: FormData) {
    "use server";
    const productId = formData.get("productId") as string;
    if (productId) {
      await adminDeleteProduct(productId);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-white">Catalogue & Produits</h1>
          <p className="text-slate-400 text-sm mt-1">Gérez les produits, stocks et prix de la boutique.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/categories"
            className="bg-slate-700 hover:bg-slate-600 text-white font-bold px-4 py-2.5 rounded-xl transition-colors text-sm"
          >
            Gérer les catégories
          </Link>
          <Link
            href="/admin/products/new"
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors shadow-md flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" /> Ajouter un produit
          </Link>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-lg overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-700 text-slate-400 text-xs uppercase tracking-wider">
              <th className="pb-3 font-semibold">Produit</th>
              <th className="pb-3 font-semibold">Catégorie</th>
              <th className="pb-3 font-semibold">Prix</th>
              <th className="pb-3 font-semibold">Stock</th>
              <th className="pb-3 font-semibold">Statut</th>
              <th className="pb-3 font-semibold text-end">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/60">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-slate-700/30 transition-colors">
                <td className="py-4 font-bold text-white flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-700 rounded-xl flex items-center justify-center shrink-0 border border-slate-600">
                    <Package className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <div>{product.titleFr}</div>
                    <div className="text-xs text-slate-400 font-normal">{product.slug}</div>
                  </div>
                </td>
                <td className="py-4 text-slate-300">{product.category.nameFr}</td>
                <td className="py-4 font-semibold text-orange-400">{Number(product.price).toLocaleString()} MAD</td>
                <td className="py-4 text-slate-300 font-semibold">{product.inventory?.stock ?? 0} unit(s)</td>
                <td className="py-4">
                  {product.isActive ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Actif
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/30">
                      <XCircle className="w-3.5 h-3.5" /> Inactif
                    </span>
                  )}
                </td>
                <td className="py-4 text-end">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="p-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl transition-colors"
                      title="Modifier"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <form action={deleteProductAction} onSubmit={(e) => {
                      if (!confirm("Voulez-vous vraiment supprimer ou archiver ce produit ?")) {
                        e.preventDefault();
                      }
                    }}>
                      <input type="hidden" name="productId" value={product.id} />
                      <button
                        type="submit"
                        className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors border border-red-500/20"
                        title="Supprimer / Archiver"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}