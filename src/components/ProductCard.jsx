import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const navigate = useNavigate();

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login', { state: { from: `/products/${product._id}` } });
      return;
    }

    try {
      setIsAdding(true);
      const success = await addToCart(product._id, 1);
      if (success) {
        toast.success('Added to cart successfully!');
      }
    } catch (error) {
      toast.error('Error adding to cart');
    } finally {
      setIsAdding(false);
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
    navigate(`/products/${product._id}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-dark-card rounded-2xl p-6 space-y-4 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
    >
      <img 
        src={product.image} 
        alt={product.name} 
        className="w-full h-48 object-cover rounded-xl mb-4"
      />
      <h3 className="text-xl font-semibold text-light">{product.name}</h3>
      <p className="text-light-muted line-clamp-2">{product.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-primary">${product.price}</span>
        {product.stock === 0 ? (
          <span className="px-4 py-2 rounded-lg bg-gray-700 text-gray-400 cursor-not-allowed">
            Out of Stock
          </span>
        ) : isAuthenticated ? (
          <button 
            onClick={handleAddToCart}
            disabled={isAdding}
            className="btn-primary px-4 py-2 rounded-lg flex items-center gap-2 hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCartIcon className="h-5 w-5" />
            {isAdding ? 'Adding...' : 'Add to Cart'}
          </button>
        ) : (
          <Link
            to="/login"
            state={{ from: `/products/${product._id}` }}
            className="btn-primary px-4 py-2 rounded-lg flex items-center gap-2 hover:scale-105 transition-transform"
            onClick={(e) => e.stopPropagation()}
          >
            <ShoppingCartIcon className="h-5 w-5" />
            Login to Add
          </Link>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
