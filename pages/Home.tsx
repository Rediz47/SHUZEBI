import React from 'react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import Marquee from '../components/Marquee';
import FeaturedCollection from '../components/FeaturedCollection';
import GrailHighlight from '../components/GrailHighlight';
import Newsletter from '../components/Newsletter';
import BrandGrid from '../components/BrandGrid';
import { PRODUCTS } from '../constants';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface HomeProps {
  wishlistIds: number[];
  toggleWishlist: (id: number) => void;
}

const Home: React.FC<HomeProps> = ({ wishlistIds, toggleWishlist }) => {
  const { t } = useTranslation();
  // Select exactly 8 products for a perfect 2-row grid on desktop (4 columns x 2 rows)
  const popularProducts = PRODUCTS.slice(0, 8);

  return (
    <div className="min-h-screen">
      <Hero />
      <Marquee />
      <FeaturedCollection />

      {/* IMPROVED POPULAR SECTION: Compact Grid Layout */}
      <section className="py-16 bg-white relative">

        {/* Subtle Background Typography */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full text-center pointer-events-none select-none overflow-hidden">
          <span className="text-[12vw] font-bold text-gray-50 font-['Space_Grotesk'] leading-none tracking-tighter">
            {t('homePage.trendingBg')}
          </span>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center mb-12"
          >
            <div className="flex items-center gap-2 mb-3 text-black bg-gray-100 px-3 py-1 rounded-full">
              <Sparkles size={12} className="fill-black" />
              <span className="font-bold tracking-[0.2em] uppercase text-[9px]">{t('homePage.curatedSelection')}</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold font-['Space_Grotesk'] text-black mb-3">{t('homePage.trendingTitle')}</h2>
            <p className="text-gray-500 text-base max-w-md font-light">
              {t('homePage.trendingDesc')}
            </p>
          </motion.div>

          {/* Grid Layout: 
              - Mobile: 2 cols
              - Tablet/Desktop: 4 cols (Strictly 2 rows of 4) 
          */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-8 md:gap-x-4 md:gap-y-10">
            {popularProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
              >
                <ProductCard
                  product={product}
                  isWishlisted={wishlistIds.includes(product.id)}
                  onToggleWishlist={() => toggleWishlist(product.id)}
                />
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/shop">
              <button className="px-8 py-3 bg-black text-white rounded-full font-bold text-sm hover:scale-105 transition-transform shadow-lg flex items-center gap-2 mx-auto group">
                {t('homePage.viewFullCollection')} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      <BrandGrid />
      <GrailHighlight />
      <Newsletter />
    </div>
  );
};

export default Home;