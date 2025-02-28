import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';

const Cart = () => {
  const { cart, loading, updateCartItem, removeFromCart } = useCart();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-light">Loading cart...</div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-light">
          <ShoppingBagIcon className="h-16 w-16 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <button
            onClick={() => navigate('/products')}
            className="btn-primary"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  const handleQuantityChange = async (itemId, currentQuantity, isIncrement) => {
    if (!isIncrement && currentQuantity <= 1) {
      await removeFromCart(itemId);
    } else {
      await updateCartItem(itemId, currentQuantity, isIncrement);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8 text-light">Shopping Cart</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div key={item._id} className="bg-dark-card p-4 rounded-lg flex items-center gap-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-light">{item.name}</h3>
                <p className="text-primary">${item.price}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => handleQuantityChange(item._id, item.quantity, false)}
                    className="px-2 py-1 bg-dark-lighter rounded"
                  >
                    -
                  </button>
                  <span className="text-light">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item._id, item.quantity, true)}
                    className="px-2 py-1 bg-dark-lighter rounded"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="ml-4 text-red-500 hover:text-red-400"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-dark-card p-6 rounded-lg h-fit">
          <h2 className="text-xl font-semibold mb-4 text-light">Order Summary</h2>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-light">
              <span>Subtotal</span>
              <span>${cart.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-light">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="border-t border-gray-600 pt-2 flex justify-between text-light font-semibold">
              <span>Total</span>
              <span>${cart.total.toFixed(2)}</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/checkout')}
            className="w-full btn-primary"
            disabled={cart.items.length === 0}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;