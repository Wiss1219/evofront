import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchCart = async () => {
    if (!user) {
      setCart(null);
      setLoading(false);
      return;
    }
    
    try {
      const { data } = await cartAPI.get();
      setCart(data);
    } catch (error) {
      console.error('Error fetching cart:', error.response?.data || error.message);
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (productId, quantity) => {
    try {
      const { data } = await cartAPI.add(productId, quantity);
      setCart(data);
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
      return false;
    }
  };

  const updateCartItem = async (itemId, quantity, isIncrement = true) => {
    try {
      const { data } = isIncrement ? 
        await cartAPI.increment(itemId) :
        await cartAPI.decrement(itemId);
      setCart(data);
      return true;
    } catch (error) {
      console.error('Error updating cart:', error);
      toast.error('Failed to update cart');
      return false;
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await cartAPI.remove(itemId);
      setCart(prev => ({
        ...prev,
        items: prev.items.filter(item => item._id !== itemId)
      }));
      return true;
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove item from cart');
      return false;
    }
  };

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      addToCart,
      updateCartItem,
      removeFromCart,
      refreshCart: fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
