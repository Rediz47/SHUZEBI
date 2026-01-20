import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BRANDS } from '../constants';
import { ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const BrandGrid: React.FC = () => {
  const { t } = useTranslation();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto overflow-hidden">
      <div className="flex justify-between items-end mb-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-4xl md:text-5xl font-bold font-['Space_Grotesk'] tracking-tighter">{t('brandGrid.title')}</h2>
          <div className="h-1 w-12 bg-black mt-4" />
        </motion.div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6"
      >
        {BRANDS.map((brand) => (
          <Link key={brand.name} to={`/shop?category=${brand.name}`} className="group relative">
            <motion.div
              variants={itemVariants}
              whileHover={{
                y: -10,
                transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
              }}
              className="relative aspect-square bg-gray-50 rounded-[2.5rem] border border-gray-100 flex items-center justify-center p-10 overflow-hidden transition-colors duration-500 group-hover:bg-white group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] group-hover:border-transparent"
            >
              {/* Glossy Overlay Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              {/* Refined Shine Animation */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none">
                <div className="absolute top-[-100%] left-[-100%] w-[300%] h-[300%] bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] animate-[shine_3s_infinite]" />
              </div>

              {/* Logo */}
              <img
                src={brand.logo}
                alt={brand.name}
                className="w-full h-full object-contain grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 relative z-10 scale-90 group-hover:scale-105"
              />

              {/* Action Icon */}
              <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0 z-10">
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center shadow-lg">
                  <ArrowUpRight size={18} />
                </div>
              </div>

              <div className="absolute bottom-6 left-0 w-full text-center z-10">
                <span className="text-xs font-bold tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0 inline-block">
                  {brand.name}
                </span>
              </div>
            </motion.div>
          </Link>
        ))}
      </motion.div>

      <style>{`
        @keyframes shine {
          0% { transform: translate(-30%, -30%); }
          100% { transform: translate(30%, 30%); }
        }
      `}</style>
    </section>
  );
};

export default BrandGrid;