import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';
import { Link } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';
import { useTranslation } from 'react-i18next';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  removeFromCart: (id: number, size: number) => void;
  updateQuantity: (id: number, size: number, delta: number) => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, cart, removeFromCart, updateQuantity }) => {
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[190]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 bottom-0 w-full md:w-[450px] bg-white z-[200] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold font-['Space_Grotesk']">{t('cart.title')} ({cart.length})</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                  <ShoppingBag size={48} strokeWidth={1} />
                  <p>{t('cart.empty')}</p>
                </div>
              ) : (
                cart.map((item) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    key={`${item.id}-${item.selectedSize}`}
                    className="flex gap-4"
                  >
                    <div className="w-24 h-24 bg-gray-50 rounded-xl p-2 flex items-center justify-center flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-sm text-gray-900">{item.name}</h3>
                          <button
                            onClick={() => removeFromCart(item.id, item.selectedSize)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-sm text-gray-500">{item.brand} • {t('checkout.summary.size')} {item.selectedSize}</p>
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="flex items-center border border-gray-200 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, item.selectedSize, -1)}
                            className="px-3 py-1 hover:bg-gray-50 text-gray-600 transition-colors"
                          >-</button>
                          <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.selectedSize, 1)}
                            className="px-3 py-1 hover:bg-gray-50 text-gray-600 transition-colors"
                          >+</button>
                        </div>
                        <span className="font-bold">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">{t('cart.subtotal')}</span>
                  <span className="text-xl font-bold font-['Space_Grotesk']">{formatPrice(subtotal)}</span>
                </div>
                <Link to="/checkout" onClick={onClose}>
                  <button className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-900 transition-all hover:shadow-lg active:scale-[0.98]">
                    {t('cart.checkout')}
                  </button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;