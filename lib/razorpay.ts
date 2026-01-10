import Razorpay from "razorpay";
  
function assertEnv(name: string) {  
  const v = process.env[name];  
  if (!v) throw new Error(`Missing env var: ${name}`);  
  return v;  
}
  
export function getRazorpayClient() {  
  const key_id = assertEnv("RAZORPAY_KEY_ID");  
  const key_secret = assertEnv("RAZORPAY_KEY_SECRET");  
  return new Razorpay({ key_id, key_secret });  
}  