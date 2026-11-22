export const dynamic = "force-dynamic";

import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { adminGetOrders, adminUpdateOrderStatus } from "@/lib/admin";
import { OrderStatus } from "@prisma/client";

export default async function AdminOrdersPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const orders = await adminGetOrders();

  async function updateStatusAction(formData: FormData) {
    "use server";
    const orderId = formData.get("orderId") as string;
    const status = formData.get("status") as OrderStatus;
    if (orderId && status) {
      await adminUpdateOrderStatus(orderId, status);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white">Gestion des Commandes</h1>
        <p className="text-slate-400 text-sm mt-1">Suivez et mettez à jour le statut des commandes clients au Maroc.</p>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-lg overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-700 text-slate-400 text-xs uppercase tracking-wider">
              <th className="pb-3 font-semibold">N° Commande</th>
              <th className="pb-3 font-semibold">Client & Téléphone</th>
              <th className="pb-3 font-semibold">Adresse / Ville</th>
              <th className="pb-3 font-semibold">Total</th>
              <th className="pb-3 font-semibold">Statut actuel</th>
              <th className="pb-3 font-semibold">Action / Mettre à jour</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/60">
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="py-4 font-bold text-white">
                    <div>{order.orderNumber}</div>
                    <div className="text-xs text-slate-400 font-normal">
                      {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="font-semibold text-slate-200">{order.customerName}</div>
                    <div className="text-xs text-orange-400 font-medium">{order.customerPhone}</div>
                  </td>
                  <td className="py-4">
                    <div className="text-slate-300">{order.shippingAddress}</div>
                    <div className="text-xs text-slate-400">{order.city}</div>
                  </td>
                  <td className="py-4 font-black text-white">{Number(order.totalAmount).toLocaleString()} MAD</td>
                  <td className="py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <form action={updateStatusAction} className="flex items-center gap-2">
                      <input type="hidden" name="orderId" value={order.id} />
                      <select
                        name="status"
                        defaultValue={order.status}
                        className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-orange-500"
                      >
                        {Object.values(OrderStatus).map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                      <button
                        type="submit"
                        className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition-colors shadow-sm"
                      >
                        Mettre à jour
                      </button>
                    </form>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                  Aucune commande enregistrée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}