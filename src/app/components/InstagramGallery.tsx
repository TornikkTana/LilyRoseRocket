'use client';

import React, { useEffect, useRef } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { useLanguage } from '@/context/LanguageContext';

interface GalleryImage {
    src: string;
    alt: string;
    span?: 'tall' | 'normal';
}

const GALLERY_IMAGES: GalleryImage[] = [
    {
        src: "https://images.unsplash.com/photo-1709881758135-cd2dea72dc4b",
        alt: 'Romantic pink rose bouquet wrapped in kraft paper, warm studio light',
        span: 'tall'
    },
    {
        src: "https://images.unsplash.com/photo-1629385354811-aaf27a5862d5",
        alt: 'White lily and eucalyptus arrangement on marble surface',
        span: 'normal'
    },
    {
        src: "https://images.unsplash.com/photo-1641060647838-23e0f54c5aff",
        alt: 'Pastel mixed flower arrangement with soft pink and peach tones',
        span: 'normal'
    },
    {
        src: "https://img.rocket.new/generatedImages/rocket_gen_img_1cf0c3fa3-1772254175683.png",
        alt: 'Florist hands arranging garden roses in natural daylight',
        span: 'tall'
    },
    {
        src: "https://img.rocket.new/generatedImages/rocket_gen_img_1a44162e9-1772835907001.png",
        alt: 'Blush and cream wedding bouquet with trailing greenery',
        span: 'normal'
    },
    {
        src: "https://images.unsplash.com/photo-1696177339745-2b32c92ca495",
        alt: 'Luxury red rose arrangement in glass vase with candlelight ambiance',
        span: 'normal'
    },
    {
        src: "https://images.unsplash.com/photo-1531916206450-4982ffff2561",
        alt: 'Close-up of peony petals in full bloom, soft pink tones',
        span: 'normal'
    },
    {
        src: "https://images.unsplash.com/photo-1612463977704-cab2ae2bc6e9",
        alt: 'Spring flower market arrangement with tulips and ranunculus',
        span: 'normal'
    }];


export default function InstagramGallery() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const { t } = useLanguage();

    useEffect(() => {
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
            { threshold: 0.08, rootMargin: '0px 0px -5% 0px' }
        );
        els.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    return (
        <section id="gallery" ref={sectionRef} className="bg-background py-24 md:py-32 px-6 md:px-10">
            <div className="max-w-[1400px] mx-auto">
                {/* Header */}
                <div className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 fade-up">
                    <div>
                        <span className="section-label mb-3 block">{t('gallery.eyebrow')}</span>
                        <h2 className="font-display text-section-title font-light text-foreground">
                            {t('gallery.title1')}{' '}
                            <span className="italic" style={{ color: 'var(--accent)' }}>
                                {t('gallery.title2')}
                            </span>
                        </h2>
                    </div>
                    <a
                        href="https://www.instagram.com/lilyrose_tbilisii/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm font-medium text-foreground border-b border-foreground pb-0.5 hover:text-accent hover:border-accent transition-colors self-start md:self-auto">

                        <Icon name="CameraIcon" size={16} />
                        @lilyrose_tbilisii
                    </a>
                </div>

                {/* Masonry-style grid */}
                <div
                    className="grid gap-3 md:gap-4 fade-up stagger-1"
                    style={{
                        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                        gridAutoRows: '200px'
                    }}>

                    {GALLERY_IMAGES.map((img, i) =>
                        <div
                            key={i}
                            className="gallery-item relative rounded-xl overflow-hidden cursor-pointer"
                            style={{
                                gridRow: img.span === 'tall' ? 'span 2' : 'span 1'
                            }}>

                            <AppImage
                                src={img.src}
                                alt={img.alt}
                                fill
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                className="object-cover" />

                            {/* Hover overlay */}
                            <div
                                className="gallery-overlay absolute inset-0 flex items-center justify-center"
                                style={{ backgroundColor: 'rgba(26,18,8,0.38)' }}>

                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center"
                                    style={{ backgroundColor: 'rgba(253,248,243,0.9)' }}>

                                    <Icon name="CameraIcon" size={18} className="text-foreground" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Follow CTA */}
                <div className="mt-10 flex justify-center fade-up stagger-2">
                    <a
                        href="https://www.instagram.com/lilyrose_tbilisii/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pill-btn pill-btn-outline flex items-center gap-2 font-bold">

                        <Icon name="CameraIcon" size={16} />
                        {t('gallery.followBtn')}
                    </a>
                </div>
            </div>
        </section>);

}
