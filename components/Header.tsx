'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingCart, Search, Menu, Phone, Globe } from "lucide-react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    const refreshCart = async () => {
      try {
        const response = await fetch("/api/cart", { cache: "no-store" });
        if (response.ok) {
          const cart = await response.json();
          setCartTotal(Number(cart.total) || 0);
        }
      } catch {
        setCartTotal(0);
      }
    };
    void refreshCart();
    window.addEventListener("cart:updated", refreshCart);
    return () => window.removeEventListener("cart:updated", refreshCart);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-xs">
      {/* Top announcement bar */}
      <div className="bg-primary text-white text-xs py-2 px-4 text-center font-medium flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <Phone className="w-3.5 h-3.5" />
          <span>Service client & Commande WhatsApp: +212 6 00 00 00 00</span>
        </div>

        <div className="hidden sm:flex items-center gap-4">
          <span>📦 Livraison partout au Maroc</span>
          <span>💳 Paiement à la livraison</span>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Mobile menu & Logo */}
        <div className="flex items-center gap-3">
          <button
            className="md:hidden p-2 text-slate-700 hover:text-primary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6" />
            <span className="sr-only">Menu</span>
          </button>

          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tight text-primary">
              KIDS<span className="text-sky-500">MAROC</span>
            </span>
          </Link>
        </div>

        {/* Search bar */}
        <div className="hidden md:flex flex-1 max-w-xl mx-4">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Rechercher un produit, un jouet, une marque..."
              className="w-full bg-slate-100 border border-slate-200 rounded-full py-2.5 ps-4 pe-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
            />
            <button className="absolute end-1 top-1/2 -translate-y-1/2 bg-primary text-white p-2 rounded-full hover:bg-primary-700 transition-colors">
              <Search className="w-4 h-4" />
              <span className="sr-only">Rechercher</span>
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-primary px-3 py-2 rounded-lg border border-slate-200">
            <Globe className="w-4 h-4 text-slate-400" />
            <span>FR / العربية</span>
          </button>

          <Link href="/cart" className="relative flex items-center gap-2 bg-slate-50 text-primary border border-slate-200 px-4 py-2 rounded-full hover:bg-slate-100 transition-colors font-medium">
            <ShoppingCart className="w-5 h-5" />
            <span className="hidden sm:inline text-sm">Panier</span>
            <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {cartTotal.toLocaleString()} MAD
            </span>
          </Link>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="border-t border-slate-100 bg-white hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-8 h-12 text-sm font-medium text-slate-700">
          <Link href="/categories/vetements" className="hover:text-primary transition-colors">Vêtements & Mode</Link>
          <Link href="/categories/jouets" className="hover:text-primary transition-colors">Jouets & Jeux</Link>
          <Link href="/categories/puericulture" className="hover:text-primary transition-colors">Puériculture</Link>
          <Link href="/categories/chambre" className="hover:text-primary transition-colors">Chambre & Déco</Link>
          <Link href="/categories/repas" className="hover:text-primary transition-colors">Repas & Allaitement</Link>
          <Link href="/categories/sorties" className="hover:text-primary transition-colors">Poussettes & Sorties</Link>
          <Link href="/promos" className="text-primary font-semibold hover:text-primary-700 transition-colors">Promotions</Link>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
            <Link href="/categories/vetements" className="block py-2 text-slate-900 hover:text-primary transition-colors">
              Vêtements & Mode
            </Link>
            <Link href="/categories/jouets" className="block py-2 text-slate-900 hover:text-primary transition-colors">
              Jouets & Jeux
            </Link>
            <Link href="/categories/puericulture" className="block py-2 text-slate-900 hover:text-primary transition-colors">
              Puériculture
            </Link>
            <Link href="/categories/chambre" className="block py-2 text-slate-900 hover:text-primary transition-colors">
              Chambre & Déco
            </Link>
            <Link href="/categories/repas" className="block py-2 text-slate-900 hover:text-primary transition-colors">
              Repas & Allaitement
            </Link>
            <Link href="/categories/sorties" className="block py-2 text-slate-900 hover:text-primary transition-colors">
              Poussettes & Sorties
            </Link>
            <Link href="/promos" className="block text-primary font-semibold hover:text-primary-700 transition-colors">
              Promotions
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
