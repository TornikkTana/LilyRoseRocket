'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import { useLanguage, Language } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';

export default function Header() {
    const [solid, setSolid] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const headerRef = useRef<HTMLElement>(null);
    const { language, setLanguage, t } = useLanguage();
    const { totalItems, setIsCartOpen } = useCart();

    useEffect(() => {
        const onScroll = () => setSolid(window.scrollY > 60);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Close menu on scroll
    useEffect(() => {
        if (!menuOpen) return;
        const close = () => setMenuOpen(false);
        window.addEventListener('scroll', close, { passive: true });
        return () => window.removeEventListener('scroll', close);
    }, [menuOpen]);

    const navLinks = [
        { label: t('nav.collection'), href: '#collection' },
        { label: t('nav.story'), href: '#about' },
        { label: t('nav.gallery'), href: '#gallery' },
        { label: t('nav.delivery'), href: '#delivery' },
    ];

    const handleLanguageChange = (lang: Language) => {
        setLanguage(lang);
    };

    return (
        <>
            <header
                ref={headerRef}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${solid ? 'nav-solid' : 'bg-transparent'
                    }`}
            >
                <div className="max-w-[1400px] mx-auto px-6 md:px-10 flex items-center justify-between h-16 md:h-20 relative">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <AppLogo
                            size={36}
                            className="transition-transform duration-500 group-hover:scale-110"
                        />
                        <span
                            className="font-display text-lg font-bold tracking-tight transition-colors duration-300"
                            style={{ color: solid ? 'var(--foreground)' : '#ffffff' }}
                        >
                            Lily Rose
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8 md:absolute md:left-1/2 md:-translate-x-1/2">
                        {navLinks?.map((link) => (
                            <a
                                key={link?.label}
                                href={link?.href}
                                className={`text-[13px] tracking-widest uppercase font-semibold transition-colors duration-300 ${
                                    solid
                                        ? 'text-foreground hover:text-accent'
                                        : 'text-white hover:text-white/80'
                                }`}
                            >
                                {link?.label}
                            </a>
                        ))}
                    </nav>

                    {/* Language Switcher + CTA + Hamburger */}
                    <div className="flex items-center gap-5">
                        {/* Desktop Language Switcher */}
                        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold tracking-wider uppercase border border-border rounded-full p-1 bg-background/50 backdrop-blur-sm">
                            {(['ka', 'en', 'ru'] as Language[]).map((lang) => (
                                <button
                                    key={lang}
                                    onClick={() => handleLanguageChange(lang)}
                                    className={`px-2.5 py-1 rounded-full transition-all duration-300 ${
                                        language === lang
                                            ? 'bg-primary text-primary-foreground font-bold'
                                            : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>

                        <a
                            href="#collection"
                            className="pill-btn pill-btn-primary hidden sm:inline-flex text-xs"
                        >
                            {t('nav.orderNow')}
                        </a>

                        <button 
                            onClick={() => setIsCartOpen(true)}
                            className="relative p-2 hover:text-accent transition-colors"
                            style={{ color: solid ? 'var(--foreground)' : '#ffffff' }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                                <path d="M3 6h18"></path>
                                <path d="M16 10a4 4 0 0 1-8 0"></path>
                            </svg>
                            {totalItems > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-accent rounded-full border-2 border-background">
                                    {totalItems}
                                </span>
                            )}
                        </button>

                        <button
                            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
                            onClick={() => setMenuOpen((v) => !v)}
                            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                        >
                            <span
                                className={`block h-px w-5 transition-all duration-300 ${
                                    menuOpen
                                        ? 'bg-foreground rotate-45 translate-y-1.5'
                                        : solid
                                        ? 'bg-foreground'
                                        : 'bg-white'
                                }`}
                            />
                            <span
                                className={`block h-px w-5 transition-all duration-300 ${
                                    menuOpen
                                        ? 'opacity-0'
                                        : solid
                                        ? 'bg-foreground'
                                        : 'bg-white'
                                }`}
                            />
                            <span
                                className={`block h-px w-5 transition-all duration-300 ${
                                    menuOpen
                                        ? 'bg-foreground -rotate-45 -translate-y-1.5'
                                        : solid
                                        ? 'bg-foreground'
                                        : 'bg-white'
                                }`}
                            />
                        </button>
                    </div>
                </div>
            </header>
            
            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 z-40 transition-all duration-500 md:hidden ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                style={{ backdropFilter: 'blur(16px)', backgroundColor: 'rgba(253,248,243,0.96)' }}
            >
                <div className="flex flex-col items-center justify-center h-full gap-8 px-6">
                    {/* Mobile Language Switcher */}
                    <div className="flex items-center gap-3 text-sm font-semibold tracking-wider uppercase border border-border rounded-full p-1.5 bg-background mb-4">
                        {(['ka', 'en', 'ru'] as Language[]).map((lang) => (
                            <button
                                key={lang}
                                onClick={() => {
                                    handleLanguageChange(lang);
                                }}
                                className={`px-4 py-1.5 rounded-full transition-all duration-300 ${
                                    language === lang
                                        ? 'bg-primary text-primary-foreground font-bold'
                                        : 'text-muted-foreground'
                                }`}
                            >
                                {lang === 'ka' ? 'ქარ' : lang === 'en' ? 'Eng' : 'Рус'}
                            </button>
                        ))}
                    </div>

                    {navLinks?.map((link, i) => (
                        <a
                            key={link?.label}
                            href={link?.href}
                            onClick={() => setMenuOpen(false)}
                            className="font-display text-4xl tracking-tight text-foreground hover:text-accent transition-colors duration-300"
                            style={{ transitionDelay: `${i * 60}ms` }}
                        >
                            {link?.label}
                        </a>
                    ))}
                    <a
                        href="#contact"
                        onClick={() => setMenuOpen(false)}
                        className="pill-btn pill-btn-primary mt-4"
                    >
                        {t('nav.orderNow')}
                    </a>
                </div>
            </div>
        </>
    );
}
