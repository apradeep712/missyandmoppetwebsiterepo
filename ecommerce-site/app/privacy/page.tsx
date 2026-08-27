import type { Metadata } from 'next';
import PolicyPage from '../components/legal/PolicyPage';
import { H2, P, UL, PH } from '../components/legal/elements';

export const metadata: Metadata = {
  title: 'Privacy Policy | Missy & Moppet',
  description: 'How Missy & Moppet collects, uses, and protects your personal information.',
};

export default function PrivacyPage() {
  return (
    <PolicyPage title="Privacy Policy" lastUpdated="23 June 2026">
      <P>
        This Privacy Policy explains how <PH>LEGAL ENTITY NAME</PH> (&quot;we&quot;, &quot;us&quot;)
        collects, uses, and protects your personal information when you use the Missy &amp; Moppet
        website. By using the Site, you consent to the practices described here.
      </P>

      <H2>1. Information we collect</H2>
      <UL>
        <li><strong>Contact &amp; order details:</strong> name, email address, phone number, and shipping address you provide at checkout or in our request forms.</li>
        <li><strong>Order information:</strong> the products you buy, order value, and order history.</li>
        <li><strong>Payment information:</strong> processed directly by Razorpay. We receive a payment confirmation but do not store your full card or banking details.</li>
        <li><strong>Technical data:</strong> basic device/browser information and cookies used to operate the Site.</li>
      </UL>

      <H2>2. How we use your information</H2>
      <UL>
        <li>To process and deliver your orders and send order-related communication.</li>
        <li>To respond to enquiries, custom requests, try-at-home and subscription interest.</li>
        <li>To improve our products and the Site, and (where you consent) to send marketing updates.</li>
        <li>To comply with legal and regulatory obligations.</li>
      </UL>

      <H2>3. Third parties we share data with</H2>
      <UL>
        <li><strong>Razorpay</strong> — payment processing.</li>
        <li><strong>Shiprocket</strong> — shipping and delivery.</li>
        <li><strong>Supabase</strong> — secure database and storage hosting.</li>
        <li><strong>Resend</strong> — transactional email delivery.</li>
      </UL>
      <P>
        We share only the data necessary for these services to function and do not sell your
        personal information.
      </P>

      <H2>4. Cookies</H2>
      <P>
        We use cookies and similar technologies to keep the Site working (for example, your cart
        and session). You can control cookies through your browser settings; disabling them may
        affect Site functionality.
      </P>

      <H2>5. Data retention &amp; security</H2>
      <P>
        We retain personal data only as long as necessary for the purposes above or as required
        by law, and we take reasonable technical and organisational measures to protect it.
      </P>

      <H2>6. Your rights</H2>
      <P>
        You may request access to, correction of, or deletion of your personal data, and you may
        opt out of marketing at any time. To make a request, contact us at{' '}
        <a className="underline hover:text-[#4b3b33]" href="mailto:missyandmoppet@gmail.com">missyandmoppet@gmail.com</a>.
      </P>

      <H2>7. Children&apos;s privacy</H2>
      <P>
        Our products are for children, but purchases are made by adults. We do not knowingly
        collect personal data directly from children.
      </P>

      <H2>8. Contact</H2>
      <P>
        For any privacy questions, email{' '}
        <a className="underline hover:text-[#4b3b33]" href="mailto:missyandmoppet@gmail.com">missyandmoppet@gmail.com</a>.
      </P>
    </PolicyPage>
  );
}
