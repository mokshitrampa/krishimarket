import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isCustomer, isAuthenticated } = useAuth();
  const [cartData, setCartData] = useState({
    itemsCount: 0,
    farmerGroups: [],
    subtotal: 0,
    deliveryFee: 0,
    total: 0
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated || !isCustomer) {
      setCartData({ itemsCount: 0, farmerGroups: [], subtotal: 0, deliveryFee: 0, total: 0 });
      return;
    }

    try {
      setLoading(true);
      const res = await api.get('/cart');
      if (res.success && res.data) {
        setCartData(res.data);
      }
    } catch (err) {
      console.warn('Error fetching cart:', err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, isCustomer]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      showToast('Please login as a customer to add items to cart.', 'warning');
      return false;
    }
    if (!isCustomer) {
      showToast('Only customer accounts can place orders.', 'warning');
      return false;
    }

    try {
      const res = await api.post('/cart/items', { productId, quantity });
      if (res.success) {
        showToast(res.message || 'Product added to basket!');
        await fetchCart();
        return true;
      }
    } catch (err) {
      showToast(err.message || 'Could not add to cart', 'error');
      return false;
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const res = await api.put(`/cart/items/${itemId}`, { quantity });
      if (res.success) {
        await fetchCart();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const removeItem = async (itemId) => {
    try {
      const res = await api.delete(`/cart/items/${itemId}`);
      if (res.success) {
        showToast('Item removed.');
        await fetchCart();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/cart');
      setCartData({ itemsCount: 0, farmerGroups: [], subtotal: 0, deliveryFee: 0, total: 0 });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart: cartData,
        loading,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart: fetchCart,
        showToast,
        notification
      }}
    >
      {children}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce transition-all duration-300">
          <div
            className={`px-5 py-3 rounded-xl shadow-xl text-sm font-medium flex items-center gap-3 border ${
              notification.type === 'error'
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : notification.type === 'warning'
                ? 'bg-amber-50 border-amber-200 text-amber-800'
                : 'bg-forest-900 border-forest-800 text-white'
            }`}
          >
            <span>{notification.message}</span>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};