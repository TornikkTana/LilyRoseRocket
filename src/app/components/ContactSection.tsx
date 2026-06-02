'use client';

import React, { useEffect, useRef } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { useLanguage } from '@/context/LanguageContext';

export default function ContactSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const { t } = useLanguage();

    const CONTACT_CHANNELS = [
        {
            label: 'Instagram',
            handle: '@lilyrose_tbilisii',
            href: 'https://www.instagram.com/lilyrose_tbilisii/',
            icon: 'CameraIcon',
            bg: 'rgba(200,148,122,0.1)',
            hoverBg: 'var(--accent)',
            color: 'var(--accent)',
            hoverColor: '#fdf8f3'
        },
        {
            label: 'Facebook',
            handle: t('contact.fbHandle'),
            href: 'https://www.facebook.com/profile.php?id=61574653990871',
            icon: 'GlobeAltIcon',
            bg: 'rgba(26,18,8,0.05)',
            hoverBg: 'var(--primary)',
            color: 'var(--foreground)',
            hoverColor: '#fdf8f3'
        },
        {
            label: 'WhatsApp',
            handle: t('contact.whatsAppHandle'),
            href: 'https://wa.me/995000000000',
            icon: 'ChatBubbleLeftRightIcon',
            bg: 'rgba(138,158,122,0.1)',
            hoverBg: 'var(--sage)',
            color: 'var(--sage)',
            hoverColor: '#fdf8f3'
        }];

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
            id="contact"
            ref={sectionRef}
            className="bg-secondary py-24 md:py-32 px-6 md:px-10 overflow-hidden">

            <div className="max-w-[1400px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">

                    {/* Left content — 6/12 */}
                    <div className="lg:col-span-6 flex flex-col gap-8">
                        <div className="fade-up">
                            <span className="section-label mb-4 block">{t('contact.eyebrow')}</span>
                            <h2 className="font-display text-section-title font-light text-foreground mb-4">
                                {t('contact.title1')}{' '}
                                <span className="italic" style={{ color: 'var(--accent)' }}>
                                    {t('contact.title2')}
                                </span>
                            </h2>
                            <p className="text-base text-muted-foreground leading-relaxed max-w-sm">
                                {t('contact.desc')}
                            </p>
                        </div>

                        {/* Contact pill buttons */}
                        <div className="flex flex-col gap-4 fade-up stagger-1">
                            {CONTACT_CHANNELS.map((channel) =>
                                <a
                                    key={channel.label}
                                    href={channel.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-pill flex items-center justify-between rounded-2xl px-6 py-4 border border-border group"
                                    style={{ backgroundColor: channel.bg }}>

                                    <div className="flex items-center gap-4">
                                        <div
                                            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                                            style={{ backgroundColor: channel.bg }}>

                                            <Icon
                                                name={channel.icon as Parameters<typeof Icon>[0]['name']}
                                                size={20}
                                                style={{ color: channel.color }} />

                                        </div>
                                        <div>
                                            <div className="font-bold text-sm text-foreground">{channel.label}</div>
                                            <div className="text-xs text-muted-foreground font-semibold">{channel.handle}</div>
                                        </div>
                                    </div>
                                    <Icon name="ArrowRightIcon" size={18} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                                </a>
                            )}
                        </div>

                        {/* Location note */}
                        <div className="flex items-center gap-3 fade-up stagger-2">
                            <Icon name="MapPinIcon" size={16} className="text-accent flex-shrink-0" />
                            <p className="text-sm text-muted-foreground font-semibold">
                                {t('contact.locNote')}
                            </p>
                        </div>
                    </div>

                    {/* Right image — 6/12 */}
                    <div className="lg:col-span-6 fade-up stagger-1">
                        <div className="relative rounded-2xl overflow-hidden" style={{ height: 'clamp(320px, 45vw, 520px)' }}>
                            <AppImage
                                src="https://images.unsplash.com/photo-1584171737163-f3aed02a8f76"
                                alt="Elegant wrapped bouquet ready for delivery, soft daylight, airy background"
                                fill
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                className="object-cover" />

                            {/* Floating glass card */}
                            <div
                                className="absolute top-6 right-6 glass-card rounded-xl px-5 py-4 max-w-[200px]"
                                style={{ zIndex: 10 }}>

                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-2 h-2 rounded-full bg-sage animate-pulse" />
                                    <span className="text-xs font-bold text-foreground">{t('contact.available')}</span>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
                                    {t('contact.deliveryNote')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>);

}
