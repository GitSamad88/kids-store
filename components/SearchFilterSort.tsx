'use client';

import { useState } from "react";
import { Search, ArrowUpDown, ChevronLeft, ChevronRight, X } from "lucide-react";
import { ProductCard, ProductCardProps } from "@/components/ProductCard";

export interface SearchFilterSortProps {
  initialProducts: ProductCardProps[];
}

export function SearchFilterSort({ initialProducts }: SearchFilterSortProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter products
  const filtered = initialProducts.filter((p) => {
    const matchesQuery = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === "all" || p.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesQuery && matchesCat;
  });

  // Sort products
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "rating") return (b.rating ?? 0) - (a.rating ?? 0);
    return 0; // popular
  });

  // Pagination
  const totalPages = Math.ceil(sorted.length / itemsPerPage) || 1;
  const paginated = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Search Header */}
      <div className="bg-orange-50 border border-orange-100 rounded-3xl p-8 text-center space-y-4">
        <h1 className="text-3xl font-black text-slate-900">Recherche & Catalogue</h1>
        <p className="text-slate-600 max-w-xl mx-auto text-sm sm:text-base">
          Trouvez rapidement le produit idéal pour vos enfants parmi notre sélection au Maroc.
        </p>

        {/* Search Bar Input */}
        <div className="relative max-w-2xl mx-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="Rechercher par nom, catégorie, marque..."
            className="w-full bg-white border border-slate-200 rounded-full py-3.5 ps-12 pe-10 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
          />
          <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute end-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter and Sort Controls Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {[
            { label: "Tous", value: "all" },
            { label: "Vêtements", value: "vêtements" },
            { label: "Jouets", value: "jouets" },
            { label: "Puériculture", value: "puériculture" },
            { label: "Repas", value: "repas" },
          ].map((cat) => (
            <button
              key={cat.value}
              onClick={() => { setSelectedCategory(cat.value); setCurrentPage(1); }}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat.value
                  ? "bg-orange-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <ArrowUpDown className="w-4 h-4" />
            <span>Trier par:</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="popular">Pertinence / Popularité</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
            <option value="rating">Meilleures notes</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center text-xs text-slate-500 px-1">
        <span>{sorted.length} article(s) trouvé(s)</span>
        <span>Page {currentPage} sur {totalPages || 1}</span>
      </div>

      {/* Product Grid */}
      {paginated.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {paginated.map((prod) => (
            <ProductCard key={prod.id} {...prod} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3">
          <p className="text-slate-900 font-bold text-lg">Aucun produit ne correspond à vos critères</p>
          <p className="text-sm text-slate-500">Essayez de modifier vos filtres ou votre recherche.</p>
          <button
            onClick={() => { setSearchQuery(""); setSelectedCategory("all"); setCurrentPage(1); }}
            className="mt-4 bg-orange-600 text-white font-medium px-6 py-2.5 rounded-full text-sm hover:bg-orange-700 transition-colors shadow-sm"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 border border-slate-200 rounded-xl bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx + 1)}
              className={`w-10 h-10 rounded-xl font-bold text-sm transition-colors ${
                currentPage === idx + 1
                  ? "bg-orange-600 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {idx + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 border border-slate-200 rounded-xl bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
