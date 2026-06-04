'use client';

import React, { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import AppImage from '@/components/ui/AppImage';

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

export default function CartDrawer() {
    const { isCartOpen, setIsCartOpen, cartItems, removeFromCart, updateQuantity, totalPrice } = useCart();
    const { t } = useLanguage();
    
    // Form state
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [district, setDistrict] = useState('');
    const [address, setAddress] = useState('');

    // Submission states
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitType, setSubmitType] = useState<'whatsapp' | 'flitt'>('whatsapp');
    const [error, setError] = useState<string | null>(null);

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPhone(value.replace(/[^\d+]/g, ''));
    };

    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isCartOpen]);

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        if (cartItems.length === 0) return;
        setError(null);

        if (submitType === 'whatsapp') {
            let itemsText = cartItems.map(item => {
                const bName = item.bouquet.nameKey ? t(item.bouquet.nameKey) : (item.bouquet.name || '');
                return `🌸 ${item.quantity}x ${bName} (${item.bouquet.price})`;
            }).join('\n');
            
            const message = `${t('cart.whatsapp.greeting')}\n\n` +
                `${itemsText}\n\n` +
                `💰 *${t('cart.whatsapp.total')}* ₾ ${totalPrice}\n\n` +
                `📋 *${t('cart.whatsapp.details')}*\n` +
                `${t('cart.whatsapp.name')}: ${name}\n` +
                `${t('cart.whatsapp.phone')}: ${phone}\n` +
                `${t('cart.whatsapp.address')}: ${district ? t(DISTRICT_KEYS[district]) + ', ' : ''}${address}\n\n` +
                `${t('cart.whatsapp.confirm')}`;
                
            const whatsappUrl = `https://wa.me/995595012556?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        } else {
            setIsSubmitting(true);
            try {
                const res = await fetch('/api/payments/flitt/initiate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name,
                        phone,
                        district,
                        address,
                        cartItems,
                    }),
                });

                const data = await res.json();
                if (!res.ok || data.error) {
                    throw new Error(data.error || 'Failed to initiate online payment.');
                }

                if (data.redirectUrl) {
                    // Redirect to Flitt Checkout Page
                    window.location.href = data.redirectUrl;
                } else {
                    throw new Error('No redirect URL was returned by Flitt.');
                }
            } catch (err: any) {
                console.error(err);
                setError(err.message || 'Failed to start payment. Please try again.');
                setIsSubmitting(false);
            }
        }
    };

    if (!isCartOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={() => setIsCartOpen(false)}
            />

            {/* Drawer */}
            <div className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border/40">
                    <h2 className="text-2xl font-display font-semibold text-foreground">{t('cart.title')}</h2>
                    <button 
                        onClick={() => setIsCartOpen(false)}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {cartItems.length === 0 ? (
                        <div className="text-center text-muted-foreground mt-10">
                            {t('cart.empty')}
                        </div>
                    ) : (
                        cartItems.map(item => (
                            <div key={item.bouquet.id} className="flex gap-4 items-center">
                                <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                    <AppImage 
                                        src={item.bouquet.src} 
                                        alt={item.bouquet.nameKey ? t(item.bouquet.nameKey) : (item.bouquet.name || '')} 
                                        fill 
                                        className="object-cover"
                                        sizes="80px"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-foreground truncate">
                                        {item.bouquet.nameKey ? t(item.bouquet.nameKey) : item.bouquet.name}
                                    </h3>
                                    <div className="text-sm text-accent font-roboto font-medium">{item.bouquet.price}</div>
                                    
                                    <div className="flex items-center gap-3 mt-2">
                                        <button 
                                            onClick={() => updateQuantity(item.bouquet.id, -1)}
                                            className="w-6 h-6 flex items-center justify-center rounded-full border border-border text-foreground hover:bg-muted"
                                        >-</button>
                                        <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                                        <button 
                                            onClick={() => updateQuantity(item.bouquet.id, 1)}
                                            className="w-6 h-6 flex items-center justify-center rounded-full border border-border text-foreground hover:bg-muted"
                                        >+</button>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => removeFromCart(item.bouquet.id)}
                                    className="p-2 text-muted-foreground hover:text-red-500 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Checkout Section */}
                {cartItems.length > 0 && (
                    <div className="border-t border-border/40 p-6 bg-muted/20">
                        <div className="flex justify-between items-center mb-6">
                            <span className="font-semibold text-foreground">{t('cart.total')}</span>
                            <span className="text-2xl font-roboto font-bold text-accent">₾ {totalPrice}</span>
                        </div>
                        
                        <form onSubmit={handleCheckout} className="space-y-4">
                            <div>
                                <input 
                                    type="text" 
                                    required
                                    placeholder={t('modal.name')} 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                                />
                            </div>
                            <div>
                                <input 
                                    type="tel" 
                                    required
                                    placeholder={t('modal.phone')} 
                                    value={phone}
                                    onChange={handlePhoneChange}
                                    className="w-full px-4 py-3 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                                />
                            </div>
                            <div className="flex gap-2">
                                <select 
                                    required
                                    value={district}
                                    onChange={(e) => setDistrict(e.target.value)}
                                    className="w-2/5 px-3 py-3 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none text-sm"
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
                                    className="w-3/5 px-4 py-3 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                                />
                            </div>
                            
                            {error && (
                                <div className="text-red-500 text-xs mt-2 px-1 text-center font-medium">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-3 mt-4">
                                <button 
                                    type="submit"
                                    onClick={() => setSubmitType('flitt')}
                                    disabled={isSubmitting}
                                    className="w-full py-4 rounded-full font-bold text-white bg-foreground hover:bg-foreground/90 shadow-md transform transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting && submitType === 'flitt' ? (
                                        <div className="flex items-center gap-2">
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>{t('modal.paymentProcessing')}</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect width="20" height="14" x="2" y="5" rx="2"/>
                                                <line x1="2" x2="22" y1="10" y2="10"/>
                                            </svg>
                                            {t('cart.payOnline')}
                                        </div>
                                    )}
                                </button>

                                <button 
                                    type="submit"
                                    onClick={() => setSubmitType('whatsapp')}
                                    disabled={isSubmitting}
                                    className="w-full py-4 rounded-full font-bold text-[#25D366] bg-white border-2 border-[#25D366] shadow-sm transform transition-all hover:bg-[#25D366] hover:text-white hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                                        </svg>
                                        {t('cart.whatsappBtn')}
                                    </div>
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
