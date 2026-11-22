import Link from "next/link";
import { ArrowRight, Sparkles, Shield, Gift, Truck } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { getCategoryContent, getFeaturedProducts } from "@/lib/catalog";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Hero Section with responsive grid and Moroccan context */}
      <section className="relative bg-gradient-to-r from-orange-600 via-amber-600 to-sky-600 text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center md:text-start">
            <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Collection Printemps / Été au Maroc
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Tout pour le bonheur de vos enfants
            </h1>
            <p className="text-base sm:text-lg text-white/90 max-w-lg mx-auto md:mx-0">
              Vêtements tendance, jouets éducatifs, poussettes et articles de puériculture de qualité supérieure. Livraison express à Casablanca, Rabat, Marrakech et partout au Maroc.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                href="/categories/nouveautes"
                className="bg-white text-orange-600 font-bold px-8 py-3.5 rounded-full hover:bg-slate-100 transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                Découvrir la boutique <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/promos"
                className="bg-black/20 backdrop-blur-md text-white font-bold px-8 py-3.5 rounded-full hover:bg-black/30 transition-colors border border-white/20 flex items-center justify-center gap-2"
              >
                Promotions -20%
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges Bar */}
      <section className="bg-white border-b border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-start">
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="bg-orange-50 text-orange-600 p-3 rounded-xl">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Livraison 24-48h</h4>
              <p className="text-xs text-slate-500">Partout au Maroc</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="bg-sky-50 text-sky-600 p-3 rounded-xl">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Paiement Sécurisé</h4>
              <p className="text-xs text-slate-500">À la livraison</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Garantie Qualité</h4>
              <p className="text-xs text-slate-500">Produits certifiés</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="bg-purple-50 text-purple-600 p-3 rounded-xl">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Service Client 6j/7</h4>
              <p className="text-xs text-slate-500">WhatsApp & Téléphone</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Explorez nos univers</h2>
            <p className="text-slate-600 mt-1 text-sm sm:text-base">Tout ce dont votre enfant a besoin, classé par catégorie.</p>
          </div>
          <Link
            href="/categories"
            className="hidden sm:flex items-center gap-1 text-sm font-semibold text-orange-600 hover:text-orange-700"
          >
            Voir tout <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { slug: "vetements", title: "Vêtements & Mode", href: "/categories/vetements", bg: "bg-orange-50 text-orange-600 border-orange-100" },
            { slug: "jouets", title: "Jouets & Jeux", href: "/categories/jouets", bg: "bg-sky-50 text-sky-600 border-sky-100" },
            { slug: "puericulture", title: "Puériculture", href: "/categories/puericulture", bg: "bg-emerald-50 text-emerald-600 border-emerald-100" },
            { slug: "chambre", title: "Chambre & Déco", href: "/categories/chambre", bg: "bg-purple-50 text-purple-600 border-purple-100" },
          ].map((cat, idx) => (
            <Link
              key={idx}
              href={cat.href}
              className="group bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-orange-500 transition-all flex flex-col items-center text-center relative overflow-hidden"
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl mb-4 border ${cat.bg} group-hover:scale-110 transition-transform`}>
                {cat.title[0]}
              </div>
              <h3 className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors">{cat.title}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Produits Vedettes</h2>
            <p className="text-slate-600 mt-1 text-sm sm:text-base">Les coups de cœur des parents au Maroc.</p>
          </div>
          <Link
            href="/shop"
            className="hidden sm:flex items-center gap-1 text-sm font-semibold text-orange-600 hover:text-orange-700"
          >
            Catalogue complet <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {getFeaturedProducts().map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </section>

      {/* Promotional Banner Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl text-white p-8 sm:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-4 max-w-lg text-center md:text-start">
            <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Promotions</span>
            <h3 className="text-3xl sm:text-4xl font-black tracking-tight">Découvrez les offres disponibles</h3>
            <p className="text-slate-300 text-sm sm:text-base">Retrouvez les remises en cours sur les produits de notre catalogue.</p>
            <Link href="/promos" className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-bold px-8 py-3.5 rounded-full transition-colors shadow-md">
              J&apos;en profite
            </Link>
          </div>
          <div className="w-full md:w-auto text-center bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/10">
            <div className="text-sm text-slate-300">Sélection remisée</div>
            <div className="text-2xl sm:text-3xl font-black text-orange-400 my-2">Jusqu&apos;à -20%</div>
            <div className="text-xs text-slate-400">Consultez les prix affichés dans le catalogue.</div>
          </div>
        </div>
      </section>
    </div>
  );
}