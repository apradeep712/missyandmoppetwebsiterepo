import type { Metadata } from 'next';
import PolicyPage from '../components/legal/PolicyPage';
import { H2, P, UL, PH } from '../components/legal/elements';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Missy & Moppet',
  description: 'The terms and conditions governing your use of the Missy & Moppet website and purchases.',
};

export default function TermsPage() {
  return (
    <PolicyPage title="Terms & Conditions" lastUpdated="23 June 2026">
      <P>
        These Terms &amp; Conditions (&quot;Terms&quot;) govern your access to and use of the
        Missy &amp; Moppet website (the &quot;Site&quot;), operated by{' '}
        <PH>LEGAL ENTITY NAME</PH> (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;).
        By using the Site or placing an order, you agree to these Terms.
      </P>

      <H2>1. Eligibility &amp; account</H2>
      <UL>
        <li>You must be at least 18 years old, or use the Site under the supervision of a parent or guardian.</li>
        <li>You are responsible for keeping your account details accurate and for activity under your account.</li>
      </UL>

      <H2>2. Products &amp; pricing</H2>
      <UL>
        <li>All prices are listed in Indian Rupees (₹) and are inclusive of applicable taxes unless stated otherwise.</li>
        <li>We make reasonable efforts to display product colours and details accurately, but actual appearance may vary slightly.</li>
        <li>We reserve the right to correct pricing errors and to modify or discontinue any product without notice.</li>
      </UL>

      <H2>3. Orders &amp; acceptance</H2>
      <UL>
        <li>Your order is an offer to buy. We may accept or decline it (for example, if an item is out of stock or a pricing error occurred).</li>
        <li>A contract is formed only once we confirm dispatch of your order.</li>
        <li>Payments are processed securely through our payment partner, Razorpay. We do not store your full card details.</li>
      </UL>

      <H2>4. Cancellations, refunds &amp; returns</H2>
      <P>
        Cancellations, refunds, returns and exchanges are governed by our{' '}
        <a className="underline hover:text-[#4b3b33]" href="/refund-policy">Refund &amp; Cancellation Policy</a>{' '}
        and{' '}
        <a className="underline hover:text-[#4b3b33]" href="/returns">Returns &amp; Exchange Policy</a>.
        Shipping timelines are described in our{' '}
        <a className="underline hover:text-[#4b3b33]" href="/shipping-policy">Shipping &amp; Delivery Policy</a>.
      </P>

      <H2>5. Intellectual property</H2>
      <P>
        All content on the Site — including logos, designs, illustrations, text and images — is
        owned by or licensed to <PH>LEGAL ENTITY NAME</PH> and may not be reproduced or used
        without our prior written permission.
      </P>

      <H2>6. Acceptable use</H2>
      <UL>
        <li>Do not use the Site for any unlawful purpose or in a way that could damage or disrupt it.</li>
        <li>Do not attempt to gain unauthorised access to any part of the Site or its systems.</li>
      </UL>

      <H2>7. Limitation of liability</H2>
      <P>
        To the maximum extent permitted by law, we are not liable for any indirect or
        consequential loss arising from your use of the Site. Nothing in these Terms limits
        rights you have under the Consumer Protection Act, 2019 or other applicable Indian law.
      </P>

      <H2>8. Governing law &amp; jurisdiction</H2>
      <P>
        These Terms are governed by the laws of India. Any disputes are subject to the exclusive
        jurisdiction of the courts of <PH>CITY, STATE</PH>.
      </P>

      <H2>9. Contact</H2>
      <P>
        Questions about these Terms? Email us at{' '}
        <a className="underline hover:text-[#4b3b33]" href="mailto:missyandmoppet@gmail.com">missyandmoppet@gmail.com</a>{' '}
        or see our <a className="underline hover:text-[#4b3b33]" href="/contact">Contact</a> page.
      </P>
    </PolicyPage>
  );
}
