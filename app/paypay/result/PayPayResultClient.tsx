// app/paypay/result/PayPayResultClient.tsx
"use client";

import { useEffect, useState } from "react";

type StatusResult = {
  payPayStatus: number;
  body: any;
};

export default function PayPayResultClient({
  merchantPaymentId,
}: {
  merchantPaymentId: string | null;
}) {
  const [loading, setLoading] = useState(true);
  const [statusData, setStatusData] = useState<StatusResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStatus() {
      if (!merchantPaymentId) {
        setError("merchantPaymentId missing in query");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `/api/paypay/status?merchantPaymentId=${encodeURIComponent(
            merchantPaymentId
          )}`
        );
        const data = await res.json();

        if (!res.ok) {
          console.error("Status check failed", data);
          setError(
            data?.error || "Failed to fetch payment status. See console."
          );
        } else {
          setStatusData(data);
        }
      } catch (err: any) {
        console.error(err);
        setError(err?.message || "Unexpected error");
      } finally {
        setLoading(false);
      }
    }

    fetchStatus();
  }, [merchantPaymentId]);

  const paymentState =
    statusData?.body?.data?.status || statusData?.body?.data?.state;

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-xl w-full space-y-4 border rounded-xl p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">PayPay Payment Result</h1>
        <p className="text-sm text-gray-600">
          merchantPaymentId.{" "}
          <span className="font-mono">{merchantPaymentId}</span>
        </p>

        {loading && <p>Checking payment status...</p>}

        {!loading && error && (
          <p className="text-sm text-red-600">Error. {error}</p>
        )}

        {!loading && !error && statusData && (
          <div className="space-y-2">
            <p className="text-sm">
              PayPay HTTP status.{" "}
              <span className="font-mono">{statusData.payPayStatus}</span>
            </p>
            <p className="text-sm">
              Payment state. <span className="font-mono">{paymentState}</span>
            </p>
            <details className="text-xs">
              <summary className="cursor-pointer">Raw PayPay response</summary>
              <pre className="mt-2 max-h-80 overflow-auto bg-gray-100 p-2 rounded">
                {JSON.stringify(statusData.body, null, 2)}
              </pre>
            </details>
          </div>
        )}

        <a
          href="/"
          className="inline-block mt-4 text-sm text-blue-600 underline"
        >
          Back to home
        </a>
      </div>
    </main>
  );
}
