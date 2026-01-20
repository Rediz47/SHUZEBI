import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, Search, User, Heart, Globe } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { PRODUCTS } from '../constants';
import { Product } from '../types';
import AuthModal from './AuthModal';
import { useCurrency } from '../context/CurrencyContext';
import NavMegaMenu from './navbar/NavMegaMenu';
import NavSearchOverlay from './navbar/NavSearchOverlay';
import NavMobile from './navbar/NavMobile';

interface NavbarProps {
  toggleCart: () => void;
  cartItemCount: number;
  wishlistCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ toggleCart, cartItemCount, wishlistCount }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [hoveredBrand, setHoveredBrand] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const { currency, setCurrency, formatPrice } = useCurrency();
  const { t, i18n } = useTranslation();
  const [isLangOpen, setIsLangOpen] = useState(false);

  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'ka', label: 'KA' },
    { code: 'ru', label: 'RU' }
  ];

  const currencies = ['USD', 'GEL', 'RUB'] as const;

  const location = useLocation();
  const navigate = useNavigate();

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
    setIsSearchOpen(false);
  }, [location]);

  useEffect(() => {
    const query = searchQuery.toLowerCase().trim();
    if (query === "") {
      setSearchResults([]);
    } else {
      const results = PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
      setSearchResults(results);
    }
  }, [searchQuery]);

  const handleProductClick = (id: number) => {
    navigate(`/product/${id}`);
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[100] flex flex-col">
        <motion.nav
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className={`transition-all duration-700 w-full ${isScrolled
            ? 'bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] py-3'
            : 'bg-transparent py-6'
            }`}
        >
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 group">
              <span className="text-2xl md:text-3xl font-black tracking-[-0.05em] font-['Space_Grotesk'] flex items-center gap-2">
                <img src="/images/transparentlogo.png" alt="Shuzebi Logo" className="h-10 w-auto object-contain" />
                {t('nav.brandName')}
                <span className="w-1.5 h-1.5 rounded-full bg-black group-hover:scale-150 transition-transform duration-500" />
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center space-x-8 ml-auto mr-32">
              <Link to="/" className="text-[13px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors hover:underline underline-offset-8">
                {t('nav.home')}
              </Link>
              <div
                className="relative h-full py-2"
                onMouseEnter={() => setHoveredBrand(true)}
                onMouseLeave={() => setHoveredBrand(false)}
              >
                <button className="text-[13px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors flex items-center gap-2">
                  {t('nav.brands')}
                </button>
                <NavMegaMenu isOpen={hoveredBrand} onClose={() => setHoveredBrand(false)} />
              </div>

              <Link to="/shop" className="text-[13px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors hover:underline underline-offset-8">
                {t('nav.shop')}
              </Link>

              <Link to="/faq" className="text-[13px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors hover:underline underline-offset-8">
                {t('nav.support')}
              </Link>
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-5 md:space-x-8">
              {/* Language Selector */}
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="flex items-center gap-1.5 text-[11px] font-black tracking-widest text-gray-400 hover:text-black transition-colors uppercase"
                >
                  <Globe size={14} strokeWidth={2.5} />
                  {languages.find(l => l.code === i18n.language)?.label || 'EN'}
                </button>

                <AnimatePresence>
                  {isLangOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-4 p-2 bg-white rounded-2xl shadow-xl border border-gray-100 min-w-[80px] z-[120]"
                    >
                      {languages.map((l) => (
                        <button
                          key={l.code}
                          onClick={() => {
                            i18n.changeLanguage(l.code);
                            setIsLangOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 rounded-xl text-xs font-bold transition-colors ${i18n.language === l.code ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                          {l.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Currency Selector */}
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                  className="flex items-center gap-1.5 text-[11px] font-black tracking-widest text-gray-400 hover:text-black transition-colors uppercase"
                >
                  {currency}
                </button>

                <AnimatePresence>
                  {isCurrencyOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-4 p-2 bg-white rounded-2xl shadow-xl border border-gray-100 min-w-[100px] z-[120]"
                    >
                      {currencies.map((c) => (
                        <button
                          key={c}
                          onClick={() => {
                            setCurrency(c);
                            setIsCurrencyOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 rounded-xl text-xs font-bold transition-colors ${currency === c ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                          {c}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                className="hover:scale-110 transition-transform text-black p-1"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search size={22} strokeWidth={2.5} />
              </button>

              <Link to="/wishlist" className="relative hover:scale-110 transition-transform text-black p-1 group">
                <Heart size={22} strokeWidth={2.5} className="group-hover:fill-red-500 group-hover:text-red-500 transition-colors" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <button
                className="hidden md:block hover:scale-110 transition-transform text-black p-1"
                onClick={() => setIsAuthOpen(true)}
              >
                <User size={22} strokeWidth={2.5} />
              </button>

              <button
                onClick={toggleCart}
                className="relative hover:scale-110 transition-transform text-black p-1"
              >
                <ShoppingBag size={22} strokeWidth={2.5} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                    {cartItemCount}
                  </span>
                )}
              </button>

              <button
                className="lg:hidden p-1 text-black hover:scale-110 transition-transform"
                onClick={() => setIsMobileOpen(true)}
              >
                <Menu size={24} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Scroll Progress Bar */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-[2px] bg-black origin-left"
            style={{ scaleX }}
          />
        </motion.nav>
      </div>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      <NavSearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchResults={searchResults}
        onProductClick={handleProductClick}
      />

      <NavMobile
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        onAuthClick={() => setIsAuthOpen(true)}
      />
    </>
  );
};

export default Navbar;