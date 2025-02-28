import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import evoImage from '../assets/evo.jpg';

const styles = `
  @keyframes fadeIn {
    from { 
      opacity: 0; 
      transform: scale(1.1) translateY(10px); 
    }
    to { 
      opacity: 1; 
      transform: scale(1) translateY(0); 
    }
  }
  
  .text-shadow-lg {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }
  
  img.loaded {
    animation: none;
  }
  
  @media (min-width: 1536px) {
    .scale-135 {
      transform: scale(1.35);
    }
  }
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data.slice(0, 3)); // Get first 3 products for featured section
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const goToProducts = () => {
    navigate('/products');
  };

  const isLoggedIn = !!localStorage.getItem('token');

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    // Add newsletter subscription logic here
    alert('Thanks for subscribing!');
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-dark">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] lg:min-h-screen bg-dark overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center min-h-[80vh] lg:min-h-screen">
            {/* Left side - Text content */}
            <div className="text-left py-8 md:py-12 z-10">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6">
                Level Up Your Gaming Experience
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-6 md:mb-8">
                Discover the latest games, accessories, and gaming gear at unbeatable prices
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/products')}
                  className="w-full sm:w-auto bg-red-600 text-white px-6 md:px-8 py-3 rounded-full hover:bg-red-700 transition-colors text-base md:text-lg font-semibold"
                >
                  Shop Now
                </button>
                {!isLoggedIn && (
                  <button
                    onClick={() => navigate('/register')}
                    className="w-full sm:w-auto bg-transparent border-2 border-white text-white px-6 md:px-8 py-3 rounded-full hover:bg-white hover:text-black transition-colors text-base md:text-lg font-semibold"
                  >
                    Join Us
                  </button>
                )}
              </div>
            </div>
            
            {/* Right side - Image */}
            <div className="relative h-full flex items-center justify-center md:justify-end w-full">
              <div className="relative w-[90%] md:w-full overflow-hidden rounded-2xl shadow-2xl 
                            transform hover:scale-102 transition-all duration-500">
                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-transparent to-dark/20 z-10" />
                
                {/* Main image */}
                <img 
                  src={evoImage} 
                  alt="Gaming Setup"
                  loading="eager"
                  className="w-full h-[40vh] sm:h-[45vh] md:h-[50vh] lg:h-[60vh]
                           object-cover object-center rounded-2xl shadow-lg
                           transform hover:scale-102 transition-all duration-500
                           hover:brightness-105"
                  style={{
                    animation: 'fadeIn 0.8s ease-in',
                    WebkitBackfaceVisibility: 'hidden',
                  }}
                  onLoad={(e) => e.target.classList.add('loaded')}
                />

                {/* Bottom gradient */}
                <div className="absolute bottom-0 left-0 right-0 h-1/4 
                              bg-gradient-to-t from-dark to-transparent 
                              pointer-events-none opacity-70" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-dark">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Shop by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Games',
                image: 'https://images.unsplash.com/photo-1592155931584-901ac15763e3?ixlib=rb-4.0.3',
                description: 'Latest titles and classic games'
              },
              {
                name: 'Consoles',
                image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?ixlib=rb-4.0.3',
                description: 'Next-gen gaming systems'
              },
              {
                name: 'Accessories',
                image: 'https://images.unsplash.com/photo-1600861194942-f883de0dfe96?ixlib=rb-4.0.3',
                description: 'Enhance your gaming setup'
              }
            ].map((category) => (
              <div 
                key={category.name} 
                className="relative group cursor-pointer overflow-hidden rounded-xl"
                onClick={() => navigate(`/products?category=${category.name.toLowerCase()}`)}
              >
                <div className="h-80 relative overflow-hidden">
                  <img 
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent group-hover:from-black/90 transition-all duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
                    <p className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {category.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section - Enhanced styling */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Featured Products
          </h2>
          {loading ? (
            <div className="text-center text-light">Loading products...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product._id}
                  onClick={() => navigate(`/products/${product._id}`)}
                  className="bg-dark-card rounded-2xl p-6 transition-all hover:-translate-y-2 hover:shadow-xl cursor-pointer"
                >
                  <div className="relative mb-6">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full aspect-square object-cover rounded-xl"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-light mb-2">{product.name}</h3>
                  <p className="text-light-muted mb-4">{product.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-primary">${product.price}</span>
                    <div className="flex items-center">
                      <div className="text-primary">
                        {'★'.repeat(Math.round(product.rating || 0))}
                        {'☆'.repeat(5 - Math.round(product.rating || 0))}
                      </div>
                      <span className="text-light-muted ml-2">
                        ({product.reviews?.length || 0})
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-red-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Stay Updated
          </h2>
          <p className="text-white mb-8">
            Subscribe to our newsletter for exclusive deals and gaming news
          </p>
          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
            <button
              type="submit"
              className="bg-white text-red-600 px-8 py-3 rounded-full hover:bg-gray-100 transition-colors font-semibold"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Home;