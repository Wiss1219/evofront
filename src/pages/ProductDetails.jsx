import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Error loading product');
        if (error.response && error.response.status === 404) {
          navigate('/products');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-primary text-xl">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-xl">Product not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/')}
        className="mb-6 flex items-center gap-2 text-light hover:text-primary transition-colors"
      >
        <ArrowLeftIcon className="h-5 w-5" />
        Back to Home
      </button>

      <div className="max-w-4xl mx-auto bg-dark-card rounded-2xl p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-full rounded-xl object-cover aspect-square"
            />
          </div>
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-light">{product.name}</h1>
            <p className="text-light-muted">{product.description}</p>
            <div className="text-3xl font-bold text-primary">${product.price}</div>
            <div className="flex items-center gap-2">
              <div className="text-primary">
                {'★'.repeat(Math.round(product.rating || 0))}
                {'☆'.repeat(5 - Math.round(product.rating || 0))}
              </div>
              <span className="text-light-muted">
                ({product.reviews?.length || 0} reviews)
              </span>
            </div>
            <div className="space-y-4">
              <p className="text-light-muted">
                Stock: {product.stock > 0 ? `${product.stock} units` : 'Out of stock'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
