import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import { Toast } from './components/Toast';
import Checkout from './pages/Checkout';
import CheckoutSuccess from './pages/CheckoutSuccess';
import { setupScrollBehavior, scrollToTop } from './utils/scrollUtils';
import ProductDetails from './pages/ProductDetails';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-primary">Loading...</div>
    </div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Create a ScrollToTop component
function ScrollToTop() {
  const location = useLocation();
  
  useEffect(() => {
    scrollToTop();
  }, [location]);

  return null;
}

function App() {
  useEffect(() => {
    setupScrollBehavior();
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ScrollToTop />
          <div className="min-h-screen bg-dark">
            <Header />
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/products/:id" element={
                <main className="pt-16">
                  <ProductDetails />
                </main>
              } />

              {/* Protected Routes */}
              <Route path="/" element={
                <PrivateRoute>
                  <main className="pt-16">
                    <Home />
                  </main>
                </PrivateRoute>
              } />
              
              {/* Protected Routes with Header */}
              <Route path="/home" element={
                <PrivateRoute>
                  <>
                    <Header />
                    <main className="pt-16">
                      <Home />
                    </main>
                  </>
                </PrivateRoute>
              } />
              <Route path="/products" element={
                <PrivateRoute>
                  <>
                    <Header />
                    <main className="pt-16">
                      <Products />
                    </main>
                  </>
                </PrivateRoute>
              } />
              <Route path="/cart" element={
                <PrivateRoute>
                  <>
                    <Header />
                    <main className="pt-16">
                      <Cart />
                    </main>
                  </>
                </PrivateRoute>
              } />
              <Route path="/profile" element={
                <PrivateRoute>
                  <>
                    <Header />
                    <main className="pt-16">
                      <Profile />
                    </main>
                  </>
                </PrivateRoute>
              } />
              <Route path="/checkout" element={
                <PrivateRoute>
                  <>
                    <Header />
                    <main className="pt-16">
                      <Checkout />
                    </main>
                  </>
                </PrivateRoute>
              } />
              <Route path="/checkout/success" element={
                <PrivateRoute>
                  <CheckoutSuccess />
                </PrivateRoute>
              } />

              {/* Default redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;