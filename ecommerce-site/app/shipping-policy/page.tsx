import type { Metadata } from 'next';
import PolicyPage from '../components/legal/PolicyPage';
import { H2, P, UL, PH } from '../components/legal/elements';

export const metadata: Metadata = {
  title: 'Shipping & Delivery Policy | Missy & Moppet',
  description: 'Dispatch times, delivery estimates, charges, and tracking for Missy & Moppet orders.',
};

export default function ShippingPolicyPage() {
  return (
    <PolicyPage title="Shipping & Delivery Policy" lastUpdated="23 June 2026">
      <P>
        We ship across India through our logistics partner, Shiprocket. Here is what to expect
        after you place an order.
      </P>

      <H2>1. Order processing &amp; dispatch</H2>
      <UL>
        <li>Orders are processed and dispatched within <PH>DISPATCH TIME, e.g. 1–3 business days</PH> of confirmation.</li>
        <li>Custom or made-to-order items may take longer — typically <PH>CUSTOM ORDER TIME</PH>.</li>
        <li>Orders are not dispatched on <PH>holidays / non-working days</PH>.</li>
      </UL>

      <H2>2. Delivery estimates</H2>
      <UL>
        <li>Once dispatched, deliveries usually arrive within <PH>DELIVERY TIME, e.g. 3–7 business days</PH>, depending on your location.</li>
        <li>Remote or non-metro pincodes may take additional time.</li>
      </UL>

      <H2>3. Shipping charges</H2>
      <UL>
        <li>Shipping charges (if any) are shown at checkout before payment.</li>
        <li><PH>State free-shipping threshold, e.g. Free shipping on orders above ₹X</PH>.</li>
      </UL>

      <H2>4. Tracking</H2>
      <P>
        Once your order ships, we will share tracking details by{' '}
        <PH>email / SMS / WhatsApp</PH> so you can follow its progress.
      </P>

      <H2>5. Serviceable areas</H2>
      <P>
        We currently ship to <PH>serviceable regions, e.g. all serviceable pincodes within India</PH>.
        If your pincode is not serviceable, we will contact you with options.
      </P>

      <H2>6. Delays</H2>
      <P>
        Delivery times are estimates and may be affected by factors outside our control (weather,
        courier delays, regional restrictions). If your order is significantly delayed, contact us
        at <a className="underline hover:text-[#4b3b33]" href="mailto:missyandmoppet@gmail.com">missyandmoppet@gmail.com</a>.
      </P>
    </PolicyPage>
  );
}
