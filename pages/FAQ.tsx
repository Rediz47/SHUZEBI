import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircle, Mail, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FAQ = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: t('faq.questions.q1'),
      a: t('faq.questions.a1')
    },
    {
      q: t('faq.questions.q2'),
      a: t('faq.questions.a2')
    },
    {
      q: t('faq.questions.q3'),
      a: t('faq.questions.a3')
    },
    {
      q: t('faq.questions.q4'),
      a: t('faq.questions.a4')
    },
    {
      q: t('faq.questions.q5'),
      a: t('faq.questions.a5')
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold font-['Space_Grotesk'] mb-4">{t('faq.title')}</h1>
        <p className="text-gray-500 text-lg">{t('faq.subtitle')}</p>
      </div>

      <div className="space-y-4 mb-20">
        <h2 className="text-2xl font-bold font-['Space_Grotesk'] mb-6">{t('faq.faqTitle')}</h2>
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-2xl overflow-hidden bg-white/50 backdrop-blur-sm"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
            >
              <span className="font-bold text-lg">{faq.q}</span>
              <motion.div
                animate={{ rotate: openIndex === index ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown />
              </motion.div>
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-6 pt-0 text-gray-600 leading-relaxed border-t border-gray-100 mt-2">
                    {faq.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div className="bg-gray-100 rounded-3xl p-8 md:p-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold font-['Space_Grotesk'] mb-4">{t('faq.contactTitle')}</h2>
            <p className="text-gray-600 mb-8">
              We're here to help. Send us a message and we'll respond as soon as possible.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-gray-600">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                  <Mail size={18} />
                </div>
                <span>support@shuzebi.com</span>
              </div>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                  <MessageCircle size={18} />
                </div>
                <span>Live Chat (9am - 5pm EST)</span>
              </div>
            </div>
          </div>

          <form className="space-y-4 bg-white p-6 rounded-2xl shadow-sm">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-1">{t('faq.email')}</label>
              <input
                type="email"
                placeholder={t('faq.placeholderEmail')}
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:border-black transition-all outline-none border"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-1">{t('faq.message')}</label>
              <textarea
                rows={4}
                placeholder={t('faq.placeholderMessage')}
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:border-black transition-all outline-none border resize-none"
              ></textarea>
            </div>
            <button className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-900 transition-all flex items-center justify-center gap-2">
              {t('faq.send')} <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FAQ;