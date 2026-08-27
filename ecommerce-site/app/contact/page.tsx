import type { Metadata } from 'next';
import PolicyPage from '../components/legal/PolicyPage';
import { H2, P, PH } from '../components/legal/elements';

export const metadata: Metadata = {
  title: 'Contact Us | Missy & Moppet',
  description: 'Get in touch with the Missy & Moppet team — email, Instagram, and support details.',
};

export default function ContactPage() {
  return (
    <PolicyPage title="Contact Us" lastUpdated="23 June 2026">
      <P>
        We&apos;d love to hear from you. For orders, sizing help, custom requests, or anything
        else, reach us through any of the channels below and we&apos;ll get back to you as soon
        as we can.
      </P>

      <H2>Email</H2>
      <P>
        <a className="underline hover:text-[#4b3b33]" href="mailto:missyandmoppet@gmail.com">
          missyandmoppet@gmail.com
        </a>
      </P>

      <H2>Instagram</H2>
      <P>
        <a
          className="underline hover:text-[#4b3b33]"
          href="https://instagram.com/missyandmoppet"
          target="_blank"
          rel="noopener noreferrer"
        >
          @missyandmoppet
        </a>
      </P>

      <H2>Phone / WhatsApp</H2>
      <P>
        <a className="underline hover:text-[#4b3b33]" href="tel:+919148884999">
          +91 91488 84999
        </a>
        {' '}·{' '}
        <a
          className="underline hover:text-[#4b3b33]"
          href="https://wa.me/919148884999"
          target="_blank"
          rel="noopener noreferrer"
        >
          Chat on WhatsApp
        </a>
      </P>

      <H2>Support hours</H2>
      <P>
        <PH>SUPPORT HOURS, e.g. Mon–Sat, 10:00 AM – 6:00 PM IST</PH>
      </P>

      <H2>Need a specific policy?</H2>
      <P>
        See our{' '}
        <a className="underline hover:text-[#4b3b33]" href="/shipping-policy">Shipping &amp; Delivery</a>,{' '}
        <a className="underline hover:text-[#4b3b33]" href="/refund-policy">Refund &amp; Cancellation</a>, and{' '}
        <a className="underline hover:text-[#4b3b33]" href="/returns">Returns &amp; Exchange</a> pages,
        or browse our <a className="underline hover:text-[#4b3b33]" href="/faq">FAQ</a>.
      </P>
    </PolicyPage>
  );
}
