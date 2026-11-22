import Link from "next/link";
import { ShieldCheck, Truck, Clock, Headphones, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-background text-foreground mt-auto pt-16 pb-12 border-t border-gray-200">
      {/* Features bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-gray-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="flex items-start gap-4">
          <div className="bg-primary/10 text-primary p-3 rounded-xl">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-semibold text-white">Livraison Rapide</h4>
            <p className="text-sm text-white mt-1">Partout au Maroc en 24h à 48h ouvrées.</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="bg-secondary/10 text-white p-3 rounded-xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-semibold text-white">Paiement Sécurisé</h4>
            <p className="text-sm text-white mt-1">À la livraison à la réception de votre commande.</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="bg-primary/10 text-white p-3 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-semibold text-white">Service Client</h4>
            <p className="text-sm text-white mt-1">À votre écoute 6j/7 par téléphone et WhatsApp.</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="bg-secondary/10 text-slate-400 p-3 rounded-xl">
            <Headphones className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-semibold text-white">Garantie Qualité</h4>
            <p className="text-sm text-white mt-1">Produits testés et conformes aux normes de sécurité.</p>
          </div>
        </div>
      </div>

      {/* Main footer links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <span className="text-2xl font-black tracking-tight text-white">
            KIDS<span className="text-primary">MAROC</span>
          </span>
          <p className="text-sm text-white mt-4 leading-relaxed">
            Votre destination de confiance pour l&apos;univers de l&apos;enfant et de la famille au Maroc. Qualité, sécurité et prix doux.
          </p>
        </div>

        <div>
          <h5 className="font-semibold text-white mb-4">Catégories</h5>
          <ul className="space-y-2.5 text-sm text-white">
            <li><Link href="/categories/vetements" className="hover:text-primary transition-colors">Vêtements & Mode</Link></li>
            <li><Link href="/categories/jouets" className="hover:text-primary transition-colors">Jouets & Jeux</Link></li>
            <li><Link href="/categories/puericulture" className="hover:text-primary transition-colors">Puériculture</Link></li>
            <li><Link href="/categories/chambre" className="hover:text-primary transition-colors">Chambre & Déco</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-semibold text-white mb-4">Votre boutique</h5>
          <ul className="space-y-2.5 text-sm text-white">
            <li><Link href="/shop" className="hover:text-primary transition-colors">Tout le catalogue</Link></li>
            <li><Link href="/categories" className="hover:text-primary transition-colors">Nos catégories</Link></li>
            <li><Link href="/promos" className="hover:text-primary transition-colors">Promotions</Link></li>
            <li><Link href="/cart" className="hover:text-primary transition-colors">Mon panier</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-semibold text-white mb-4">Newsletter & Offres</h5>
          <p className="text-sm text-white mb-4">Retrouvez les nouveautés et offres disponibles dans notre sélection.</p>
          <Link href="/promos" className="text-sm font-semibold text-primary hover:text-primary-700 transition-colors">Voir les offres en cours</Link>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-200 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© 2026 Kids Maroc. Tous droits réservés.</p>
        <div className="flex items-center gap-4 text-slate-400">
          <span>🇲🇦 Conçu pour le Maroc</span>
          <span>•</span>
          <span className="flex items-center gap-1">Fait avec <Heart className="w-3.5 h-3.5 text-primary fill-primary" /> pour les familles</span>
        </div>
      </div>
    </footer>
  );
}
