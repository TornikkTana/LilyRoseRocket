import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Noto_Serif_Georgian, Noto_Sans_Georgian, Roboto } from 'next/font/google';
import { LanguageProvider } from '@/context/LanguageContext';
import { CartProvider } from '@/context/CartContext';
import BloomCursor from '@/components/BloomCursor';
import CartDrawer from '@/app/components/CartDrawer';
import CheckoutSuccessModal from '@/app/components/CheckoutSuccessModal';
import '../styles/tailwind.css';

const notoSerifGeorgian = Noto_Serif_Georgian({
    subsets: ['georgian', 'latin'],
    weight: ['300', '400', '500', '600', '700'],
    variable: '--font-display',
    display: 'swap',
});

const notoSansGeorgian = Noto_Sans_Georgian({
    subsets: ['georgian', 'latin'],
    weight: ['300', '400', '500', '600', '700'],
    variable: '--font-sans',
    display: 'swap',
});

const roboto = Roboto({
    subsets: ['latin'],
    weight: ['300', '400', '500', '700'],
    variable: '--font-roboto',
    display: 'swap',
});

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
};

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
    title: 'Lily Rose — Luxury Flowers & Bouquets in Tbilisi',
    description: 'Hand-crafted luxury bouquets and floral arrangements delivered same-day in Tbilisi. Order custom bouquets from Lily Rose, Georgia\'s premier flower boutique.',
    icons: {
        icon: [{ url: '/favicon.ico', type: 'image/x-icon' }],
    },
    openGraph: {
        title: 'Lily Rose — Luxury Flowers in Tbilisi',
        description: 'Hand-crafted luxury bouquets delivered same-day in Tbilisi.',
        images: [{ url: '/assets/images/app_logo.png', width: 1200, height: 630 }],
    },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="ka" className={`${notoSerifGeorgian.variable} ${notoSansGeorgian.variable} ${roboto.variable}`}>
            <body className={notoSansGeorgian.className}>
                <LanguageProvider>
                    <CartProvider>
                        {children}
                        <CartDrawer />
                        <CheckoutSuccessModal />
                    </CartProvider>
                </LanguageProvider>
                <BloomCursor />

                <script type="module" async src="https://static.rocket.new/rocket-web.js?_cfg=https%3A%2F%2Flilyrose6062back.builtwithrocket.new&_be=https%3A%2F%2Fappanalytics.rocket.new&_v=0.1.19" />
                <script type="module" defer src="https://static.rocket.new/rocket-shot.js?v=0.0.2" />
            </body>
        </html>
    );
}
