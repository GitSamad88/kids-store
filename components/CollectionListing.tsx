import Link from "next/link";
import { ProductCard, ProductCardProps } from "@/components/ProductCard";
import { Filter, SlidersHorizontal, ChevronRight } from "lucide-react";

export interface CollectionListingProps {
  categoryTitle: string;
  categoryDescription: string;
  products: ProductCardProps[];
}

export function CollectionListing({
  categoryTitle,
  categoryDescription,
  products,
}: CollectionListingProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mb-6">
        <Link href="/" className="hover:text-orange-600">Accueil</Link>
        <ChevronRight className="w-4 h-4 text-slate-400" />
        <span className="text-slate-900 font-medium">{categoryTitle}</span>
      </nav>

      {/* Header */}
      <div className="bg-orange-50 border border-orange-100 rounded-3xl p-8 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">{categoryTitle}</h1>
          <p className="text-slate-600 mt-2 max-w-2xl">{categoryDescription}</p>
        </div>
        <div className="text-xs font-semibold bg-white border border-orange-200 text-orange-700 px-4 py-2 rounded-full shadow-xs">
          {products.length} articles disponibles
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:border-orange-500 transition-colors shadow-xs">
            <Filter className="w-4 h-4 text-slate-500" /> Filtrer
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:border-orange-500 transition-colors shadow-xs">
            <SlidersHorizontal className="w-4 h-4 text-slate-500" /> Trier par pertinence
          </button>
        </div>
        <div className="text-xs text-slate-500">
          Affichage de 1-{products.length} sur {products.length} produits
        </div>
      </div>

      {/* Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((prod) => (
            <ProductCard key={prod.id} {...prod} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl">
          <p className="text-slate-600 font-medium">Aucun produit trouvé dans cette catégorie.</p>
        </div>
      )}
    </div>
  );
}
