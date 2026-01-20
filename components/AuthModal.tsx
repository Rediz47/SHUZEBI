import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, ArrowRight, Github } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-[150]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: "-50%", y: "-40%" }}
            animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
            exit={{ opacity: 0, scale: 0.95, x: "-50%", y: "-40%" }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="fixed top-1/2 left-1/2 w-[90%] max-w-md bg-white rounded-3xl shadow-2xl z-[160] overflow-hidden"
          >
            <div className="p-8">
              <div className="relative flex items-center justify-center mb-8">
                <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-center">
                  {isLogin ? t('auth.welcomeBack') : t('auth.join')}
                </h2>
                <button
                  onClick={onClose}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
                {!isLogin && (
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-gray-400">{t('auth.fullName')}</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:border-black focus:ring-0 transition-all outline-none border hover:border-gray-200"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-gray-400">{t('auth.email')}</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:border-black focus:ring-0 transition-all outline-none border hover:border-gray-200"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-gray-400">{t('auth.password')}</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:border-black focus:ring-0 transition-all outline-none border hover:border-gray-200"
                      required
                    />
                  </div>
                </div>

                {isLogin && (
                  <div className="flex justify-end">
                    <button type="button" className="text-xs font-medium text-gray-500 hover:text-black">{t('auth.forgotPassword')}</button>
                  </div>
                )}

                <button className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-900 transition-all flex items-center justify-center gap-2 group mt-4">
                  {isLogin ? t('auth.signIn') : t('auth.createAccount')}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>

              <div className="my-6 flex items-center gap-4">
                <div className="h-[1px] bg-gray-100 flex-1"></div>
                <span className="text-xs text-gray-400 font-medium">OR</span>
                <div className="h-[1px] bg-gray-100 flex-1"></div>
              </div>

              <button className="w-full bg-white border border-gray-200 text-black py-3 rounded-xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                <Github size={20} /> {t('auth.continueGithub')}
              </button>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  {isLogin ? `${t('auth.noAccount')} ` : `${t('auth.hasAccount')} `}
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-black font-bold hover:underline"
                  >
                    {isLogin ? t('auth.signUp') : t('auth.logIn')}
                  </button>
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 text-center text-xs text-gray-400 border-t border-gray-100">
              {t('auth.footer')}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;