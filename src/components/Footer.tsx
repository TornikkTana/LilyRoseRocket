'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
    const [year, setYear] = useState('');
    const { t } = useLanguage();

    useEffect(() => {
        setYear(new Date()?.getFullYear()?.toString());
    }, []);

    const navLinks = [
        { label: t('nav.collection'), href: '#collection' },
        { label: t('nav.story'), href: '#about' },
        { label: t('nav.gallery'), href: '#gallery' },
        { label: t('nav.delivery'), href: '#delivery' },
    ];

    return (
        <footer className="border-t border-border bg-background">
            <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-10 md:py-14">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                    {/* Left: Brand */}
                    <div className="flex flex-col gap-3">
                        <Link href="/" className="flex items-center gap-2.5">
                            <AppLogo size={32} />
                            <span className="font-display text-base font-semibold tracking-tight text-foreground">Lily Rose</span>
                        </Link>
                        <p className="text-xs text-muted-foreground max-w-[240px] leading-relaxed">
                            {t('footer.brand')}
                        </p>
                    </div>

                    {/* Center: Links */}
                    <nav className="flex flex-wrap gap-x-8 gap-y-3">
                        {navLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300"
                            >
                                {link.label}
                            </a>
                        ))}
                        <a
                            href="#contact"
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300"
                        >
                            {t('nav.contact')}
                        </a>
                    </nav>

                    {/* Right: Social + Copyright */}
                    <div className="flex flex-col items-start md:items-end gap-3">
                        <div className="flex items-center gap-4">
                            <a
                                href="https://www.instagram.com/lilyrose_tbilisii/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-all duration-300"
                                aria-label="Instagram"
                            >
                                <Icon name="CameraIcon" size={16} />
                            </a>
                            <a
                                href="https://www.facebook.com/profile.php?id=61574653990871"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-all duration-300"
                                aria-label="Facebook"
                            >
                                <Icon name="GlobeAltIcon" size={16} />
                            </a>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {year ? `© ${year} Lily Rose Tbilisi · ${t('footer.rights')}` : `© Lily Rose Tbilisi · ${t('footer.rights')}`}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <a href="#" className="hover:text-foreground transition-colors">{t('footer.privacy')}</a>
                            <span>·</span>
                            <a href="#" className="hover:text-foreground transition-colors">{t('footer.terms')}</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}