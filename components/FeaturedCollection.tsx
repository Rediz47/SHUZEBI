import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { PRODUCTS } from '../constants';
import { useCurrency } from '../context/CurrencyContext';

import { useTranslation } from 'react-i18next';

const FeaturedCollection: React.FC = () => {
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();
  const basketballShoe = PRODUCTS.find(p => p.category === 'Basketball') || PRODUCTS[0];
  const lifestyleShoe = PRODUCTS.find(p => p.id === 2) || PRODUCTS[1]; // Air Force 1
  const runningShoe = PRODUCTS.find(p => p.category === 'Running') || PRODUCTS[4];

  const collections = [
    {
      id: 'basketball',
      title: 'Basketball',
      subtitle: t('collection.basketball.subtitle'),
      description: t('collection.basketball.desc'),
      product: basketballShoe,
      bgClass: 'bg-[#1a1a1a]', // Dark gray
      textClass: 'text-white',
      accentClass: 'bg-white/10 text-white',
      link: '/shop?category=Basketball',
      // Fix: White bg with black text on hover for dark card
      buttonHoverClass: 'group-hover:bg-white group-hover:text-black',
      delay: 0
    },
    {
      id: 'lifestyle',
      title: 'Lifestyle',
      subtitle: t('collection.lifestyle.subtitle'),
      description: t('collection.lifestyle.desc'),
      product: lifestyleShoe,
      bgClass: 'bg-[#F5F5F0]', // Stone/Light
      textClass: 'text-black',
      accentClass: 'bg-black/5 text-black',
      link: '/shop?category=Lifestyle',
      // Fix: Black bg with white text on hover for light card
      buttonHoverClass: 'group-hover:bg-black group-hover:text-white',
      delay: 0.1
    },
    {
      id: 'running',
      title: 'Running',
      subtitle: t('collection.running.subtitle'),
      description: t('collection.running.desc'),
      product: runningShoe,
      bgClass: 'bg-[#EBF5FF]', // Light Blue
      textClass: 'text-black',
      accentClass: 'bg-blue-500/10 text-blue-600',
      link: '/shop?category=Running',
      // Fix: Black bg with white text on hover for light card
      buttonHoverClass: 'group-hover:bg-black group-hover:text-white',
      delay: 0.2
    }
  ];

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold font-['Space_Grotesk'] mb-3">{t('collection.title')}</h2>
          <p className="text-gray-500 text-lg">{t('collection.subtitle')}</p>
        </motion.div>

        <Link to="/shop" className="hidden md:flex items-center gap-2 font-bold hover:gap-4 transition-all duration-300">
          {t('collection.viewAll')} <ArrowRight size={20} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:h-[600px]">
        {collections.map((col) => (
          <Link to={col.link} key={col.id} className="group relative overflow-hidden rounded-[2rem]">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: col.delay, duration: 0.5 }}
              className={`w-full h-full p-8 md:p-10 flex flex-col justify-between ${col.bgClass} ${col.textClass} transition-all duration-500 group-hover:scale-[0.98]`}
            >
              {/* Background Decorations */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white/20 to-transparent rounded-bl-full opacity-50 pointer-events-none" />

              {/* Header */}
              <div className="relative z-10">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 ${col.accentClass}`}>
                  {col.subtitle}
                </div>
                <h3 className="text-4xl font-bold font-['Space_Grotesk'] leading-none mb-2">{col.title}</h3>
                <p className="opacity-70 text-sm max-w-[200px]">{col.description}</p>
              </div>

              {/* Shoe Image */}
              <div className="relative flex-1 flex items-center justify-center my-4">
                <motion.img
                  src={col.product.image}
                  alt={col.title}
                  className="w-[80%] md:w-[120%] object-contain drop-shadow-2xl z-10 select-none"
                  initial={{ opacity: 0, x: 20, rotate: 10, scale: 0.9, filter: "blur(8px)" }}
                  whileInView={{ opacity: 1, x: 0, rotate: 0, scale: 1, filter: "blur(0px)" }}
                  transition={{ duration: 0.8, delay: col.delay + 0.2, ease: "easeOut" }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.15, rotate: 12, y: 10, transition: { duration: 0.4 } }}
                  draggable={false}
                />
                {/* Shadow */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-2/3 h-4 bg-black/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Action */}
              <div className="relative z-10 flex justify-between items-center opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                <span className="font-bold border-b border-current pb-1">{t('collection.shopCollection')}</span>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border border-current transition-colors ${col.buttonHoverClass}`}>
                  <ArrowUpRight size={18} />
                </div>
              </div>

            </motion.div>
          </Link>
        ))}
      </div>

      <div className="mt-8 md:hidden text-center">
        <Link to="/shop" className="inline-flex items-center gap-2 font-bold border-b border-black pb-1">
          {t('collection.viewAllCategories')} <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
};

export default FeaturedCollection;