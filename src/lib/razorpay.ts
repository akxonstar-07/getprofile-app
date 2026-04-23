// ═══════════════════════════════════════════════
// getprofile.link — Razorpay Payment Engine (Phase 11)
// Scaffold for real payment integration
// ═══════════════════════════════════════════════

export interface PaymentOrder {
  orderId: string;
  amount: number;          // in paise (₹1 = 100 paise)
  currency: string;
  receipt: string;
  creatorId: string;
  buyerId?: string;
  buyerName: string;
  buyerEmail: string;
  type: "credit_purchase" | "product_purchase" | "subscription" | "tip";
  metadata?: Record<string, any>;
}

export interface PaymentVerification {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export const RAZORPAY_CONFIG = {
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
  currency: "INR",
  company_name: "getprofile.link",
  company_logo: "/logo.png",
  theme_color: "#6366f1",
};

/**
 * Check if Razorpay is configured (has API keys)
 */
export function isRazorpayConfigured(): boolean {
  return !!(RAZORPAY_CONFIG.key_id && RAZORPAY_CONFIG.key_secret);
}

/**
 * Create a Razorpay order (server-side)
 * Returns order details for client-side checkout
 */
export async function createRazorpayOrder(params: {
  amount: number;     // in INR (will be converted to paise)
  receipt: string;
  notes?: Record<string, string>;
}): Promise<{ id: string; amount: number; currency: string } | null> {
  if (!isRazorpayConfigured()) {
    console.warn("[RAZORPAY] Not configured — returning simulation order");
    return {
      id: `sim_order_${Date.now()}`,
      amount: params.amount * 100,
      currency: "INR",
    };
  }

  try {
    const auth = Buffer.from(`${RAZORPAY_CONFIG.key_id}:${RAZORPAY_CONFIG.key_secret}`).toString("base64");
    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: params.amount * 100, // Convert to paise
        currency: RAZORPAY_CONFIG.currency,
        receipt: params.receipt,
        notes: params.notes || {},
      }),
    });

    if (!res.ok) {
      console.error("[RAZORPAY] Order creation failed:", await res.text());
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("[RAZORPAY] Order creation error:", error);
    return null;
  }
}

/**
 * Verify Razorpay payment signature (server-side)
 */
export async function verifyRazorpayPayment(verification: PaymentVerification): Promise<boolean> {
  if (!isRazorpayConfigured()) {
    // Simulation mode — always verify
    return verification.razorpay_order_id.startsWith("sim_");
  }

  try {
    const crypto = await import("crypto");
    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_CONFIG.key_secret)
      .update(`${verification.razorpay_order_id}|${verification.razorpay_payment_id}`)
      .digest("hex");

    return expectedSignature === verification.razorpay_signature;
  } catch (error) {
    console.error("[RAZORPAY] Verification error:", error);
    return false;
  }
}

/**
 * Calculate platform fee and creator payout
 */
export function calculatePayout(amountPaid: number, platformFeePercent: number = 10) {
  const platformFee = Math.round(amountPaid * (platformFeePercent / 100));
  const creatorPayout = amountPaid - platformFee;
  return { platformFee, creatorPayout, amountPaid };
}

/**
 * Get Razorpay checkout options for client-side
 */
export function getRazorpayCheckoutOptions(order: PaymentOrder & { razorpayOrderId: string }) {
  return {
    key: RAZORPAY_CONFIG.key_id,
    amount: order.amount,
    currency: order.currency || "INR",
    name: RAZORPAY_CONFIG.company_name,
    description: `${order.type === "credit_purchase" ? "Creator Credits" : order.type === "subscription" ? "Plan Subscription" : "Purchase"} - ${order.receipt}`,
    order_id: order.razorpayOrderId,
    prefill: {
      name: order.buyerName,
      email: order.buyerEmail,
    },
    theme: {
      color: RAZORPAY_CONFIG.theme_color,
    },
    modal: {
      confirm_close: true,
      ondismiss: () => console.log("[RAZORPAY] Payment modal dismissed"),
    },
  };
}

/**
 * Subscription plan IDs (to be created in Razorpay dashboard)
 */
export const SUBSCRIPTION_PLANS = {
  PRO_MONTHLY: {
    name: "Pro Monthly",
    amount: 749,       // ₹749/month
    interval: 1,
    period: "monthly",
    razorpay_plan_id: process.env.RAZORPAY_PRO_MONTHLY_PLAN_ID || "",
  },
  PRO_ANNUAL: {
    name: "Pro Annual",
    amount: 5999,      // ₹5999/year (~₹500/month)
    interval: 1,
    period: "yearly",
    razorpay_plan_id: process.env.RAZORPAY_PRO_ANNUAL_PLAN_ID || "",
  },
  MAX_MONTHLY: {
    name: "Max Monthly",
    amount: 2499,      // ₹2499/month
    interval: 1,
    period: "monthly",
    razorpay_plan_id: process.env.RAZORPAY_MAX_MONTHLY_PLAN_ID || "",
  },
  MAX_ANNUAL: {
    name: "Max Annual",
    amount: 19999,     // ₹19999/year (~₹1666/month)
    interval: 1,
    period: "yearly",
    razorpay_plan_id: process.env.RAZORPAY_MAX_ANNUAL_PLAN_ID || "",
  },
};
