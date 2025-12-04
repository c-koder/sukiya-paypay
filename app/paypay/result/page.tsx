// app/paypay/result/page.tsx

export const dynamic = "force-dynamic";

import PayPayResultClient from "./PayPayResultClient";

type ResultPageProps = {
  searchParams: { merchantPaymentId?: string };
};

export default function PayPayResultPage({ searchParams }: ResultPageProps) {
  const merchantPaymentId = searchParams.merchantPaymentId ?? null;

  return <PayPayResultClient merchantPaymentId={merchantPaymentId} />;
}
