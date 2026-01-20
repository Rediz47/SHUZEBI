import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import FAQ from './pages/FAQ';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';

import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import Toast, { ToastType } from './components/Toast';
import { Product, CartItem } from './types';
import { CurrencyProvider } from './context/CurrencyContext';
import { AnimatePresence } from 'framer-motion';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Force navigation to home on initial load to ensure the experience starts from the beginning
const InitialRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      if (location.pathname !== '/') {
        navigate('/', { replace: true });
      }
      initialized.current = true;
    }
  }, [navigate, location]);

  return null;
};

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);

  // Toast State
  const [toast, setToast] = useState<{ message: string; type: ToastType; isVisible: boolean }>({
    message: '',
    type: 'info',
    isVisible: false,
  });

  const showToast = (message: string, type: ToastType = 'info') => {
    setToast({ message, type, isVisible: true });
  };

  const closeToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const addToCart = (product: Product, selectedSize: number) => {
    setCart((prev) => {
      const existing = prev.find(item => item.id === product.id && item.selectedSize === selectedSize);
      if (existing) {
        return prev.map(item =>
          item.id === product.id && item.selectedSize === selectedSize
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, selectedSize, quantity: 1 }];
    });
    setIsCartOpen(true);
    showToast(`Added ${product.name} to bag`, 'success');
  };

  const removeFromCart = (id: number, size: number) => {
    setCart(prev => prev.filter(item => !(item.id === id && item.selectedSize === size)));
  };

  const updateQuantity = (id: number, size: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id && item.selectedSize === size) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (id: number) => {
    setWishlistIds(prev => {
      const isWislisted = prev.includes(id);
      if (isWislisted) {
        showToast("Removed from wishlist", 'info');
        return prev.filter(i => i !== id);
      } else {
        showToast("Added to wishlist", 'success');
        return [...prev, id];
      }
    });
  };

  return (
    <Router>
      <InitialRedirect />
      <ScrollToTop />

      <CurrencyProvider>
        <div className="bg-[#FAFAFA] min-h-screen text-gray-900 font-sans selection:bg-black selection:text-white relative">
          <Navbar
            toggleCart={() => setIsCartOpen(true)}
            cartItemCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
            wishlistCount={wishlistIds.length}
          />

          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cart={cart}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
          />

          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={
                <Home
                  wishlistIds={wishlistIds}
                  toggleWishlist={toggleWishlist}
                />
              } />
              <Route path="/shop" element={
                <Shop
                  wishlistIds={wishlistIds}
                  toggleWishlist={toggleWishlist}
                />
              } />
              <Route path="/faq" element={<FAQ />} />

              <Route path="/wishlist" element={
                <Wishlist
                  wishlistIds={wishlistIds}
                  toggleWishlist={toggleWishlist}
                />
              } />
              <Route path="/checkout" element={
                <Checkout
                  cart={cart}
                  clearCart={clearCart}
                />
              } />
              <Route path="/product/:id" element={
                <ProductDetails
                  addToCart={addToCart}
                  wishlistIds={wishlistIds}
                  toggleWishlist={toggleWishlist}
                />
              } />
            </Routes>
          </AnimatePresence>

          <Footer />
          <Chatbot />
          <Toast
            message={toast.message}
            type={toast.type}
            isVisible={toast.isVisible}
            onClose={closeToast}
          />
        </div>
      </CurrencyProvider>
    </Router>
  );
};

export default App;