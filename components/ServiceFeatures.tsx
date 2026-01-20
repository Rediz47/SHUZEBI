import React from 'react';
import { ShieldCheck, Globe, RefreshCcw, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';

import { useTranslation } from 'react-i18next';

const ServiceFeatures: React.FC = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: ShieldCheck,
      title: t('features.authentic.title'),
      desc: t('features.authentic.desc')
    },
    {
      icon: Globe,
      title: t('features.shipping.title'),
      desc: t('features.shipping.desc')
    },
    {
      icon: RefreshCcw,
      title: t('features.returns.title'),
      desc: t('features.returns.desc')
    },
    {
      icon: Headphones,
      title: t('features.support.title'),
      desc: t('features.support.desc')
    }
  ];

  return (
    <section className="py-20 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-all duration-300">
                <feature.icon size={28} strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold font-['Space_Grotesk'] mb-3">{feature.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed max-w-[250px]">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceFeatures;