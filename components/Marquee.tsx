import React from 'react';
import { motion, Variants } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Marquee: React.FC = () => {
  const { t } = useTranslation();
  const marqueeVariants: Variants = {
    animate: {
      x: [0, -1000],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 20,
          ease: "linear",
        },
      },
    },
  };

  return (
    <div className="relative w-full bg-black text-white overflow-hidden py-3 z-50">
      <div className="flex whitespace-nowrap">
        <motion.div
          className="flex gap-16 text-xs font-bold tracking-[0.2em] uppercase"
          variants={marqueeVariants}
          animate="animate"
        >
          {Array(10).fill("").map((_, i) => (
            <React.Fragment key={i}>
              <span>{t('marquee.freeShipping')}</span>
              <span className="text-gray-600">•</span>
              <span>{t('marquee.newDrops')}</span>
              <span className="text-gray-600">•</span>
              <span>{t('marquee.authenticity')}</span>
              <span className="text-gray-600">•</span>
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Marquee;