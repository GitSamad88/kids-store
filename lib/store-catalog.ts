import type { ProductCardProps } from "@/components/ProductCard";
import type { ProductDetailProps } from "@/components/ProductDetail";
import type { CollectionListingProps } from "@/components/CollectionListing";

type StoreProduct = ProductCardProps & {
  slug: string;
  variantSku: string;
  description: string;
  variants: ProductDetailProps["product"]["variants"];
  colors: ProductDetailProps["product"]["colors"];
  inStock: boolean;
};

export const storeProducts: StoreProduct[] = [
  {
    id: "poussette-compacte-tout-terrain",
    slug: "poussette-compacte",
    title: "Poussette Compacte Tout-Terrain Luxe",
    category: "Puériculture",
    price: 1890,
    oldPrice: 2200,
    rating: 4.9,
    reviewsCount: 28,
    badge: "-14%",
    imageBg: "bg-orange-100",
    variantSku: "POU-GRIS-01",
    description: "Une poussette compacte et robuste, conçue pour les promenades en ville comme à la campagne.",
    variants: [
      { sku: "POU-GRIS-01", name: "Gris Anthracite" },
      { sku: "POU-BEI-02", name: "Beige Sable" },
    ],
    colors: [
      { name: "Gris Anthracite", hex: "#334155", variantSku: "POU-GRIS-01" },
      { name: "Beige Sable", hex: "#d4b996", variantSku: "POU-BEI-02" },
    ],
    inStock: true,
  },
  {
    id: "ensemble-coton-bio-ete",
    slug: "ensemble-coton-bio-ete",
    title: "Ensemble Coton Bio Été",
    category: "Vêtements & Mode",
    price: 199,
    oldPrice: 250,
    rating: 4.8,
    reviewsCount: 42,
    badge: "Bio",
    imageBg: "bg-sky-100",
    variantSku: "ENS-BIO-03",
    description: "Ensemble doux et respirant en coton biologique certifié, adapté à la peau sensible de bébé.",
    variants: [
      { sku: "ENS-BIO-03", name: "0-3 mois" },
      { sku: "ENS-BIO-06", name: "3-6 mois" },
      { sku: "ENS-BIO-12", name: "6-12 mois" },
    ],
    colors: [{ name: "Écru", hex: "#f4ead8" }],
    inStock: true,
  },
  {
    id: "porteur-educatif-bois",
    slug: "porteur-educatif-bois",
    title: "Porteur Éducatif en Bois Montessori",
    category: "Jouets & Jeux",
    price: 349,
    oldPrice: 420,
    rating: 5,
    reviewsCount: 19,
    badge: "Populaire",
    imageBg: "bg-emerald-100",
    variantSku: "JOU-BOIS-01",
    description: "Un porteur en bois naturel pour stimuler l'équilibre et la motricité de l'enfant.",
    variants: [{ sku: "JOU-BOIS-01", name: "Bois naturel" }],
    colors: [{ name: "Bois naturel", hex: "#b77946" }],
    inStock: true,
  },
  {
    id: "chaise-haute-evolutive",
    slug: "chaise-haute-evolutive",
    title: "Chaise Haute Évolutive 3-en-1",
    category: "Repas & Allaitement",
    price: 890,
    oldPrice: 1050,
    rating: 4.7,
    reviewsCount: 34,
    badge: "-15%",
    imageBg: "bg-amber-100",
    variantSku: "REP-CHAISE-01",
    description: "Chaise haute confortable et facile à nettoyer, qui accompagne la croissance de votre enfant.",
    variants: [
      { sku: "REP-CHAISE-01", name: "Gris / Bois" },
      { sku: "REP-CHAISE-02", name: "Rose / Bois" },
    ],
    colors: [
      { name: "Gris", hex: "#64748b", variantSku: "REP-CHAISE-01" },
      { name: "Rose", hex: "#f472b6", variantSku: "REP-CHAISE-02" },
    ],
    inStock: true,
  },
];

export const productDetails: Record<string, ProductDetailProps["product"]> =
  Object.fromEntries(
    storeProducts.flatMap(({ id, slug, title, category, price, oldPrice, rating, reviewsCount, description, variants, colors, inStock }) => {
      const product = { id, title, category, price, oldPrice, rating: rating ?? 5, reviewsCount: reviewsCount ?? 0, description, variants, colors, inStock };
      return [[slug, product], [id, product]];
    }),
  );

const categoryDefinitions: Record<string, { title: string; description: string; productIds: string[] }> = {
  vetements: { title: "Vêtements & Mode Enfant", description: "Des vêtements confortables et doux pour la peau sensible des tout-petits.", productIds: ["ensemble-coton-bio-ete"] },
  jouets: { title: "Jouets & Jeux", description: "Des jeux éducatifs et des jouets choisis pour accompagner chaque étape.", productIds: ["porteur-educatif-bois"] },
  puericulture: { title: "Puériculture", description: "Les essentiels pour accompagner bébé à la maison et en promenade.", productIds: ["poussette-compacte-tout-terrain"] },
  chambre: { title: "Chambre & Déco", description: "Découvrez nos essentiels pour préparer un espace doux pour votre enfant.", productIds: [] },
  repas: { title: "Repas & Allaitement", description: "Des essentiels pratiques pour les repas et l'autonomie de bébé.", productIds: ["chaise-haute-evolutive"] },
  sorties: { title: "Poussettes & Sorties", description: "Tout le nécessaire pour sortir confortablement avec votre enfant.", productIds: ["poussette-compacte-tout-terrain"] },
  nouveautes: { title: "Nouveautés", description: "Découvrez la sélection de produits de la boutique.", productIds: storeProducts.map((product) => product.id) },
};

export const categorySlugs = Object.keys(categoryDefinitions);

export const categoryContent: Record<string, CollectionListingProps> = Object.fromEntries(
  Object.entries(categoryDefinitions).map(([slug, category]) => [slug, {
    categoryTitle: category.title,
    categoryDescription: category.description,
    products: storeProducts.filter((product) => category.productIds.includes(product.id)),
  }]),
);

export const promotionContent: CollectionListingProps = {
  categoryTitle: "Promotions",
  categoryDescription: "Retrouvez les offres et prix réduits disponibles dans notre sélection.",
  products: storeProducts.filter((product) => product.oldPrice !== undefined),
};
