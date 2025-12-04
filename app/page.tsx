// app/page.tsx
"use client";

import { useState } from "react";

export default function HomePage() {
  const [amount, setAmount] = useState(10);
  const [description, setDescription] = useState("Sandbox test order");
  const [loading, setLoading] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  async function handleCreatePayment(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setLastError(null);

    try {
      const res = await fetch("/api/paypay/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, description }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Create payment failed", data);
        setLastError(data?.error || "Failed to create payment. See console.");
        setLoading(false);
        return;
      }

      const url = data?.body?.data?.url || data?.body?.data?.link || null;

      if (!url) {
        console.error("No URL in PayPay response", data);
        setLastError("No payment URL returned by PayPay");
        setLoading(false);
        return;
      }

      // Redirect to PayPay Web Cashier
      window.location.href = url;
    } catch (err: any) {
      console.error(err);
      setLastError(err?.message || "Unexpected error");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-6 border rounded-xl p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">
          PayPay Web Payment Sandbox Test
        </h1>
        <form onSubmit={handleCreatePayment} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Amount (JPY)
            </label>
            <input
              type="number"
              min={1}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white rounded py-2 text-sm disabled:opacity-60"
          >
            {loading ? "Creating payment..." : "Create PayPay payment"}
          </button>
        </form>
        {lastError && (
          <p className="text-sm text-red-600">Error. {lastError}</p>
        )}
        <p className="text-xs text-gray-500">
          This uses PayPay sandbox Web Cashier. you need the PayPay app or a
          sandbox account to complete the flow.
        </p>
      </div>
    </main>
  );
}
