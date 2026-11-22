import Link from "next/link";
import { Package, ShoppingBag, LayoutDashboard, LogOut, ArrowLeft, DownloadCloud, FolderKanban } from "lucide-react";
import { logoutUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-800 border-b md:border-b-0 md:border-r border-slate-700 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-orange-500">Kids Maroc</span>
            <h2 className="text-xl font-black text-white mt-0.5">Administration</h2>
          </div>

          <nav className="space-y-2">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-orange-500" />
              Tableau de bord
            </Link>
            <Link
              href="/admin/products"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <Package className="w-4 h-4 text-orange-500" />
              Catalogue & Produits
            </Link>
            <Link
              href="/admin/categories"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <FolderKanban className="w-4 h-4 text-orange-500" />
              Catégories
            </Link>
            <Link
              href="/admin/orders"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <ShoppingBag className="w-4 h-4 text-orange-500" />
              Commandes
            </Link>
            <Link
              href="/admin/import-export"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <DownloadCloud className="w-4 h-4 text-orange-500" />
              Import / Export
            </Link>
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-700 space-y-4">
          <form action={async () => {
            "use server";
            await logoutUser();
            redirect("/admin/login");
          }}>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-slate-700/60 hover:bg-red-500/20 hover:text-red-400 text-slate-300 py-2.5 rounded-xl text-xs font-bold transition-colors border border-slate-600"
            >
              <LogOut className="w-4 h-4" /> Déconnexion
            </button>
          </form>
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 bg-slate-900 text-slate-400 hover:text-white py-2.5 rounded-xl text-xs font-bold transition-colors border border-slate-700"
          >
            <ArrowLeft className="w-4 h-4" /> Voir la boutique
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}