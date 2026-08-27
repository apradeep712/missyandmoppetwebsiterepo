import type { Metadata } from 'next';
import PolicyPage from '../components/legal/PolicyPage';
import { H2, P, UL, PH } from '../components/legal/elements';

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy | Missy & Moppet',
  description: 'How order cancellations and refunds work at Missy & Moppet.',
};

export default function RefundPolicyPage() {
  return (
    <PolicyPage title="Refund & Cancellation Policy" lastUpdated="23 June 2026">
      <P>
        We want you to love what you order. This policy explains when and how orders can be
        cancelled and refunded.
      </P>

      <H2>1. Order cancellation</H2>
      <UL>
        <li>You may cancel an order within <PH>CANCELLATION WINDOW, e.g. 24 hours</PH> of placing it, provided it has not yet been dispatched.</li>
        <li>To cancel, email <a className="underline hover:text-[#4b3b33]" href="mailto:missyandmoppet@gmail.com">missyandmoppet@gmail.com</a> with your order number.</li>
        <li>Once an order has been dispatched, it can no longer be cancelled but may be eligible for return — see our <a className="underline hover:text-[#4b3b33]" href="/returns">Returns &amp; Exchange Policy</a>.</li>
      </UL>

      <H2>2. Refund eligibility</H2>
      <UL>
        <li>Refunds are issued for cancelled orders, items returned in line with our Returns Policy, or orders we are unable to fulfil.</li>
        <li>Custom-made, personalised, or made-to-order items are <strong>non-refundable</strong> unless they arrive damaged or defective.</li>
        <li><PH>LIST ANY OTHER NON-REFUNDABLE ITEMS, e.g. innerwear, sale items</PH>.</li>
      </UL>

      <H2>3. Refund method &amp; timeline</H2>
      <UL>
        <li>Approved refunds are processed to your original payment method via Razorpay.</li>
        <li>Refunds are typically completed within <PH>REFUND TIMELINE, e.g. 5–7 business days</PH> of approval; the time for funds to reflect depends on your bank.</li>
        <li>Shipping charges are <PH>refundable / non-refundable</PH> except where the return is due to our error.</li>
      </UL>

      <H2>4. Damaged or incorrect items</H2>
      <P>
        If your order arrives damaged, defective, or incorrect, contact us within{' '}
        <PH>REPORTING WINDOW, e.g. 48 hours</PH> of delivery with photos, and we will arrange a
        replacement or full refund at no extra cost.
      </P>

      <H2>5. Contact</H2>
      <P>
        For any refund or cancellation request, email{' '}
        <a className="underline hover:text-[#4b3b33]" href="mailto:missyandmoppet@gmail.com">missyandmoppet@gmail.com</a>.
      </P>
    </PolicyPage>
  );
}
