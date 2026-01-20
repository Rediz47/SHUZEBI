import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Newsletter: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto border-t border-gray-100">
      <div className="bg-zinc-100 rounded-[2rem] p-10 md:p-20 text-center relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '40px 40px' }}>
        </div>

        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold font-['Space_Grotesk'] mb-6">{t('newsletter.title')}</h2>
          <p className="text-gray-500 mb-10 text-lg">
            {t('newsletter.description')}
          </p>

          <form className="flex flex-col md:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder={t('newsletter.placeholder')}
              className="flex-1 px-8 py-4 rounded-full border border-gray-200 focus:outline-none focus:border-black focus:ring-2 focus:ring-black/5 transition-all bg-white"
            />
            <button className="px-10 py-4 bg-black text-white rounded-full font-bold hover:bg-gray-900 transition-all flex items-center justify-center gap-2 group">
              {t('newsletter.subscribe')} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
          <p className="text-xs text-gray-400 mt-6">
            {t('newsletter.disclaimer')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;