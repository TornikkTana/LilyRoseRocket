'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';

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

function ModalContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');
  const { clearCart } = useCart();
  const { t } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      return;
    }

    setIsOpen(true);
    setLoading(true);
    setError(null);
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

  const handleClose = () => {
    setIsOpen(false);
    // Remove query params from URL
    router.replace('/');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300 animate-in fade-in">
      <div className="relative max-w-lg w-full bg-white rounded-2xl shadow-2xl border border-border/40 overflow-hidden flex flex-col max-h-[90vh] animate-in scale-in duration-300">
        
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors z-10"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="overflow-y-auto p-6 md:p-8 flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-6 text-sm font-medium text-muted-foreground animate-pulse text-center">
                {t('result.checkingStatus') || 'Checking payment status...'}
              </p>
            </div>
          ) : error || !order ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" x2="12" y1="8" y2="12"/>
                  <line x1="12" x2="12.01" y1="16" y2="16"/>
                </svg>
              </div>
              <h3 className="text-2xl font-display font-semibold text-foreground mb-3">
                {t('result.failed.title') || 'Payment Failed'}
              </h3>
              <p className="text-muted-foreground text-sm mb-8">
                {error || t('result.failed.desc') || 'Your payment could not be processed.'}
              </p>
              <button onClick={handleClose} className="pill-btn pill-btn-primary w-full py-4 text-center font-bold">
                {t('result.backHome') || 'Close'}
              </button>
            </div>
          ) : (
            <div>
              {order.status === 'Succeeded' ? (
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner animate-bounce">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-display font-semibold text-foreground mb-2">
                    {t('result.success.title') || 'Thank You!'}
                  </h3>
                  <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
                    {t('result.success.desc') || 'Your payment was successful and your order has been received.'}
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="15" x2="9" y1="9" y2="15"/>
                      <line x1="9" x2="15" y1="9" y2="15"/>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-display font-semibold text-foreground mb-2">
                    {t('result.failed.title') || 'Payment Failed'}
                  </h3>
                  <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
                    {t('result.failed.desc') || 'Your payment was not successful.'}
                  </p>
                </div>
              )}

              {/* Receipt / Details Card */}
              <div className="bg-muted/30 rounded-xl p-5 border border-border/40 text-left text-sm text-foreground">
                <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-3 pb-1 border-b border-border/60">
                  {t('modal.orderDetails') || 'Order Details'}
                </h4>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase tracking-wider mb-0.5">{t('result.orderId') || 'Order ID'}</span>
                    <span className="font-mono font-medium text-xs bg-white px-1.5 py-0.5 rounded border border-border/40">{order.id}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase tracking-wider mb-0.5">{t('result.status') || 'Status'}</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                      order.status === 'Succeeded'
                        ? 'bg-green-100 text-green-800' 
                        : order.status === 'Pending' || order.status === 'Processing'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {t(`result.status.${order.status}`) || order.status}
                    </span>
                  </div>
                  <div className="col-span-2 mt-1">
                    <span className="text-muted-foreground block text-[10px] uppercase tracking-wider mb-0.5">{t('cart.whatsapp.address') || 'Delivery Address'}</span>
                    <span className="font-medium text-xs">{order.name} · {order.phone}<br/>{order.district}, {order.address}</span>
                  </div>
                </div>

                {/* Items */}
                <div className="border-t border-border/60 pt-3 mt-3 space-y-2">
                  <span className="text-muted-foreground block text-[10px] uppercase tracking-wider">Items Purchased</span>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs">
                      <span>
                        <span className="font-semibold text-accent">{item.quantity}x</span> {item.name}
                      </span>
                      <span className="font-medium text-muted-foreground">₾ {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="border-t border-border/60 pt-3 mt-4 flex justify-between items-center font-bold">
                  <span>{t('cart.total') || 'Total'}</span>
                  <span className="text-accent text-lg">₾ {order.totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6">
                <button 
                  onClick={handleClose} 
                  className="pill-btn pill-btn-primary w-full py-3.5 text-center font-bold text-sm transition-all hover:scale-[1.02]"
                >
                  {t('result.backHome') || 'Close'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessModal() {
  return (
    <Suspense fallback={null}>
      <ModalContent />
    </Suspense>
  );
}
