import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BRANDS } from '../../constants';
import { useTranslation } from 'react-i18next';

interface NavMegaMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const NavMegaMenu: React.FC<NavMegaMenuProps> = ({ isOpen, onClose }) => {
    const { t } = useTranslation();

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 10, clipPath: "inset(0% 0% 100% 0%)" }}
                    animate={{ opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)" }}
                    exit={{ opacity: 0, y: 10, clipPath: "inset(0% 0% 100% 0%)" }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute top-full left-1/2 -translate-x-1/2 w-[600px] bg-white/95 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-3xl p-8 border border-gray-100 overflow-hidden mt-6"
                    onMouseLeave={onClose}
                >
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-black via-gray-800 to-black" />

                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">{t('nav.featuredBrands')}</h3>
                        <Link
                            to="/shop"
                            className="text-xs font-bold text-black border-b border-black md:hover:opacity-60 transition-opacity"
                            onClick={onClose}
                        >
                            {t('nav.shopAllBrands')}
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {BRANDS.map((brand) => (
                            <Link
                                key={brand.name}
                                to={`/shop?category=${brand.name}`}
                                className="flex items-center gap-5 p-4 rounded-2xl hover:bg-gray-50 transition-all duration-300 group/brand border border-transparent hover:border-gray-100"
                                onClick={onClose}
                            >
                                <div className="w-14 h-14 flex items-center justify-center bg-white rounded-xl shadow-sm group-hover/brand:shadow-md border border-gray-100 group-hover/brand:border-gray-200 transition-all duration-500">
                                    <img
                                        src={brand.logo}
                                        alt={brand.name}
                                        className="w-10 h-10 object-contain grayscale group-hover/brand:grayscale-0 transition-all duration-500 group-hover/brand:scale-110"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-lg font-bold text-gray-900 group-hover/brand:text-black">
                                        {brand.name}
                                    </span>
                                    <span className="text-xs text-gray-400 group-hover/brand:text-gray-600 transition-colors">
                                        {t('nav.viewCollection')}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default NavMegaMenu;
