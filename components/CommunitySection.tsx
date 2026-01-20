import React from 'react';
import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const IMAGES = [
  "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?q=80&w=1000&auto=format&fit=crop",
];

const CommunitySection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="py-24 px-6 border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold font-['Space_Grotesk'] mb-3">{t('community.title')}</h2>
            <p className="text-gray-500 text-lg">{t('community.subtitle')}</p>
          </motion.div>

          <motion.a
            href="#"
            className="hidden md:flex items-center gap-2 px-6 py-3 rounded-full border border-gray-200 hover:bg-black hover:text-white transition-all font-medium mt-4 md:mt-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Instagram size={18} /> {t('community.follow')}
          </motion.a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {IMAGES.map((src, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative aspect-[4/5] overflow-hidden rounded-2xl group cursor-pointer"
            >
              <img
                src={src}
                alt="Community style"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur-sm text-black px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  {t('community.shopLook')}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;