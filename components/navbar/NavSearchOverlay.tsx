import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp, ArrowRight } from 'lucide-react';
import { Product } from '../../types';
import { useCurrency } from '../../context/CurrencyContext';
import { useTranslation } from 'react-i18next';

interface NavSearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    searchResults: Product[];
    onProductClick: (id: number) => void;
}

const NavSearchOverlay: React.FC<NavSearchOverlayProps> = ({
    isOpen,
    onClose,
    searchQuery,
    setSearchQuery,
    searchResults,
    onProductClick
}) => {
    const { formatPrice } = useCurrency();
    const { t } = useTranslation();

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="fixed inset-0 z-[150] bg-white/95 backdrop-blur-2xl"
                >
                    <div className="max-w-6xl mx-auto px-6 pt-32 h-full flex flex-col">
                        <div className="flex justify-end mb-12">
                            <motion.button
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                onClick={onClose}
                                className="p-4 bg-gray-50 hover:bg-black hover:text-white rounded-full transition-all duration-500 shadow-sm"
                            >
                                <X size={28} strokeWidth={1} />
                            </motion.button>
                        </div>

                        <div className="relative mb-16">
                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                            >
                                <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-black w-8 h-8 md:w-14 md:h-14" />
                                <input
                                    type="text"
                                    placeholder={t('search.placeholder')}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    autoFocus
                                    className="w-full pl-12 md:pl-24 text-4xl md:text-7xl font-bold font-['Space_Grotesk'] tracking-tighter placeholder-gray-100 bg-transparent border-b border-gray-100 pb-8 focus:outline-none focus:border-black transition-all duration-700"
                                />
                            </motion.div>
                        </div>

                        <div className="flex-1 overflow-y-auto pb-20 scrollbar-hide">
                            {searchQuery && searchResults.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex flex-col items-center justify-center h-64 text-center"
                                >
                                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                        <Search className="text-gray-300" size={32} />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">{t('search.noResults')}</h3>
                                    <p className="text-gray-400">{t('search.tryAnother')}</p>
                                </motion.div>
                            ) : (
                                <>
                                    {!searchQuery && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 }}
                                            className="mb-12"
                                        >
                                            <div className="flex items-center gap-3 mb-8 text-black font-black uppercase tracking-[0.2em] text-xs">
                                                <TrendingUp size={16} /> <span>{t('search.popular')}</span>
                                            </div>
                                            <div className="flex flex-wrap gap-4">
                                                {['Jordan 4 Retro', 'Dunk Low Premium', 'Yeezy 350', 'New Balance 2002R', 'Travis Scott x Nike'].map(term => (
                                                    <button
                                                        key={term}
                                                        onClick={() => setSearchQuery(term)}
                                                        className="px-8 py-4 bg-gray-50 rounded-2xl hover:bg-black hover:text-white transition-all duration-300 text-sm font-bold border border-transparent hover:border-black/5"
                                                    >
                                                        {term}
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        <AnimatePresence mode="popLayout">
                                            {searchResults.map((product, idx) => (
                                                <motion.div
                                                    key={product.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                                                    onClick={() => onProductClick(product.id)}
                                                    className="flex items-center gap-6 p-5 rounded-3xl bg-white border border-gray-100/50 hover:border-black/10 hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] cursor-pointer transition-all duration-500 group"
                                                >
                                                    <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-50 rounded-[2rem] p-4 flex items-center justify-center flex-shrink-0 group-hover:bg-white transition-colors duration-500 border border-transparent group-hover:border-gray-100">
                                                        <img src={product.image} alt={product.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1.5">{product.brand}</p>
                                                        <h3 className="text-xl md:text-2xl font-bold font-['Space_Grotesk'] leading-tight mb-2 truncate group-hover:text-gray-600 transition-colors">{product.name}</h3>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-lg font-bold">{formatPrice(product.price)}</span>
                                                            <span className="text-[10px] px-2 py-0.5 bg-gray-100 rounded-full font-bold uppercase tracking-wider">{product.category}</span>
                                                        </div>
                                                    </div>
                                                    <div className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-500 transform group-hover:translate-x-1">
                                                        <ArrowRight size={20} />
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default NavSearchOverlay;
