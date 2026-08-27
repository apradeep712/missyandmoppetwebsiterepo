import type { Metadata } from 'next';
import PolicyPage from '../components/legal/PolicyPage';
import { H2, P, UL, PH } from '../components/legal/elements';

export const metadata: Metadata = {
  title: 'Returns & Exchange Policy | Missy & Moppet',
  description: 'How to return or exchange items purchased from Missy & Moppet.',
};

export default function ReturnsPage() {
  return (
    <PolicyPage title="Returns & Exchange Policy" lastUpdated="23 June 2026">
      <P>
        If something isn&apos;t quite right, we&apos;re here to help. Please review the conditions
        below before requesting a return or exchange.
      </P>

      <H2>1. Return window</H2>
      <UL>
        <li>Return or exchange requests must be raised within <PH>RETURN WINDOW, e.g. 7 days</PH> of delivery.</li>
        <li>To start a request, email <a className="underline hover:text-[#4b3b33]" href="mailto:missyandmoppet@gmail.com">missyandmoppet@gmail.com</a> with your order number and reason.</li>
      </UL>

      <H2>2. Condition of items</H2>
      <UL>
        <li>Items must be unused, unwashed, and undamaged, with all original tags and packaging intact.</li>
        <li>Custom-made, personalised, and <PH>other non-returnable categories, e.g. innerwear</PH> items cannot be returned unless damaged or defective.</li>
      </UL>

      <H2>3. Exchanges</H2>
      <P>
        We are happy to exchange for a different size or product, subject to availability. If the
        replacement differs in price, the difference will be <PH>collected / refunded</PH>.
      </P>

      <H2>4. Return process</H2>
      <UL>
        <li>Once your request is approved, we will arrange a pickup or share return instructions.</li>
        <li>Return shipping is <PH>free / charged at ₹X / borne by the customer</PH>, except where the item was damaged, defective, or incorrect.</li>
        <li>After we receive and inspect the item, your exchange or refund is processed per our <a className="underline hover:text-[#4b3b33]" href="/refund-policy">Refund &amp; Cancellation Policy</a>.</li>
      </UL>

      <H2>5. Damaged or incorrect items</H2>
      <P>
        For items that arrive damaged, defective, or incorrect, please report within{' '}
        <PH>REPORTING WINDOW, e.g. 48 hours</PH> with photos, and we will cover the cost of a
        replacement or refund.
      </P>
    </PolicyPage>
  );
}
