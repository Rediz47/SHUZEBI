import React from 'react';
import ProductCard from '../components/ProductCard';
import { PRODUCTS } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface WishlistProps {
  wishlistIds: number[];
  toggleWishlist: (id: number) => void;
}

const Wishlist: React.FC<WishlistProps> = ({ wishlistIds, toggleWishlist }) => {
  const { t } = useTranslation();
  const wishlistProducts = PRODUCTS.filter(p => wishlistIds.includes(p.id));

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-10">
        <div className="p-3 bg-red-50 rounded-full text-red-500">
          <Heart className="fill-current" size={24} />
        </div>
        <div>
          <h1 className="text-4xl font-bold font-['Space_Grotesk']">{t('wishlist.title')}</h1>
          <p className="text-gray-500">{wishlistProducts.length} {t('wishlist.itemsSaved')}</p>
        </div>
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="text-center py-32 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <ShoppingBag className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold font-['Space_Grotesk'] mb-2">{t('wishlist.emptyTitle')}</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">{t('wishlist.emptyDesc')}</p>
          <Link to="/shop">
            <button className="px-8 py-3 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition-all hover:shadow-lg">
              {t('wishlist.startShopping')}
            </button>
          </Link>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {wishlistProducts.map((product) => (
              <motion.div
                layout
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <ProductCard
                  product={product}
                  isWishlisted={true}
                  onToggleWishlist={() => toggleWishlist(product.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default Wishlist;