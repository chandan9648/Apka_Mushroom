export type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  handler: (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => void;
  prefill?: { name?: string; email?: string; contact?: string };
  notes?: Record<string, string>;
  theme?: { color?: string };
};

declare global {
  interface Window {
    Razorpay?: new (opts: RazorpayOptions) => { open: () => void };
  }
}

export async function loadRazorpay(): Promise<void> {
  if (typeof window === "undefined") return;
  if (window.Razorpay) return;

  await new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay"));
    document.body.appendChild(script);
  });

  if (!window.Razorpay) throw new Error("Razorpay script loaded but not available");
}
