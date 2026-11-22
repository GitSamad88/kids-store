'use client';

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type CartData = {
  items: Array<{
    id: string;
    title: string;
    variantName: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    image: string | null;
  }>;
  subtotal: number;
  shippingCost: number;
  total: number;
};

const emptyCart: CartData = { items: [], subtotal: 0, shippingCost: 0, total: 0 };

export function CartView() {
  const [cart, setCart] = useState<CartData>(emptyCart);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/cart", { cache: "no-store" });
      if (!response.ok) throw new Error("Impossible de charger le panier.");
      setCart(await response.json());
      setError(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Impossible de charger le panier.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initialRefresh = window.setTimeout(() => void refresh(), 0);
    window.addEventListener("cart:updated", refresh);
    return () => {
      window.clearTimeout(initialRefresh);
      window.removeEventListener("cart:updated", refresh);
    };
  }, [refresh]);

  async function changeQuantity(itemId: string, quantity: number) {
    const response = await fetch(`/api/cart/${itemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });
    if (!response.ok) {
      const result = await response.json().catch(() => null);
      setError(result?.error ?? "Impossible de modifier la quantité.");
      return;
    }
    setCart(await response.json());
    window.dispatchEvent(new Event("cart:updated"));
  }

  async function removeItem(itemId: string) {
    const response = await fetch(`/api/cart/${itemId}`, { method: "DELETE" });
    if (!response.ok) {
      setError("Impossible de retirer cet article du panier.");
      return;
    }
    setCart(await response.json());
    window.dispatchEvent(new Event("cart:updated"));
  }

  if (loading) return <p className="py-16 text-center text-slate-600">Chargement du panier…</p>;

  return (
    <section className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-black text-slate-900">Votre panier</h1>
      {error && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {cart.items.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <p className="mb-5 text-slate-600">Votre panier est vide.</p>
          <Link href="/shop" className="inline-flex rounded-full bg-orange-600 px-6 py-3 font-bold text-white hover:bg-orange-700">Continuer mes achats</Link>
        </div>
      ) : (
        <div className="space-y-6">
          <ul className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white px-5">
            {cart.items.map((item) => (
              <li key={item.id} className="flex flex-wrap items-center justify-between gap-4 py-5">
                <div className="min-w-48 flex-1">
                  <h2 className="font-bold text-slate-900">{item.title}</h2>
                  <p className="text-sm text-slate-500">{item.variantName} · {item.unitPrice.toLocaleString()} MAD</p>
                </div>
                <div className="flex items-center gap-2">
                  <button aria-label={`Diminuer la quantité de ${item.title}`} onClick={() => void changeQuantity(item.id, item.quantity - 1)} className="h-9 w-9 rounded-lg border border-slate-200" disabled={item.quantity <= 1}>−</button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button aria-label={`Augmenter la quantité de ${item.title}`} onClick={() => void changeQuantity(item.id, item.quantity + 1)} className="h-9 w-9 rounded-lg border border-slate-200">+</button>
                </div>
                <strong className="w-28 text-right">{item.lineTotal.toLocaleString()} MAD</strong>
                <button onClick={() => void removeItem(item.id)} className="text-sm text-red-600 hover:underline">Retirer</button>
              </li>
            ))}
          </ul>
          <div className="ml-auto max-w-sm space-y-2 rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex justify-between"><span>Sous-total</span><span>{cart.subtotal.toLocaleString()} MAD</span></div>
            <div className="flex justify-between"><span>Livraison</span><span>{cart.shippingCost === 0 ? "Offerte" : `${cart.shippingCost} MAD`}</span></div>
            <div className="flex justify-between border-t border-slate-200 pt-3 text-lg font-black"><span>Total</span><span>{cart.total.toLocaleString()} MAD</span></div>
            <Link href="/checkout" className="mt-3 block rounded-xl bg-orange-600 px-5 py-3 text-center font-bold text-white hover:bg-orange-700">Passer la commande</Link>
          </div>
        </div>
      )}
    </section>
  );
}
