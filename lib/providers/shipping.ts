export type CreateShipmentInput = {  
  order_id: string;  
  amount_paise: number;  
  customer: {  
    name: string;  
    email: string;  
    phone: string;  
  };  
  shipping_address: any;  
  items: any[];  
};
  
export type CreateShipmentOutput = {  
  provider: "mock" | "shiprocket";
  
  // Shiprocket order id (or mock equivalent)  
  provider_order_id: string;
  
  // Shiprocket shipment id  
  shipment_id: string;
  
  // Booking outputs (AWB step)  
  awb_code: string;  
  courier_name: string;  
  courier_company_id?: string | null;
  
  // Pickup outputs  
  pickup_token_number?: string | null;  
  pickup_scheduled_at?: string | null;  // store ISO string, convert to timestamptz on insert  
  pickup_generated_at?: string | null;  // store ISO string
  
  status: "created" | "awb_assigned" | "pickup_scheduled";
  
  raw: any;  
};  
  
async function createMockShipment(input: CreateShipmentInput): Promise<CreateShipmentOutput> {  
  const now = Date.now();  
  return {  
   provider: "mock",  
    provider_order_id: `sr_mock_order_${now}`,  
    shipment_id: `sr_mock_shipment_${now}`,  
    awb_code: `AWBMOCK${String(now).slice(-8)}`,  
    courier_name: "MockCourier",  
    courier_company_id: "mock",  
    pickup_token_number: `MOCK_PICKUP_${now}`,  
    pickup_scheduled_at: new Date().toISOString(),  
    pickup_generated_at: new Date().toISOString(),  
    status: "pickup_scheduled",  
    raw: { note: "mock shipment booked + pickup scheduled", input },  
  };  
}
  

  
export async function createShipment(input: CreateShipmentInput) {  
  const provider = (process.env.SHIP_PROVIDER || "mock") as "mock" | "shiprocket";  
  if (provider === "shiprocket") return createShiprocketShipment(input);  
  return createMockShipment(input);  
} 

type ShiprocketTokenResp = { token: string };
  
async function shiprocketLogin(): Promise<string> {  
  const res = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {  
    method: "POST",  
    headers: { "Content-Type": "application/json" },  
    body: JSON.stringify({  
      email: process.env.SHIPROCKET_EMAIL,  
      password: process.env.SHIPROCKET_PASSWORD,  
    }),  
  });
  
  if (!res.ok) {  
    const txt = await res.text();  
    throw new Error(`Shiprocket login failed (${res.status}): ${txt}`);  
  }
  
  const data = (await res.json()) as ShiprocketTokenResp;  
  if (!data?.token) throw new Error("Shiprocket login: token missing in response");  
  return data.token;  
}
  
async function shiprocketCreateAdhocOrder(token: string, payload: any) {  
  const res = await fetch("https://apiv2.shiprocket.in/v1/external/orders/create/adhoc", {  
    method: "POST",  
    headers: {  
      "Content-Type": "application/json",  
      Authorization: `Bearer ${token}`,  
    },  
    body: JSON.stringify(payload),  
  });
  
  const json = await res.json().catch(() => null);  
  if (!res.ok) throw new Error(`Shiprocket create order failed (${res.status}): ${JSON.stringify(json)}`);  
  return json;  
}
  
async function shiprocketAssignAwb(token: string, shipment_id: number, courier_id?: number) {  
  const res = await fetch("https://apiv2.shiprocket.in/v1/external/courier/assign/awb", {  
    method: "POST",  
    headers: {  
      "Content-Type": "application/json",  
      Authorization: `Bearer ${token}`,  
    },  
    body: JSON.stringify(  
      courier_id ? { shipment_id, courier_id } : { shipment_id }  
    ),  
  });
  
  const json = await res.json().catch(() => null);  
  if (!res.ok) throw new Error(`Shiprocket assign awb failed (${res.status}): ${JSON.stringify(json)}`);  
  return json;  
}
  
