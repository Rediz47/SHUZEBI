import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X, LogIn, ChevronRight } from 'lucide-react';
import { BRANDS } from '../../constants';

import { useTranslation } from 'react-i18next';

interface NavMobileProps {
    isOpen: boolean;
    onClose: () => void;
    onAuthClick: () => void;
}

const NavMobile: React.FC<NavMobileProps> = ({ isOpen, onClose, onAuthClick }) => {
    const { t } = useTranslation();

    const menuItems = [
        { label: t('nav.home'), path: '/' },
        { label: t('nav.shopAll'), path: '/shop' },
        { label: t('nav.wishlist'), path: '/wishlist' },
        { label: t('nav.support'), path: '/faq' },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] md:hidden"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ x: '100%', borderRadius: '40px 0 0 40px' }}
                        animate={{ x: 0, borderRadius: '0' }}
                        exit={{ x: '100%', borderRadius: '40px 0 0 40px' }}
                        transition={{ type: "spring", damping: 30, stiffness: 200 }}
                        className="absolute right-0 top-0 bottom-0 w-[90%] bg-white p-8 shadow-2xl flex flex-col"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-12">
                            <span className="text-sm font-black uppercase tracking-[0.3em] text-gray-400">{t('nav.navigation')}</span>
                            <button
                                onClick={onClose}
                                className="p-3 bg-gray-50 rounded-full hover:bg-black hover:text-white transition-all duration-300"
                            >
                                <X size={24} strokeWidth={1.5} />
                            </button>
                        </div>

                        <div className="flex flex-col space-y-4 mb-12">
                            {menuItems.map((item, idx) => (
                                <motion.div
                                    key={item.label}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <Link
                                        to={item.path}
                                        className="flex items-center justify-between text-4xl font-bold font-['Space_Grotesk'] tracking-tighter hover:text-gray-500 transition-colors group"
                                        onClick={onClose}
                                    >
                                        {item.label}
                                        <ChevronRight size={24} className="opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-2" />
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6">{t('nav.exploreBrands')}</p>
                            <div className="grid grid-cols-2 gap-3">
                                {BRANDS.map((brand, idx) => (
                                    <motion.div
                                        key={brand.name}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.3 + (idx * 0.05) }}
                                    >
                                        <Link
                                            to={`/shop?category=${brand.name}`}
                                            className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all group"
                                            onClick={onClose}
                                        >
                                            <div className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                                                <img src={brand.logo} alt={brand.name} className="w-5 h-5 object-contain" />
                                            </div>
                                            <span className="font-bold text-sm tracking-tight">{brand.name}</span>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-100">
                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                onClick={() => { onClose(); onAuthClick(); }}
                                className="w-full bg-black text-white py-5 rounded-[1.5rem] font-bold text-lg flex items-center justify-center gap-3 hover:bg-gray-900 transition-colors shadow-lg active:scale-95 transition-transform"
                            >
                                <LogIn size={20} /> {t('nav.login')}
                            </motion.button>
                            <p className="text-center text-xs text-gray-400 mt-6 tracking-wide">
                                © 2026 SHUZEBI LUXURY KICKS
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default NavMobile;
