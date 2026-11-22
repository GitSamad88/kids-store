export const dynamic = "force-dynamic";

import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Package, ShoppingBag, AlertTriangle, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const [productCount, orderCount, lowStockCount, recentOrders] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.inventory.count({ where: { stock: { lte: 5 } } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { items: true },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white">Tableau de bord</h1>
        <p className="text-slate-400 text-sm mt-1">Bienvenue dans l'espace d'administration Kids Maroc.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-lg flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400">Total Produits</span>
            <div className="text-3xl font-black text-white">{productCount}</div>
          </div>
          <div className="w-12 h-12 bg-orange-600/20 text-orange-500 rounded-2xl flex items-center justify-center border border-orange-500/30">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-lg flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400">Total Commandes</span>
            <div className="text-3xl font-black text-white">{orderCount}</div>
          </div>
          <div className="w-12 h-12 bg-sky-500/20 text-sky-400 rounded-2xl flex items-center justify-center border border-sky-500/30">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-lg flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400">Alertes Stock Faible</span>
            <div className="text-3xl font-black text-amber-400">{lowStockCount}</div>
          </div>
          <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center border border-amber-500/30">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-lg space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-white">Commandes récentes</h2>
          <Link href="/admin/orders" className="text-xs font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1">
            Voir tout <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 text-xs uppercase tracking-wider">
                <th className="pb-3 font-semibold">N° Commande</th>
                <th className="pb-3 font-semibold">Client</th>
                <th className="pb-3 font-semibold">Ville</th>
                <th className="pb-3 font-semibold">Total</th>
                <th className="pb-3 font-semibold">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="py-4 font-bold text-white">{order.orderNumber}</td>
                    <td className="py-4 text-slate-300">{order.customerName}</td>
                    <td className="py-4 text-slate-300">{order.city}</td>
                    <td className="py-4 font-semibold text-orange-400">{Number(order.totalAmount).toLocaleString()} MAD</td>
                    <td className="py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                    Aucune commande enregistrée pour le moment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}