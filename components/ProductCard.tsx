import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { Heart } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

const BIG_IMAGE_NAMES = [
  "Jordan 6 Retro 'Infrared'",
  "Adidas Gazelle",
  "Yeezy 350 V2 'Bred'",
  "Nike Zoom Vomero 5",
  "Nike Air Max 97 'Silver Bullet'",
  "Air Jordan 3 Retro 'White Cement'",
  "Adidas Ultraboost 1.0",
  "Nike Blazer Mid '77 Vintage",
  "Yeezy 700 'Wave Runner'",
  "New Balance 2002R 'Protection Pack'",
  "Nike Dunk Low 'Grey Fog'",
  "Travis Scott x Air Jordan 1 Low"
];

interface ProductCardProps {
  product: Product;
  isWishlisted?: boolean;
  onToggleWishlist?: () => void;
  isShopPage?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isWishlisted, onToggleWishlist, isShopPage }) => {
  const { formatPrice } = useCurrency();
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]); // Reduced tilt for smaller cards
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  // Sheen effect movement
  const sheenX = useTransform(mouseXSpring, [-0.5, 0.5], ["-100%", "200%"]);
  const sheenY = useTransform(mouseYSpring, [-0.5, 0.5], ["-100%", "200%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  // Determine second image for hover effect
  const hoverImage = product.gallery && product.gallery.length > 1 ? product.gallery[1] : product.image;
  const hasSecondImage = product.gallery && product.gallery.length > 1;

  // Check if image should be larger
  const isBigImage = isShopPage && BIG_IMAGE_NAMES.some(name => product.name.includes(name));

  return (
    <div className="relative perspective-1000">
      {/* Wishlist Button Overlay */}
      {onToggleWishlist && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleWishlist();
          }}
          className="absolute top-3 right-3 z-30 p-1.5 rounded-full bg-white shadow-sm hover:scale-110 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
        >
          <Heart size={14} className={isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"} />
        </button>
      )}

      <Link to={`/product/${product.id}`} className="block group">
        <motion.div
          ref={ref}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={() => setIsHovered(true)}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          className="relative bg-white rounded-2xl p-4 cursor-pointer border border-transparent hover:border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-500 overflow-hidden"
        >
          {/* Gloss/Sheen Overlay */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <motion.div
              style={{ x: sheenX, y: sheenY }}
              className="absolute inset-0 w-[200%] h-[200%] bg-gradient-to-br from-transparent via-white/20 to-transparent rotate-45 transform translate-x-[-50%] translate-y-[-50%]"
            />
          </div>

          <div
            style={{ transform: "translateZ(30px)" }}
            className="relative aspect-square flex items-center justify-center mb-4 overflow-hidden rounded-lg bg-gray-50/50"
          >
            {/* Background Blob */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gray-200 rounded-full blur-2xl transition-opacity duration-500 ${isHovered && hasSecondImage ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`} />

            {/* Main Image */}
            <motion.img
              src={product.image}
              alt={product.name}
              className={`w-full h-full object-contain drop-shadow-sm z-10 absolute inset-0 ${isBigImage
                ? 'p-0 scale-[1.13]' // Slight zoom for specified shoes on Shop page
                : product.name.toLowerCase().includes('air max 90') ||
                  product.name.toLowerCase().includes('premiata') ||
                  product.name.toLowerCase().includes('valentino')
                  ? 'p-0 scale-125'
                  : 'p-2'
                } select-none`}
              draggable={false}
              initial={{ opacity: 1 }}
              animate={{ opacity: isHovered && hasSecondImage ? 0 : 1 }}
              transition={{ duration: 0.4 }}
            />

            {/* Hover Image (Lifestyle) */}
            {hasSecondImage && (
              <motion.img
                src={hoverImage}
                alt={`${product.name} lifestyle`}
                className="w-full h-full object-cover z-10 absolute inset-0 select-none"
                draggable={false}
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.4 }}
              />
            )}
          </div>

          <div style={{ transform: "translateZ(10px)" }} className="space-y-1 relative z-10">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{product.brand}</p>
            <h3 className="text-sm font-bold font-['Space_Grotesk'] text-gray-900 group-hover:text-black transition-colors line-clamp-1">
              {product.name}
            </h3>
            <div className="flex justify-between items-center pt-1">
              <span className="text-sm font-medium">{formatPrice(product.price)}</span>
              <span className="text-xs font-bold border-b border-black opacity-0 group-hover:opacity-100 transform translate-x-[-5px] group-hover:translate-x-0 duration-300">
                View
              </span>
            </div>
          </div>
        </motion.div>
      </Link>
    </div>
  );
};

export default ProductCard;