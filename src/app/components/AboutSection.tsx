'use client';

import React, { useEffect, useRef } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { useLanguage } from '@/context/LanguageContext';

export default function AboutSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const { t } = useLanguage();

    const PILLARS = [
        { icon: 'SparklesIcon', label: t('pillar.crafted'), desc: t('pillar.craftedDesc') },
        { icon: 'TruckIcon', label: t('pillar.delivery'), desc: t('pillar.deliveryDesc') },
        { icon: 'HeartIcon', label: t('pillar.love'), desc: t('pillar.loveDesc') },
    ];

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
            { threshold: 0.1, rootMargin: '0px 0px -5% 0px' }
        );
        els.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    return (
        <section
            id="about"
            ref={sectionRef}
            className="bg-secondary overflow-hidden py-24 md:py-32">

            <div className="max-w-[1400px] mx-auto px-6 md:px-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">

                    {/* Left: Image column — 5/12 */}
                    <div className="lg:col-span-5 fade-up">
                        <div className="relative rounded-2xl overflow-hidden" style={{ height: 'clamp(360px, 55vw, 620px)' }}>
                            <AppImage
                                src="https://img.rocket.new/generatedImages/rocket_gen_img_1cf0c3fa3-1772254175683.png"
                                alt="Florist hands carefully arranging fresh roses and lilies in a bright Georgian studio"
                                fill
                                sizes="(max-width: 1024px) 100vw, 42vw"
                                className="object-cover" />

                            {/* Decorative accent card */}
                            <div
                                className="absolute bottom-6 left-6 right-6 glass-card rounded-xl p-5"
                                style={{ zIndex: 10 }}>

                                <p className="font-display text-lg md:text-xl italic text-foreground leading-snug">
                                    {t('about.quote')}
                                </p>
                                <span className="text-xs text-muted-foreground mt-2 block font-semibold">
                                    {t('about.studio')}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Content column — 7/12 */}
                    <div className="lg:col-span-7 flex flex-col justify-between gap-10">
                        <div className="fade-up stagger-1">
                            <span className="section-label mb-4 block">{t('about.eyebrow')}</span>
                            <h2 className="font-display text-section-title font-light text-foreground mb-6">
                                {t('about.title1')}{' '}
                                <span className="italic" style={{ color: 'var(--accent)' }}>
                                    {t('about.title2')}
                                </span>
                            </h2>
                            <p className="text-base text-muted-foreground leading-relaxed max-w-xl mb-4">
                                {t('about.desc1')}
                            </p>
                            <p className="text-base text-muted-foreground leading-relaxed max-w-xl">
                                {t('about.desc2')}
                            </p>
                        </div>

                        {/* Pillars */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 fade-up stagger-2">
                            {PILLARS.map((pillar) =>
                                <div
                                    key={pillar.label}
                                    className="flex flex-col gap-3 p-5 rounded-xl border border-border bg-card"
                                    style={{ boxShadow: '0 2px 12px rgba(26,18,8,0.04)' }}>

                                    <div
                                        className="w-9 h-9 rounded-full flex items-center justify-center"
                                        style={{ backgroundColor: 'rgba(200,148,122,0.12)' }}>

                                        <Icon name={pillar.icon as Parameters<typeof Icon>[0]['name']} size={18} className="text-accent" />
                                    </div>
                                    <div>
                                        <h3 className="font-display font-bold text-foreground text-base mb-1">
                                            {pillar.label}
                                        </h3>
                                        <p className="text-xs text-muted-foreground leading-relaxed">{pillar.desc}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Stat row */}
                        <div className="flex flex-wrap gap-8 pt-2 border-t border-border fade-up stagger-3">
                            {[
                                { num: '500+', label: t('stat.delivered') },
                                { num: '4.9★', label: t('stat.rating') },
                                { num: '1 Day', label: t('stat.time') }].
                                map((stat) =>
                                    <div key={stat.label}>
                                        <div className="font-display text-3xl font-light text-foreground">{stat.num}</div>
                                        <div className="text-xs text-muted-foreground mt-0.5 tracking-wide font-medium">{stat.label}</div>
                                    </div>
                                )}
                        </div>
                    </div>
                </div>
            </div>
        </section>);

}