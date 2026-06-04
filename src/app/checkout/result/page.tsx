'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface OrderItem {
  bouquetId: number;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  payId: string;
  name: string;
  phone: string;
  district: string;
  address: string;
  items: OrderItem[];
  totalPrice: number;
  status: 'Created' | 'Processing' | 'Succeeded' | 'Failed' | 'Expired' | 'Pending';
  createdAt: string;
}

function ResultContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { clearCart } = useCart();
  const { t } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setError('Missing order ID.');
      setLoading(false);
      return;
    }

    let isMounted = true;
    let pollCount = 0;
    const maxPolls = 5;

    const fetchStatus = async () => {
      try {
        const res = await fetch(`/api/payments/flitt/status?orderId=${orderId}`);
        if (!res.ok) {
          throw new Error('Failed to retrieve order status');
        }
        const data = (await res.json()) as Order;

        if (isMounted) {
          setOrder(data);

          // If payment is succeeded or failed, stop loading
          if (data.status === 'Succeeded' || data.status === 'Failed' || data.status === 'Expired') {
            setLoading(false);
            if (data.status === 'Succeeded') {
              clearCart(); // Clear cart on successful payment
            }
          } else {
            // If still pending/processing, retry a few times
            if (pollCount < maxPolls) {
              pollCount++;
              setTimeout(fetchStatus, 2000);
            } else {
              setLoading(false);
            }
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Failed to check order status');
          setLoading(false);
        }
      }
    };

    fetchStatus();

    return () => {
      isMounted = false;
    };
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 min-h-[50vh]">
        <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-6 text-lg font-medium text-muted-foreground animate-pulse">
          {t('result.checkingStatus')}
        </p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-md w-full mx-auto bg-white rounded-2xl shadow-xl border border-red-100 p-8 text-center my-12 animate-in fade-in slide-in-from-bottom-5 duration-500">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" x2="12" y1="8" y2="12"/>
            <line x1="12" x2="12.01" y1="16" y2="16"/>
          </svg>
        </div>
        <h1 className="text-3xl font-display font-semibold text-foreground mb-3">
          {t('result.failed.title')}
        </h1>
        <p className="text-muted-foreground mb-8">
          {error || t('result.failed.desc')}
        </p>
        <a href="/" className="pill-btn pill-btn-primary block w-full py-4 text-center font-bold">
          {t('result.backHome')}
        </a>
      </div>
    );
  }

  const isSuccess = order.status === 'Succeeded';

  return (
    <div className="max-w-2xl w-full mx-auto bg-white rounded-2xl shadow-2xl border border-border/40 p-8 md:p-12 my-12 animate-in fade-in slide-in-from-bottom-6 duration-500">
      {isSuccess ? (
        <div className="text-center">
          <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner animate-bounce">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-semibold text-foreground mb-4">
            {t('result.success.title')}
          </h1>
          <p className="text-muted-foreground text-base max-w-md mx-auto mb-10">
            {t('result.success.desc')}
          </p>
        </div>
      ) : (
        <div className="text-center">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" x2="9" y1="9" y2="15"/>
              <line x1="9" x2="15" y1="9" y2="15"/>
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-semibold text-foreground mb-4">
            {t('result.failed.title')}
          </h1>
          <p className="text-muted-foreground text-base max-w-md mx-auto mb-10">
            {t('result.failed.desc')}
          </p>
        </div>
      )}

      {/* Order Summary Card */}
      <div className="bg-muted/30 rounded-xl p-6 md:p-8 mb-8 border border-border/40 text-left">
        <h2 className="text-lg font-semibold text-foreground mb-4 uppercase tracking-wider border-b border-border/60 pb-2">
          {t('modal.orderDetails')}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-foreground mb-6">
          <div>
            <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">{t('result.orderId')}</span>
            <span className="font-mono font-medium bg-white px-2 py-1 rounded border border-border/40">{order.id}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">{t('result.status')}</span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${
              isSuccess 
                ? 'bg-green-100 text-green-800' 
                : order.status === 'Pending' || order.status === 'Processing'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {t(`result.status.${order.status}`)}
            </span>
          </div>
          <div className="md:col-span-2 mt-2">
            <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">{t('cart.whatsapp.address')}</span>
            <span className="font-medium">{order.name} · {order.phone}<br/>{order.district}, {order.address}</span>
          </div>
        </div>

        {/* Items list */}
        <div className="border-t border-border/60 pt-4 mt-4">
          <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-3">Items Purchased</span>
          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm">
                <span className="text-foreground">
                  <span className="font-semibold text-accent">{item.quantity}x</span> {item.name}
                </span>
                <span className="font-medium font-roboto text-muted-foreground">₾ {(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Total price */}
        <div className="border-t border-border/60 pt-4 mt-6 flex justify-between items-center">
          <span className="font-bold text-foreground text-base">{t('cart.total')}</span>
          <span className="font-roboto font-bold text-accent text-2xl">₾ {order.totalPrice.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="/" className="pill-btn pill-btn-primary px-8 py-4 text-center font-bold transition-all hover:scale-[1.02]">
          {t('result.backHome')}
        </a>
      </div>
    </div>
  );
}

export default function CheckoutResultPage() {
  return (
    <>
      <Header />
      <main className="min-h-[85vh] bg-[#FDF8F3] pt-24 pb-12 px-4 flex items-center justify-center">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center py-20 min-h-[50vh]">
            <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
          <ResultContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
