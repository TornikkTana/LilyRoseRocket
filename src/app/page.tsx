import React from 'react';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from './components/HeroSection';
import FeaturedBouquets from './components/FeaturedBouquets';
import AboutSection from './components/AboutSection';
import InstagramGallery from './components/InstagramGallery';
import DeliverySection from './components/DeliverySection';
import ContactSection from './components/ContactSection';

export const metadata: Metadata = {
    title: 'Lily Rose — Luxury Flowers & Bouquets in Tbilisi',
    description:
        'Hand-crafted luxury bouquets and floral arrangements delivered same-day in Tbilisi. Order custom bouquets from Lily Rose, Georgia\'s premier flower boutique.',
    alternates: { canonical: '/' },
    openGraph: {
        title: 'Lily Rose — Luxury Flowers in Tbilisi',
        description: 'Hand-crafted luxury bouquets delivered same-day in Tbilisi.',
        images: [{ url: '/assets/images/app_logo.png', width: 1200, height: 630 }],
    },
};

export default function HomePage() {
    return (
        <main className="bg-background min-h-screen">
            {/* Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'LocalBusiness',
                        name: 'Lily Rose',
                        description: 'Luxury hand-crafted bouquets and floral arrangements in Tbilisi, Georgia.',
                        url: 'http://localhost:3000',
                        image: '/assets/images/app_logo.png',
                        address: {
                            '@type': 'PostalAddress',
                            addressLocality: 'Tbilisi',
                            addressCountry: 'GE',
                        },
                        sameAs: [
                            'https://www.instagram.com/lilyrose_tbilisii/',
                            'https://www.facebook.com/profile.php?id=61574653990871',
                        ],
                    }),
                }}
            />

            <Header />

            {/* H1 is inside HeroSection */}
            <HeroSection />
            <FeaturedBouquets />
            <AboutSection />
            <InstagramGallery />
            <DeliverySection />
            <ContactSection />

            <Footer />
        </main>
    );
}
