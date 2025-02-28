import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ShoppingCartIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

function ProductSkeleton() {
  return (
    <div className="bg-dark-card rounded-2xl p-6 space-y-4 animate-pulse">
      <div className="w-full h-48 bg-gray-700 rounded-xl"></div>
      <div className="h-6 bg-gray-700 rounded w-3/4"></div>
      <div className="h-4 bg-gray-700 rounded w-full"></div>
      <div className="flex items-center justify-between">
        <div className="h-8 bg-gray-700 rounded w-20"></div>
        <div className="h-10 bg-gray-700 rounded w-32"></div>
      </div>
    </div>
  );
}

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (productId) => {
    if (!user) {
      toast.error('Please log in to add items to cart');
      navigate('/login');
      return;
    }

    try {
      const success = await addToCart(productId, 1);
      if (success) {
        toast.success('Added to cart successfully');
      }
    } catch (err) {
      console.error('Failed to add to cart:', err);
      toast.error('Failed to add item to cart');
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                          (product.category && product.category === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  // Safely handle categories with null check and filter out undefined/null values
  const categories = ['all', ...new Set(products
    .map(p => p.category)
    .filter(category => category)) // Remove null/undefined values
  ];

  if (loading) return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {[...Array(8)].map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
  if (error) return <div className="text-center py-24 text-red-500">{error}</div>;

  return (
    <div className="max-w-8xl mx-auto px-6 py-16">
      <div className="mb-8 space-y-6">
        <h1 className="text-4xl font-bold text-light">Our Products</h1>
        
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 bg-dark-card rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-dark-card text-light-muted hover:bg-gray-700'
                }`}
              >
                {category === 'all' ? 'All' : category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.map((product) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-dark-card rounded-2xl p-6 space-y-4 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative overflow-hidden rounded-xl">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h2 className="text-xl font-semibold text-light mt-4">
              {product.name}
            </h2>
            <p className="text-light-muted line-clamp-2">{product.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-primary">${product.price}</span>
              <button 
                onClick={() => handleAddToCart(product._id)}
                className="btn-primary px-4 py-2 rounded-lg flex items-center gap-2 hover:scale-105 transition-transform"
              >
                <ShoppingCartIcon className="h-5 w-5" />
                Add to Cart
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Products;
