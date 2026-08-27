import type { Metadata } from 'next';
import PolicyPage from '../components/legal/PolicyPage';
import { H2, P, PH } from '../components/legal/elements';

export const metadata: Metadata = {
  title: 'FAQ | Missy & Moppet',
  description: 'Answers to common questions about sizing, shipping, returns, custom orders, and payments.',
};

function QA({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <H2>{q}</H2>
      {children}
    </div>
  );
}

export default function FaqPage() {
  return (
    <PolicyPage title="Frequently Asked Questions" lastUpdated="23 June 2026">
      <QA q="How do I choose the right size?">
        <P>
          Each product lists age-based sizing (from newborn through older kids). Pick the age
          range that matches your child; if you&apos;re between sizes, we suggest sizing up.
          Still unsure? Message us on{' '}
          <a className="underline hover:text-[#4b3b33]" href="https://instagram.com/missyandmoppet" target="_blank" rel="noopener noreferrer">Instagram</a>{' '}
          or email <a className="underline hover:text-[#4b3b33]" href="mailto:missyandmoppet@gmail.com">missyandmoppet@gmail.com</a>.
        </P>
      </QA>

      <QA q="How long will my order take to arrive?">
        <P>
          Orders are usually dispatched within <PH>DISPATCH TIME</PH> and delivered within{' '}
          <PH>DELIVERY TIME</PH>. Full details are on our{' '}
          <a className="underline hover:text-[#4b3b33]" href="/shipping-policy">Shipping &amp; Delivery</a> page.
        </P>
      </QA>

      <QA q="Can I cancel or change my order?">
        <P>
          You can cancel within <PH>CANCELLATION WINDOW</PH> of ordering, as long as it
          hasn&apos;t shipped. See our{' '}
          <a className="underline hover:text-[#4b3b33]" href="/refund-policy">Refund &amp; Cancellation Policy</a>.
        </P>
      </QA>

      <QA q="What is your return & exchange policy?">
        <P>
          Most items can be returned or exchanged within <PH>RETURN WINDOW</PH> of delivery if
          unused with tags intact. Custom and personalised items are not returnable unless
          damaged. Full details are on our{' '}
          <a className="underline hover:text-[#4b3b33]" href="/returns">Returns &amp; Exchange</a> page.
        </P>
      </QA>

      <QA q="How are refunds processed?">
        <P>
          Approved refunds go back to your original payment method via Razorpay, typically within{' '}
          <PH>REFUND TIMELINE</PH>. See the{' '}
          <a className="underline hover:text-[#4b3b33]" href="/refund-policy">Refund &amp; Cancellation Policy</a>.
        </P>
      </QA>

      <QA q="Do you make custom or personalised pieces?">
        <P>
          Yes! Tell us what you have in mind on our{' '}
          <a className="underline hover:text-[#4b3b33]" href="/customize">Customize</a> page and
          we&apos;ll take it from there. Custom pieces may take longer to make and are
          non-refundable unless they arrive damaged.
        </P>
      </QA>

      <QA q="What is “Try at Home”?">
        <P>
          Our{' '}
          <a className="underline hover:text-[#4b3b33]" href="/try-at-home">Try at Home</a>{' '}
          service lets you preview selected pieces before you commit. <PH>Describe how it works, eligibility, and any charges</PH>.
        </P>
      </QA>

      <QA q="Which payment methods do you accept?">
        <P>
          Payments are handled securely through Razorpay, which supports UPI, cards, net banking,
          and popular wallets. We never store your full card details.
        </P>
      </QA>

      <QA q="How do I contact you?">
        <P>
          Email <a className="underline hover:text-[#4b3b33]" href="mailto:missyandmoppet@gmail.com">missyandmoppet@gmail.com</a>,
          DM us on Instagram, or visit our{' '}
          <a className="underline hover:text-[#4b3b33]" href="/contact">Contact</a> page.
        </P>
      </QA>
    </PolicyPage>
  );
}
