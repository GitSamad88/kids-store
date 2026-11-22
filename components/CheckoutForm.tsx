'use client';

import { useState, type FormEvent } from "react";

export function CheckoutForm() {
  const [error, setError] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Impossible de valider votre commande.");
      setOrderNumber(result.orderNumber);
      window.dispatchEvent(new Event("cart:updated"));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Impossible de valider votre commande.");
    } finally {
      setSubmitting(false);
    }
  }

  if (orderNumber) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-emerald-200 bg-white p-8 text-center">
        <h1 className="text-2xl font-black text-slate-900">Commande confirmée</h1>
        <p className="mt-3 text-slate-600">Votre numéro de commande est <strong>{orderNumber}</strong>.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-xl space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
      <h1 className="text-2xl font-black text-slate-900">Finaliser ma commande</h1>
      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <label className="block text-sm font-semibold">Nom complet<input required minLength={2} name="customerName" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
      <label className="block text-sm font-semibold">Téléphone<input required name="customerPhone" placeholder="0612345678" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
      <label className="block text-sm font-semibold">Email (facultatif)<input type="email" name="customerEmail" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
      <label className="block text-sm font-semibold">Adresse de livraison<textarea required minLength={5} name="shippingAddress" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
      <label className="block text-sm font-semibold">Ville<input required minLength={2} name="city" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
      <label className="block text-sm font-semibold">Paiement<select name="paymentMethod" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"><option value="COD">Paiement à la livraison</option></select></label>
      <button type="submit" disabled={submitting} className="w-full rounded-xl bg-orange-600 px-5 py-3 font-bold text-white hover:bg-orange-700 disabled:opacity-60">{submitting ? "Validation…" : "Confirmer la commande"}</button>
    </form>
  );
}
