'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Bouquet } from '@/app/components/FeaturedBouquets';

export interface CartItem {
    bouquet: Bouquet;
    quantity: number;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (bouquet: Bouquet) => void;
    removeFromCart: (bouquetId: number) => void;
    updateQuantity: (bouquetId: number, delta: number) => void;
    clearCart: () => void;
    isCartOpen: boolean;
    setIsCartOpen: (isOpen: boolean) => void;
    totalItems: number;
    totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const addToCart = (bouquet: Bouquet) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.bouquet.id === bouquet.id);
            if (existing) {
                return prev.map(item => 
                    item.bouquet.id === bouquet.id 
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { bouquet, quantity: 1 }];
        });
        setIsCartOpen(true); // Open drawer when adding
    };

    const removeFromCart = (bouquetId: number) => {
        setCartItems(prev => prev.filter(item => item.bouquet.id !== bouquetId));
    };

    const updateQuantity = (bouquetId: number, delta: number) => {
        setCartItems(prev => prev.map(item => {
            if (item.bouquet.id === bouquetId) {
                const newQuantity = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQuantity };
            }
            return item;
        }));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    
    // Calculate total price (parsing '₾ 85' string to number)
    const totalPrice = cartItems.reduce((acc, item) => {
        const priceNum = parseInt(item.bouquet.price.replace(/[^\d]/g, ''), 10);
        return acc + (priceNum * item.quantity);
    }, 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            isCartOpen,
            setIsCartOpen,
            totalItems,
            totalPrice
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
