"use client";
import { useState } from "react";
export default function PricingPage() {
  const [busy, setBusy] = useState(false);
  async function buy() {
    setBusy(true);
    const res = await fetch("/api/checkout", { method:"POST" });
    const { url } = await res.json();
    window.location.href = url;
  }
  return (
    <div className="max-w-2xl mx-auto card p-8 text-center">
      <h1 className="text-2xl font-bold mb-2">Listing Credits</h1>
      <p className="text-gray-700 mb-6">Buy a credit to publish or boost your EV listings.</p>
      <div className="border rounded-xl p-6">
        <div className="text-xl font-semibold mb-2">Standard Listing</div>
        <div className="text-3xl font-bold mb-4">$XX</div>
        <button onClick={buy} className="btn btn-primary" disabled={busy}>{busy ? "Redirecting…" : "Buy with Stripe"}</button>
      </div>
    </div>
  );
}
