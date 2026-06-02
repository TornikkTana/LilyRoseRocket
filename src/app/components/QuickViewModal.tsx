'use client';

import React, { useState, useEffect } from 'react';
import AppImage from '@/components/ui/AppImage';
import { useLanguage } from '@/context/LanguageContext';
import type { Bouquet } from '@/app/components/FeaturedBouquets';
import { useCart } from '@/context/CartContext';

const DISTRICT_KEYS: Record<string, string> = {
    'Vake': 'district.vake',
    'Saburtalo': 'district.saburtalo',
    'Vera': 'district.vera',
    'Mtatsminda': 'district.mtatsminda',
    'Chugureti': 'district.chugureti',
    'Didube': 'district.didube',
    'Isani': 'district.isani',
    'Samgori': 'district.samgori',
    'Gldani': 'district.gldani',
    'Didi Dighomi': 'district.didiDighomi',
    'Nadzaladevi': 'district.nadzaladevi',
    'Krtsanisi': 'district.krtsanisi'
};

interface QuickViewModalProps {
    bouquet: Bouquet;
    onClose: () => void;
}
const TBILISI_DISTRICTS = [
    'Vake',
    'Saburtalo',
    'Vera',
    'Mtatsminda',
    'Chugureti',
    'Didube',
    'Isani',
    'Samgori',
    'Gldani',
    'Didi Dighomi',
    'Nadzaladevi',
    'Krtsanisi'
];

export default function QuickViewModal({ bouquet, onClose }: QuickViewModalProps) {
    const { t } = useLanguage();
    const { addToCart } = useCart();

    // Form state
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [district, setDistrict] = useState('');
    const [address, setAddress] = useState('');

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Strip everything except numbers and '+' (for country code)
        setPhone(value.replace(/[^\d+]/g, ''));
    };

    // Close on escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const handleOrder = (e: React.FormEvent) => {
        e.preventDefault();

        // Format the message for WhatsApp
        const message = `${t('modal.whatsapp.greeting')}\n\n` +
            `🌸 ${t('modal.whatsapp.bouquet')}: ${t(bouquet.nameKey)}\n` +
            `💰 ${t('modal.whatsapp.price')}: ${bouquet.price}\n\n` +
            `📋 *${t('cart.whatsapp.details')}*\n` +
            `${t('cart.whatsapp.name')}: ${name}\n` +
            `${t('cart.whatsapp.phone')}: ${phone}\n` +
            `${t('cart.whatsapp.address')}: ${district ? t(DISTRICT_KEYS[district]) + ', ' : ''}${address}\n\n` +
            `${t('cart.whatsapp.confirm')}`;

        const whatsappUrl = `https://wa.me/995595012556?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" style={{ zIndex: 9999 }}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div
                className="relative bg-card w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row transform transition-all animate-in fade-in zoom-in-95 duration-200"
                style={{ maxHeight: '90vh' }}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-background/80 hover:bg-background text-foreground shadow-sm transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                {/* Left Side: Image */}
                <div className="relative w-full md:w-1/2 h-64 md:h-auto min-h-[300px] bg-muted">
                    <AppImage
                        src={bouquet.src}
                        alt={bouquet.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute top-4 left-4 z-10">
                        <span
                            className="text-xs font-semibold tracking-wider px-3 py-1 rounded-full shadow-sm"
                            style={{
                                backgroundColor: 'rgba(253,248,243,0.92)',
                                color: 'var(--accent)',
                                backdropFilter: 'blur(8px)'
                            }}>
                            {t(bouquet.tagKey)}
                        </span>
                    </div>
                </div>

                {/* Right Side: Details & Form */}
                <div className="w-full md:w-1/2 flex flex-col overflow-y-auto p-6 md:p-8 bg-white">
                    <div className="mb-6">
                        <h2 className="text-3xl font-display font-semibold text-foreground mb-1 leading-tight">
                            {t(bouquet.nameKey)}
                        </h2>
                        <p className="text-muted-foreground mb-4">
                            {t(bouquet.subNameKey)}
                        </p>
                        <div className="text-2xl font-roboto font-bold" style={{ color: 'var(--accent)' }}>
                            {bouquet.price}
                        </div>

                        <div className="mt-4 prose prose-sm text-muted-foreground">
                            <p>
                                {t('modal.description')}
                            </p>
                        </div>

                        {/* Add to Cart Action */}
                        <button
                            onClick={() => {
                                addToCart(bouquet);
                                onClose();
                            }}
                            className="w-full mt-6 py-4 rounded-full font-bold text-white transition-all transform hover:-translate-y-0.5 shadow-md flex items-center justify-center gap-2"
                            style={{
                                backgroundColor: 'var(--primary)',
                                color: 'var(--background)',
                                boxShadow: '0 4px 12px rgba(26,18,8,0.1)'
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                            {t('cart.add')}
                        </button>
                    </div>

                    <div className="border-t border-border/40 pt-6 mt-auto">
                        <h3 className="font-semibold text-foreground mb-4 text-lg">{t('modal.orderDetails')}</h3>
                        <form onSubmit={handleOrder} className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    required
                                    placeholder={t('modal.name')}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                />
                            </div>
                            <div>
                                <input
                                    type="tel"
                                    required
                                    placeholder={t('modal.phone')}
                                    value={phone}
                                    onChange={handlePhoneChange}
                                    className="w-full px-4 py-3 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                />
                            </div>
                            <div className="flex gap-3">
                                <select
                                    required
                                    value={district}
                                    onChange={(e) => setDistrict(e.target.value)}
                                    className="w-1/3 px-4 py-3 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
                                >
                                    <option value="" disabled>{t('modal.district')}</option>
                                    {TBILISI_DISTRICTS.map(d => (
                                        <option key={d} value={d}>{t(DISTRICT_KEYS[d])}</option>
                                    ))}
                                </select>
                                <input
                                    type="text"
                                    required
                                    placeholder={t('modal.street')}
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="w-2/3 px-4 py-3 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 rounded-full font-bold text-[#25D366] bg-white border-2 border-[#25D366] shadow-sm transform transition-all hover:bg-[#25D366] hover:text-white hover:-translate-y-0.5"
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                                    </svg>
                                    {t('modal.orderBtn')}
                                </div>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
