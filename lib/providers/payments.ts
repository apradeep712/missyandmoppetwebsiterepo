import crypto from "crypto";
  
export type CreatePaymentOrderInput = {  
  amount_paise: number;  
  currency: string;  
  receipt: string;  
};
  
export type CreatePaymentOrderOutput = {  
  provider: "mock" | "razorpay";  
  provider_order_id: string;  
  amount_paise: number;  
  currency: string;  
};
  
export type VerifyPaymentInput = {  
  provider_order_id: string;  
  provider_payment_id: string;  
  provider_signature: string;  
};
  
export type VerifyPaymentOutput =  
  | { ok: true }  
  | { ok: false; reason: string };
  
function assertEnv(name: string) {  
  const v = process.env[name];  
  if (!v) throw new Error(`Missing env var: ${name}`);  
  return v;  
}
  
async function createMockOrder(input: CreatePaymentOrderInput): Promise<CreatePaymentOrderOutput> {  
  const provider_order_id = `order_mock_${Date.now()}_${Math.random().toString(16).slice(2)}`;  
  return {  
    provider: "mock",  
    provider_order_id,  
    amount_paise: input.amount_paise,  
    currency: input.currency,  
  };  
}
  
async function verifyMockPayment(_input: VerifyPaymentInput): Promise<VerifyPaymentOutput> {  
  // Always accept in mock mode  
  return { ok: true };  
}
  
// --- Razorpay (real) - kept here, but only used when PAYMENTS_PROVIDER=razorpay ---  
async function createRazorpayOrder(input: CreatePaymentOrderInput): Promise<CreatePaymentOrderOutput> {  
  const Razorpay = (await import("razorpay")).default;
  
  const key_id = assertEnv("RAZORPAY_KEY_ID");  
  const key_secret = assertEnv("RAZORPAY_KEY_SECRET");
  
  const razorpay = new Razorpay({ key_id, key_secret });  
  const order = await razorpay.orders.create({  
    amount: input.amount_paise,  
    currency: input.currency,  
    receipt: input.receipt,  
  });
  
  return {  
    provider: "razorpay",  
    provider_order_id: order.id,  
    amount_paise: Number(order.amount), 
     
    currency: order.currency,  
  };  
}
  
async function verifyRazorpayPayment(input: VerifyPaymentInput): Promise<VerifyPaymentOutput> {  
  const key_secret = assertEnv("RAZORPAY_KEY_SECRET");
  
  // Razorpay signature: HMAC_SHA256(order_id + "|" + payment_id)  
  const expected = crypto  
    .createHmac("sha256", key_secret)  
    .update(`${input.provider_order_id}|${input.provider_payment_id}`)  
    .digest("hex");
  
  if (expected !== input.provider_signature) {  
    return { ok: false, reason: "Signature mismatch" };  
  }  
  return { ok: true };  
}
  
export async function createPaymentOrder(input: CreatePaymentOrderInput) {  
  const provider = (process.env.PAYMENTS_PROVIDER || "mock") as "mock" | "razorpay";  
  if (provider === "razorpay") return createRazorpayOrder(input);  
  return createMockOrder(input);  
}
  
export async function verifyPayment(input: VerifyPaymentInput) {  
  const provider = (process.env.PAYMENTS_PROVIDER || "mock") as "mock" | "razorpay";  
  if (provider === "razorpay") return verifyRazorpayPayment(input);  
  return verifyMockPayment(input);  
}  