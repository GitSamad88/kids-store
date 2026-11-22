'use client';

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Star, ShoppingCart, Truck, Shield, RefreshCw, Check, Plus, Minus } from "lucide-react";
import { AddToCartButton } from "@/components/AddToCartButton";

export interface ProductDetailProps {
  product: {
    id: string;
    title: string;
    category: string;
    price: number;
    oldPrice?: number;
    rating: number;
    reviewsCount: number;
    description: string;
    variants: { sku: string; name: string }[];
    colors: { name: string; hex: string; variantSku?: string }[];
    inStock: boolean;
  };
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedVariantSku, setSelectedVariantSku] = useState(product.variants[0]?.sku || "");
  const selectedVariant = product.variants.find((variant) => variant.sku === selectedVariantSku);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || "");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const images = [
    "bg-orange-100",
    "bg-sky-100",
    "bg-emerald-100",
    "bg-purple-100",
  ];

  const handleDecrement = () => setQuantity((q) => Math.max(1, q - 1));
  const handleIncrement = () => setQuantity((q) => Math.min(99, q + 1));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
        <Link href="/" className="hover:text-orange-600">Accueil</Link>
        <ChevronRight className="w-4 h-4 text-slate-400" />
        <Link href="/shop" className="hover:text-orange-600">Catalogue</Link>
        <ChevronRight className="w-4 h-4 text-slate-400" />
        <span className="text-slate-900 font-medium truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Gallery Section */}
        <div className="space-y-4">
          <div className={`relative h-96 sm:h-[450px] ${images[activeImage]} rounded-3xl flex items-center justify-center border border-slate-200 overflow-hidden shadow-sm`}>
            <span className="text-slate-500 font-bold text-lg">Aperçu Visuel {activeImage + 1}</span>
            <span className="absolute top-4 start-4 bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full">
              En Stock au Maroc
            </span>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {images.map((imgBg, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`h-24 rounded-2xl ${imgBg} border-2 transition-all flex items-center justify-center text-xs font-bold text-slate-600 ${
                  activeImage === idx ? "border-orange-600 shadow-md scale-105" : "border-slate-200 hover:border-slate-300"
                }`}
              >
                Vue {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Product Info & Actions */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold text-orange-600 uppercase tracking-widest">{product.category}</span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-1">{product.title}</h1>

            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-1 text-amber-500 text-sm">
                <Star className="w-4 h-4 fill-amber-500" />
                <span className="font-bold text-slate-900">{product.rating}</span>
              </div>
              <span className="text-slate-300">•</span>
              <span className="text-sm text-slate-600 underline cursor-pointer hover:text-orange-600">
                {product.reviewsCount} avis de parents au Maroc
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-4 bg-orange-50/50 border border-orange-100 p-4 rounded-2xl">
            <span className="text-3xl font-black text-slate-900">{product.price} MAD</span>
            {product.oldPrice && (
              <span className="text-lg text-slate-400 line-through font-medium">{product.oldPrice} MAD</span>
            )}
            <span className="ms-auto bg-orange-100 text-orange-700 text-xs font-bold px-2.5 py-1 rounded-full">
              TVA incluse
            </span>
          </div>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {product.description}
          </p>

          {/* Variants Selection (e.g. Size / Age) */}
          {product.variants.length > 0 && (
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-900 block">
                Sélectionnez une variante : <span className="font-normal text-orange-600">{selectedVariant?.name}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant.sku}
                    onClick={() => {
                      setSelectedVariantSku(variant.sku);
                      const matchingColor = product.colors.find((color) => color.variantSku === variant.sku);
                      if (matchingColor) setSelectedColor(matchingColor.name);
                    }}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                      selectedVariantSku === variant.sku
                        ? "bg-orange-600 text-white border-orange-600 shadow-sm"
                        : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {variant.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colors Selection */}
          {product.colors.length > 0 && (
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-900 block">
                Couleur : <span className="font-normal text-slate-600">{selectedColor}</span>
              </label>
              <div className="flex items-center gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => {
                      setSelectedColor(c.name);
                      if (c.variantSku) setSelectedVariantSku(c.variantSku);
                    }}
                    className={`w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center ${
                      selectedColor === c.name ? "border-orange-600 scale-110 shadow-md" : "border-slate-300 hover:scale-105"
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  >
                    {selectedColor === c.name && <Check className="w-4 h-4 text-white drop-shadow-xs" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector & Add to Cart */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center border border-slate-200 rounded-2xl bg-white p-1 shadow-xs w-fit">
                <button
                  onClick={handleDecrement}
                  className="p-3 text-slate-600 hover:text-orange-600 transition-colors"
                  aria-label="Diminuer la quantité"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-bold text-slate-900">{quantity}</span>
                <button
                  onClick={handleIncrement}
                  disabled={quantity >= 99}
                  className="p-3 text-slate-600 hover:text-orange-600 transition-colors"
                  aria-label="Augmenter la quantité"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <AddToCartButton
                variantSku={selectedVariantSku}
                quantity={quantity}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 px-8 rounded-2xl shadow-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <><ShoppingCart className="w-5 h-5" /> Ajouter au panier — {(product.price * quantity).toLocaleString()} MAD</>
              </AddToCartButton>

            </div>
          </div>

          {/* Trust Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-200 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-orange-600 shrink-0" />
              <span>Livraison rapide 24h/48h au Maroc</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-sky-500 shrink-0" />
              <span>Paiement sécurisé à la livraison</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>Retours faciles sous 7 jours</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