async function shiprocketGeneratePickup(token: string, shipment_id: number) {  
  const res = await fetch("https://apiv2.shiprocket.in/v1/external/courier/generate/pickup", {  
    method: "POST",  
    headers: {  
      "Content-Type": "application/json",  
      Authorization: `Bearer ${token}`,  
    },  
    body: JSON.stringify({ shipment_id: [shipment_id] }),  
  });
  
  const json = await res.json().catch(() => null);  
  if (!res.ok) throw new Error(`Shiprocket generate pickup failed (${res.status}): ${JSON.stringify(json)}`);  
  return json;  
}
async function createShiprocketShipment(input: CreateShipmentInput): Promise<CreateShipmentOutput> {  
  const token = await shiprocketLogin();
  
  // NOTE: you MUST map your order.shipping_address + items into Shiprocket fields.  
  // Below is a minimal example; adjust to your order structure.  
  const pickup_location = process.env.SHIPROCKET_PICKUP_LOCATION;  
  if (!pickup_location) throw new Error("Missing SHIPROCKET_PICKUP_LOCATION");
  
  const shipAddr = input.shipping_address || {};  
  const orderItems = (input.items || []).map((it: any) => ({  
    name: it.name ?? it.title ?? "Item",  
    sku: it.sku ?? it.id ?? "SKU",  
    units: Number(it.quantity ?? 1),  
    selling_price: Number(it.price ?? 0),  
    discount: Number(it.discount ?? 0) || 0,  
    tax: Number(it.tax ?? 0) || 0,  
    hsn: it.hsn ?? undefined,  
  }));
  
  const sub_total = orderItems.reduce((s: number, it: any) => s + (it.selling_price * it.units), 0);
  
  const createPayload = {  
    order_id: input.order_id,                       // ideally use your *human* order number; UUID works but is ugly  
    order_date: new Date().toISOString().slice(0, 16).replace("T", " "),  
    pickup_location,
  
    billing_customer_name: input.customer.name,  
    billing_last_name: "",  
    billing_address: shipAddr.address1 ?? shipAddr.address ?? "",  
    billing_address_2: shipAddr.address2 ?? "",  
    billing_city: shipAddr.city ?? "",  
    billing_pincode: Number(shipAddr.pincode ?? shipAddr.zip ?? 0),  
    billing_state: shipAddr.state ?? "",  
    billing_country: shipAddr.country ?? "India",   // adjust  
    billing_email: input.customer.email,  
    billing_phone: String(input.customer.phone),
  
    shipping_is_billing: true,
  
    order_items: orderItems,
  
    payment_method: "Prepaid",  
    shipping_charges: 0,  
    giftwrap_charges: 0,  
    transaction_charges: 0,  
    total_discount: 0,  
    sub_total,
  
    length: Number(shipAddr.length ?? 10),  
    breadth: Number(shipAddr.breadth ?? 10),  
    height: Number(shipAddr.height ?? 10),  
    weight: Number(shipAddr.weight ?? 0.5),  
  };
  
  const created = await shiprocketCreateAdhocOrder(token, createPayload);  
  const sr_shipment_id = Number(created?.shipment_id);  
  const sr_order_id = String(created?.order_id);
  
  if (!sr_shipment_id || !sr_order_id) {  
    throw new Error(`Shiprocket create order: missing shipment_id/order_id: ${JSON.stringify(created)}`);  
  }
  
  const awb = await shiprocketAssignAwb(token, sr_shipment_id /*, optional courier_id */);  
  const awbData = awb?.response?.data;  
  const awb_code = String(awbData?.awb_code ?? "");  
  const courier_name = String(awbData?.courier_name ?? "");  
  const courier_company_id = awbData?.courier_company_id != null ? String(awbData.courier_company_id) : null;
  
  if (!awb_code || !courier_name) {  
    throw new Error(`Shiprocket assign awb: missing awb/courier: ${JSON.stringify(awb)}`);  
  }
  
  const pickup = await shiprocketGeneratePickup(token, sr_shipment_id);  
  const pickupResp = pickup?.response;
  
  const pickup_token_number = pickupResp?.pickup_token_number ? String(pickupResp.pickup_token_number) : null;  
  const pickup_scheduled_at = pickupResp?.pickup_scheduled_date  
    ? new Date(pickupResp.pickup_scheduled_date).toISOString()  
    : null;  
  const pickup_generated_at = pickupResp?.pickup_generated_date?.date  
    ? new Date(pickupResp.pickup_generated_date.date).toISOString()  
    : null;
  
  return {  
    provider: "shiprocket",  
    provider_order_id: sr_order_id,  
    shipment_id: String(sr_shipment_id),  
    awb_code,  
    courier_name,  
    courier_company_id,  
    pickup_token_number,  
    pickup_scheduled_at,  
    pickup_generated_at,  
    status: "pickup_scheduled",  
    raw: { created, awb, pickup },  
  };  
}    
 