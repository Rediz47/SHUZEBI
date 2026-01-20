import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../constants';
import { Product } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, ShoppingBag, Heart } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import ProductCard from '../components/ProductCard';
import { useTranslation } from 'react-i18next';

interface ProductDetailsProps {
  addToCart: (product: Product, size: number) => void;
  wishlistIds: number[];
  toggleWishlist: (id: number) => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ addToCart, wishlistIds, toggleWishlist }) => {
  const { t, i18n } = useTranslation();
  const { formatPrice } = useCurrency();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [activeImage, setActiveImage] = useState<string>("");
  const [isAdding, setIsAdding] = useState(false);

  // Scroll to top when ID changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const found = PRODUCTS.find(p => p.id === Number(id));
    if (found) {
      setProduct(found);
      setActiveImage(found.image);
      setSelectedSize(null);
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!product || !selectedSize) return;
    setIsAdding(true);
    addToCart(product, selectedSize);
    setTimeout(() => setIsAdding(false), 1000);
  };

  const isWishlisted = product ? wishlistIds.includes(product.id) : false;

  const relatedProducts = product
    ? PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3)
    : [];

  if (!product) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-black mb-8 transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> {t('product.back')}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-24">

          {/* Left: Interactive Gallery */}
          <div className="flex flex-col gap-6">
            {/* Main Image Stage */}
            <motion.div
              className="relative aspect-square bg-zinc-50 rounded-3xl flex items-center justify-center p-0 overflow-hidden cursor-crosshair group"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Brand watermark background (Only visible if image is transparent) */}
              {activeImage.includes('goat.com') && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-bold text-gray-100 select-none font-['Space_Grotesk'] leading-none z-0 pointer-events-none">
                  {product.brand.toUpperCase()}
                </div>
              )}

              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  src={activeImage}
                  alt={product.name}
                  className={`relative z-10 w-full h-full ${activeImage.includes('goat.com') ? 'object-contain p-8 drop-shadow-xl' : 'object-cover'}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  whileHover={activeImage.includes('goat.com') ? { scale: 1.15, rotate: -5, transition: { duration: 0.3 } } : { scale: 1.05 }}
                />
              </AnimatePresence>
            </motion.div>

            {/* Thumbnails */}
            {product.gallery && product.gallery.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                {product.gallery.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(img)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-black ring-1 ring-black' : 'border-transparent hover:border-gray-300'
                      }`}
                  >
                    <img
                      src={img}
                      alt={`View ${index + 1}`}
                      className={`w-full h-full ${img.includes('goat.com') ? 'object-contain bg-zinc-50 p-1' : 'object-cover'}`}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div className="sticky top-32 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-gray-400 mb-2 uppercase tracking-wide flex items-center gap-2">
                    {product.brand}
                    <span className="h-[1px] w-10 bg-gray-300 inline-block"></span>
                    {t(`categories.${product.category.toLowerCase()}`)}
                  </h3>
                  <h1 className="text-5xl md:text-6xl font-bold font-['Space_Grotesk'] leading-tight mb-4 text-gray-900">
                    {product.name}
                  </h1>
                </div>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="p-3 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <Heart size={24} className={isWishlisted ? "fill-red-500 text-red-500" : "text-black"} />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <p className="text-3xl font-medium text-gray-900">{formatPrice(product.price)}</p>
                {/* Stars Removed */}
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-600 text-lg leading-relaxed"
            >
              {i18n.language === 'ka' && product.description_ka
                ? product.description_ka
                : i18n.language === 'ru' && product.description_ru
                  ? product.description_ru
                  : product.description}
            </motion.p>

            {/* Colors (Visual Only for now) */}
            <div className="space-y-3">
              <span className="font-bold">{t('product.availableColors')}</span>
              <div className="flex gap-2">
                {product.colors.map(color => (
                  <div key={color} className="w-8 h-8 rounded-full border border-gray-200 shadow-sm" style={{ backgroundColor: color.toLowerCase() }} title={color}></div>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold">{t('product.selectSize')}</span>
                <span className="text-gray-400 text-sm cursor-pointer hover:text-black underline">{t('product.sizeGuide')}</span>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 rounded-xl border transition-all duration-200 font-medium ${selectedSize === size
                      ? 'border-black bg-black text-white shadow-lg scale-105'
                      : 'border-gray-200 text-gray-600 hover:border-black hover:text-black'
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="pt-6 border-t border-gray-100"
            >
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize || isAdding}
                className={`w-full py-5 rounded-full font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 ${!selectedSize
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : isAdding
                    ? 'bg-green-600 text-white scale-95'
                    : 'bg-black text-white hover:bg-gray-900 hover:shadow-xl active:scale-[0.98]'
                  }`}
              >
                {isAdding ? (
                  <> {t('product.added')} <Check size={20} /></>
                ) : (
                  <> {t('product.addToBag')} <ShoppingBag size={20} /></>
                )}
              </button>
              {!selectedSize && (
                <p className="text-red-500 text-sm mt-3 text-center flex items-center justify-center gap-2">
                  {t('product.selectSizeError')}
                </p>
              )}
            </motion.div>

            <div className="flex items-center justify-center gap-6 text-sm text-gray-500 pt-4">
              <span className="flex items-center gap-1"><Check size={14} /> {t('product.authenticity')}</span>
              <span className="flex items-center gap-1"><Check size={14} /> {t('product.freeShipping')}</span>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="pt-16 border-t border-gray-100">
            <h3 className="text-3xl font-bold font-['Space_Grotesk'] mb-8">{t('product.related')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProducts.map(p => (
                <ProductCard
                  key={p.id}
                  product={p}
                  isWishlisted={wishlistIds.includes(p.id)}
                  onToggleWishlist={() => toggleWishlist(p.id)}
                />
              ))}
            </div>
          </section>
        )}

      </div>
    </div >
  );
};

export default ProductDetails;