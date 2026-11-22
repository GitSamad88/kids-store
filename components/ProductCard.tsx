import Link from "next/link";
import { Star } from "lucide-react";
import { AddToCartButton } from "@/components/AddToCartButton";

export interface ProductCardProps {
  id: string;
  title: string;
  category: string;
  price: number;
  oldPrice?: number;
  rating?: number;
  reviewsCount?: number;
  badge?: string;
  imageBg?: string;
  slug?: string;
  variantSku?: string;
}

export function ProductCard({
  id,
  title,
  category,
  price,
  oldPrice,
  rating = 5.0,
  reviewsCount = 12,
  badge,
  imageBg = "bg-orange-50",
  slug = id,
  variantSku,
}: ProductCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-orange-500 transition-all flex flex-col justify-between group">
      <div>
        <div className={`relative h-56 ${imageBg} flex items-center justify-center overflow-hidden`}>
          {badge && (
            <span className="absolute top-3 start-3 bg-orange-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
              {badge}
            </span>
          )}
          <div className="text-slate-400 text-sm font-medium">Aperçu Produit</div>
        </div>

        <div className="p-4 space-y-2">
          <span className="text-xs font-semibold text-orange-600 uppercase tracking-wide">{category}</span>
          <Link href={`/products/${slug}`}>
            <h3 className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1">{title}</h3>
          </Link>

          <div className="flex items-center gap-1 text-amber-500 text-xs">
            <Star className="w-3.5 h-3.5 fill-amber-500" />
            <span className="font-bold text-slate-700">{rating}</span>
            <span className="text-slate-400">({reviewsCount})</span>
          </div>
        </div>
      </div>

      <div className="p-4 pt-0 flex items-center justify-between">
        <div>
          <div className="text-lg font-black text-slate-900">{price} MAD</div>
          {oldPrice && (
            <div className="text-xs text-slate-400 line-through">{oldPrice} MAD</div>
          )}
        </div>
        {variantSku ? (
          <AddToCartButton variantSku={variantSku} className="bg-orange-600 hover:bg-orange-700 text-white p-2.5 rounded-xl transition-colors flex items-center justify-center shadow-sm" />
        ) : (
          <button disabled title="Variante indisponible" className="bg-slate-300 text-white p-2.5 rounded-xl cursor-not-allowed">
            <span className="sr-only">Variante indisponible</span>
            <span aria-hidden="true">—</span>
          </button>
        )}
      </div>
    </div>
  );
}
