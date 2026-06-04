'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AppImage from '@/components/ui/AppImage';
import { useLanguage } from '@/context/LanguageContext';
import { useCart, Bouquet } from '@/context/CartContext';
import QuickViewModal from '@/app/components/QuickViewModal';

const CATEGORIES = ['All', 'Luxury', 'Classic', 'Spring', 'Minimalist'];

export default function FlowersAssortmentPage() {
  const { t } = useLanguage();
  const { addToCart } = useCart();
  const [bouquets, setBouquets] = useState<Bouquet[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBouquet, setSelectedBouquet] = useState<Bouquet | null>(null);

  // Fetch all bouquets from API
  useEffect(() => {
    const fetchBouquets = async () => {
      try {
        const res = await fetch('/api/bouquets');
        if (res.ok) {
          const data = await res.json();
          setBouquets(data);
        }
      } catch (error) {
        console.error('Failed to load bouquets:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBouquets();
  }, []);

  // Filter bouquets by category
  const filteredBouquets = bouquets.filter((b) => {
    if (selectedCategory === 'All') return true;
    
    // Match categories (handling slight string differences)
    const normalizedCat = (b.category || '').toLowerCase();
    const targetCat = selectedCategory.toLowerCase();
    return normalizedCat.includes(targetCat) || targetCat.includes(normalizedCat);
  });

  return (
    <main className="bg-background min-h-screen flex flex-col font-sans">
      <Header />

      {/* Spacer to push content past fixed Header */}
      <div className="h-16 md:h-20 bg-primary" />

      {/* Hero Header Area */}
      <section className="bg-[#fdf8f3] py-20 px-6 md:px-10 border-b border-[#ddd4c8]">
        <div className="max-w-[1400px] mx-auto text-center flex flex-col items-center gap-4">
          <span className="text-[10px] bg-[#c8947a]/15 text-[#c8947a] px-3.5 py-1 rounded-full font-bold uppercase tracking-widest">
            {t('nav.collection')}
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-light text-foreground tracking-tight mt-2">
            {t('nav.flowers') || 'სრული ასორტიმენტი'}{' '}
            <span className="italic" style={{ color: 'var(--accent)' }}>
              Assortment
            </span>
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl leading-relaxed mt-1">
            Explore our complete curated assortment of signature bouquets. Every single stem is chosen meticulously by hand, wrapped with artisan paper, and delivered same-day in Tbilisi.
          </p>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center items-center gap-2 mt-8 max-w-lg">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-[#1a1208] text-white shadow-sm'
                    : 'bg-white hover:bg-gray-100 border border-[#ddd4c8] text-[#1a1208]'
                }`}
              >
                {category === 'All' ? 'სრული კოლექცია' : category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid listing */}
      <section className="py-20 px-6 md:px-10 flex-1 bg-background">
        <div className="max-w-[1400px] mx-auto">
          {loading ? (
            <div className="py-24 text-center flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-[#c8947a]/20 border-t-[#c8947a] rounded-full animate-spin"></div>
              <p className="text-sm text-muted-foreground animate-pulse">Loading floral catalog...</p>
            </div>
          ) : filteredBouquets.length === 0 ? (
            <div className="py-24 text-center border border-dashed border-[#ddd4c8] rounded-3xl max-w-md mx-auto flex flex-col gap-4 p-8">
              <svg className="w-12 h-12 text-[#c8947a]/60 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <div>
                <p className="font-semibold text-lg text-foreground">No bouquets found</p>
                <p className="text-xs text-muted-foreground mt-1">There are no arrangements registered in this category right now.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {filteredBouquets.map((bouquet, i) => (
                <article
                  key={bouquet.id}
                  className="group bouquet-card bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 flex flex-col border border-border/10"
                >
                  {/* Image Aspect ratio box */}
                  <div className="relative overflow-hidden" style={{ height: '380px' }}>
                    <AppImage
                      src={bouquet.src}
                      alt={bouquet.alt || (bouquet.nameKey ? t(bouquet.nameKey) : bouquet.name || '')}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="card-img object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Tag badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm"
                        style={{
                          backgroundColor: 'rgba(253,248,243,0.92)',
                          color: 'var(--accent)',
                          backdropFilter: 'blur(8px)',
                        }}
                      >
                        {bouquet.tagKey ? t(bouquet.tagKey) : (bouquet.category || 'Collection')}
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
                          backdropFilter: 'blur(8px)',
                        }}
                      >
                        {t('bouquets.quickView')}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(bouquet);
                        }}
                        className="pill-btn text-xs font-semibold hover:-translate-y-1 transition-transform"
                        style={{
                          backgroundColor: 'var(--primary)',
                          color: 'var(--background)',
                          boxShadow: '0 4px 12px rgba(26,18,8,0.1)',
                        }}
                      >
                        {t('cart.add')}
                      </button>
                    </div>
                  </div>

                  {/* Card info */}
                  <div className="p-6 flex flex-col justify-between flex-1 gap-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-card-title font-display font-semibold text-foreground leading-tight text-lg">
                          {bouquet.nameKey ? t(bouquet.nameKey) : bouquet.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5 uppercase tracking-widest">
                          {bouquet.subNameKey ? t(bouquet.subNameKey) : `${bouquet.category} Collection`}
                        </p>
                      </div>
                      <span className="font-roboto text-lg font-bold text-accent" style={{ color: 'var(--accent)' }}>
                        {bouquet.price}
                      </span>
                    </div>

                    {/* Description excerpt */}
                    {bouquet.isCustom && bouquet.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {bouquet.description}
                      </p>
                    )}

                    <div className="border-t border-border/40 pt-4 mt-auto flex items-center justify-between">
                      <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Same-Day Tbilisi Delivery
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Quick View Modal */}
      {selectedBouquet && (
        <QuickViewModal bouquet={selectedBouquet} onClose={() => setSelectedBouquet(null)} />
      )}

      <Footer />
    </main>
  );
}
