'use client';

import React, { useEffect, useRef } from 'react';
import AppImage from '@/components/ui/AppImage';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import QuickViewModal from '@/app/components/QuickViewModal';

export interface Bouquet {
    id: number;
    nameKey: string;
    subNameKey: string;
    price: string;
    tagKey: string;
    src: string;
    alt: string;
}



export default function FeaturedBouquets() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const { t } = useLanguage();
    const { addToCart } = useCart();
    const [selectedBouquet, setSelectedBouquet] = React.useState<Bouquet | null>(null);
    const [bouquets, setBouquets] = React.useState<Bouquet[]>([]);
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        // Fetch bouquets from API
        const fetchBouquets = async () => {
            try {
                const res = await fetch('/api/bouquets');
                if (res.ok) {
                    const data = await res.json();
                    setBouquets(data.slice(0, 6)); // Display up to 6 featured bouquets
                }
            } catch (error) {
                console.error('Failed to fetch bouquets:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBouquets();
    }, []);

    useEffect(() => {
        if (loading || bouquets.length === 0) return;
        const els = sectionRef.current?.querySelectorAll('.fade-up');
        if (!els) return;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -5% 0px' }
        );
        els.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [loading, bouquets]);

    return (
        <section
            id="collection"
            ref={sectionRef}
            className="bg-background py-24 md:py-32 px-6 md:px-10">

            <div className="max-w-[1400px] mx-auto">
                {/* Section header */}
                <div className="mb-14 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6 fade-up">
                    <div>
                        <span className="section-label mb-3 block">{t('bouquets.eyebrow')}</span>
                        <h2 className="font-display text-section-title font-light text-foreground">
                            {t('bouquets.title1')}{' '}
                            <span className="italic" style={{ color: 'var(--accent)' }}>
                                {t('bouquets.title2')}
                            </span>
                        </h2>
                    </div>
                    <p className="text-sm text-muted-foreground max-w-xs leading-relaxed md:text-right">
                        {t('bouquets.desc')}
                    </p>
                </div>

                {/* Grid — 6 cards */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {bouquets.map((bouquet, i) =>
                            <article
                                key={bouquet.id}
                                className={`group bouquet-card bg-card rounded-xl overflow-hidden fade-up stagger-${Math.min(i + 1, 6)}`}
                                style={{ boxShadow: '0 2px 16px rgba(26,18,8,0.06)' }}>

                                {/* Image */}
                                <div className="relative overflow-hidden" style={{ height: '340px' }}>
                                    <AppImage
                                        src={bouquet.src}
                                        alt={bouquet.alt || bouquet.name || 'Bouquet'}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        className="card-img object-cover" />

                                    {/* Tag badge */}
                                    <div className="absolute top-4 left-4 z-10">
                                        <span
                                            className="text-xs font-semibold tracking-wider px-3 py-1 rounded-full capitalize"
                                            style={{
                                                backgroundColor: 'rgba(253,248,243,0.92)',
                                                color: 'var(--accent)',
                                                backdropFilter: 'blur(8px)'
                                            }}>

                                            {bouquet.tagKey ? t(bouquet.tagKey) : bouquet.category}
                                        </span>
                                    </div>
                                    {/* Quick view overlay */}
                                    <div className="absolute inset-0 flex items-end justify-center pb-6 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 gap-2">
                                        <button
                                            onClick={() => setSelectedBouquet(bouquet)}
                                            className="pill-btn text-xs font-semibold hover:-translate-y-1 transition-transform"
                                            style={{
                                                backgroundColor: 'rgba(253,248,243,0.92)',
                                                color: 'var(--primary)',
                                                backdropFilter: 'blur(8px)'
                                            }}>
                                            {t('bouquets.quickView')}
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); addToCart(bouquet); }}
                                            className="pill-btn text-xs font-semibold hover:-translate-y-1 transition-transform"
                                            style={{
                                                backgroundColor: 'var(--primary)',
                                                color: 'var(--background)',
                                                boxShadow: '0 4px 12px rgba(26,18,8,0.1)'
                                            }}>
                                            {t('cart.add')}
                                        </button>
                                    </div>
                                </div>

                                {/* Card info */}
                                <div className="p-5 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-card-title font-display font-semibold text-foreground leading-tight">
                                            {bouquet.nameKey ? t(bouquet.nameKey) : bouquet.name}
                                        </h3>
                                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{bouquet.subNameKey ? t(bouquet.subNameKey) : bouquet.description}</p>
                                    </div>
                                    <span
                                        className="font-roboto text-lg font-semibold whitespace-nowrap ml-2"
                                        style={{ color: 'var(--accent)' }}>

                                        {bouquet.price}
                                    </span>
                                </div>
                            </article>
                        )}
                    </div>
                )}

                {/* CTA row */}
                <div className="mt-14 flex justify-center fade-up">
                    <a href="#contact" className="pill-btn pill-btn-outline font-bold">
                        {t('bouquets.customBtn')}
                    </a>
                </div>
            </div>

            {/* Quick View Modal */}
            {selectedBouquet && (
                <QuickViewModal
                    bouquet={selectedBouquet}
                    onClose={() => setSelectedBouquet(null)}
                />
            )}
        </section>);

}
