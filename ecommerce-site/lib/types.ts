export type CheckoutItem = {  
  product_id: string;  
  qty: number;  
  selected_age_months: number;  
};
  
export type CheckoutInput = {  
  customer: { name: string; email: string; phone: string };  
  shipping_address: { line1: string; city: string; state: string; pincode: string };  
  items: CheckoutItem[];  
};  