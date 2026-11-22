'use client';

import { useState, type ReactNode } from "react";
import { ShoppingBag } from "lucide-react";

export function AddToCartButton({
  variantSku,
  quantity = 1,
  className,
  children,
}: {
  variantSku: string;
  quantity?: number;
  className: string;
  children?: ReactNode;
}) {
  const [state, setState] = useState<"idle" | "loading" | "added" | "error">("idle");

  async function addItem() {
    setState("loading");
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantSku, quantity }),
      });
      if (!response.ok) throw new Error("Impossible d'ajouter ce produit au panier.");
      setState("added");
      window.dispatchEvent(new Event("cart:updated"));
    } catch {
      setState("error");
    }
  }

  return (
    <span className="inline-flex flex-col items-stretch">
      <button type="button" className={className} onClick={addItem} disabled={state === "loading"}>
        {state === "loading" ? "Ajout…" : state === "added" ? "Ajouté au panier" : state === "error" ? "Réessayer" : children ?? <><ShoppingBag className="w-4 h-4" /><span className="sr-only">Ajouter au panier</span></>}
      </button>
      {state === "error" && <span role="status" className="mt-2 text-xs text-red-600">Vérifiez le stock et réessayez.</span>}
    </span>
  );
}
