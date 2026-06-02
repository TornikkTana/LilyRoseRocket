'use client';

import React, { useEffect, useRef } from 'react';
import Icon from '@/components/ui/AppIcon';
import { useLanguage } from '@/context/LanguageContext';

export default function DeliverySection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const { t } = useLanguage();

    const DELIVERY_PANELS = [
        {
            icon: 'TruckIcon',
            number: '01',
            title: t('del.panel1.title'),
            titleGeo: t('del.panel1.titleGeo'),
            desc: t('del.panel1.desc'),
            highlight: t('del.panel1.highlight'),
        },
        {
            icon: 'PencilSquareIcon',
            number: '02',
            title: t('del.panel2.title'),
            titleGeo: t('del.panel2.titleGeo'),
            desc: t('del.panel2.desc'),
            highlight: t('del.panel2.highlight'),
        },
        {
            icon: 'ChatBubbleLeftRightIcon',
            number: '03',
            title: t('del.panel3.title'),
            titleGeo: t('del.panel3.titleGeo'),
            desc: t('del.panel3.desc'),
            highlight: t('del.panel3.highlight'),
        },
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
            id="delivery"
            ref={sectionRef}
            className="bg-primary py-24 md:py-32 px-6 md:px-10 overflow-hidden"
        >
            <div className="max-w-[1400px] mx-auto">
                {/* Header */}
                <div className="mb-16 md:mb-20 fade-up">
                    <span className="section-label mb-4 block" style={{ color: 'rgba(232,196,184,0.6)' }}>
                        {t('delivery.eyebrow')}
                    </span>
                    <h2
                        className="font-display text-section-title font-light"
                        style={{ color: 'var(--primary-foreground)' }}
                    >
                        {t('delivery.title1')}{' '}
                        <span className="italic" style={{ color: 'var(--blush)' }}>
                            {t('delivery.title2')}
                        </span>
                    </h2>
                </div>

                {/* Panels */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ backgroundColor: 'rgba(232,196,184,0.08)' }}>
                    {DELIVERY_PANELS.map((panel, i) => (
                        <div
                            key={panel.number}
                            className={`info-panel p-8 md:p-10 flex flex-col gap-6 fade-up stagger-${i + 1}`}
                            style={{ backgroundColor: 'var(--primary)' }}
                        >
                            {/* Number + Icon */}
                            <div className="flex items-start justify-between">
                                <span
                                    className="font-display text-6xl font-light leading-none"
                                    style={{ color: 'rgba(232,196,184,0.15)' }}
                                >
                                    {panel.number}
                                </span>
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center"
                                    style={{ backgroundColor: 'rgba(232,196,184,0.1)' }}
                                >
                                    <Icon
                                        name={panel.icon as Parameters<typeof Icon>[0]['name']}
                                        size={20}
                                        style={{ color: 'var(--blush)' }}
                                    />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <h3
                                    className="font-display text-2xl font-light mb-1"
                                    style={{ color: 'var(--primary-foreground)' }}
                                >
                                    {panel.title}
                                </h3>
                                <p className="text-xs mb-4 font-semibold" style={{ color: 'rgba(232,196,184,0.5)' }}>
                                    {panel.titleGeo}
                                </p>
                                <p
                                    className="text-sm leading-relaxed"
                                    style={{ color: 'rgba(253,248,243,0.6)' }}
                                >
                                    {panel.desc}
                                </p>
                            </div>

                            {/* Highlight tag */}
                            <div
                                className="text-xs font-semibold tracking-wider px-3 py-1.5 rounded-full self-start"
                                style={{
                                    backgroundColor: 'rgba(232,196,184,0.1)',
                                    color: 'var(--blush)',
                                    border: '1px solid rgba(232,196,184,0.2)',
                                }}
                            >
                                {panel.highlight}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
