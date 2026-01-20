import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Truck, CreditCard, ChevronLeft, ShieldCheck } from 'lucide-react';
import { CartItem } from '../types';
import { Link } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';
import { useTranslation } from 'react-i18next';

interface CheckoutProps {
   cart: CartItem[];
   clearCart: () => void;
}

const steps = [
   { id: 1, title: 'checkout.steps.information', icon: ShieldCheck },
   { id: 2, title: 'checkout.steps.shipping', icon: Truck },
   { id: 3, title: 'checkout.steps.payment', icon: CreditCard },
];

const Checkout: React.FC<CheckoutProps> = ({ cart, clearCart }) => {
   const { formatPrice } = useCurrency();
   const { t } = useTranslation();
   const [currentStep, setCurrentStep] = useState(1);
   const [isProcessing, setIsProcessing] = useState(false);
   const [isCompleted, setIsCompleted] = useState(false);

   const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
   const shipping = currentStep > 1 ? 25 : 0; // Flat rate for demo
   const total = subtotal + shipping;

   const handleNext = () => {
      if (currentStep < 3) {
         setCurrentStep(curr => curr + 1);
      } else {
         handlePlaceOrder();
      }
   };

   const handlePlaceOrder = () => {
      setIsProcessing(true);
      setTimeout(() => {
         setIsProcessing(false);
         setIsCompleted(true);
         clearCart();
      }, 2500);
   };

   if (isCompleted) {
      return (
         <div className="min-h-screen bg-white flex items-center justify-center p-6">
            <motion.div
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="max-w-md w-full text-center"
            >
               <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check size={40} className="text-green-500" />
               </div>
               <h1 className="text-3xl font-bold font-['Space_Grotesk'] mb-4">{t('checkout.success.title')}</h1>
               <p className="text-gray-500 mb-8 leading-relaxed">
                  {t('checkout.success.message')}
               </p>
               <div className="bg-gray-50 p-6 rounded-2xl mb-8 text-left">
                  <p className="text-xs font-bold uppercase text-gray-400 mb-2">{t('checkout.success.orderNumber')}</p>
                  <p className="font-mono text-lg font-bold">#SZ-{Math.floor(Math.random() * 100000)}</p>
               </div>
               <Link to="/">
                  <button className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-900 transition-all">
                     {t('checkout.success.returnHome')}
                  </button>
               </Link>
            </motion.div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-[#FAFAFA] pt-32 pb-20 px-6">
         <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">

            {/* Left Column: Form */}
            <div>
               {/* Steps Indicator */}
               <div className="flex items-center justify-between mb-12">
                  {steps.map((step, idx) => (
                     <div key={step.id} className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${currentStep >= step.id ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'
                           }`}>
                           {currentStep > step.id ? <Check size={14} /> : step.id}
                        </div>
                        <span className={`text-sm font-medium ${currentStep >= step.id ? 'text-black' : 'text-gray-400'}`}>
                           {t(step.title)}
                        </span>
                        {idx < steps.length - 1 && (
                           <div className="w-8 h-[1px] bg-gray-200 mx-2 hidden md:block" />
                        )}
                     </div>
                  ))}
               </div>

               <AnimatePresence mode="wait">
                  <motion.div
                     key={currentStep}
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                  >
                     {currentStep === 1 && (
                        <div className="space-y-6">
                           <h2 className="text-2xl font-bold font-['Space_Grotesk']">{t('checkout.information.contactTitle')}</h2>
                           <div className="space-y-4">
                              <input type="email" placeholder={t('checkout.information.emailPlaceholder')} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-black transition-colors" />
                           </div>

                           <h2 className="text-2xl font-bold font-['Space_Grotesk'] pt-6">{t('checkout.information.shippingTitle')}</h2>
                           <div className="grid grid-cols-2 gap-4">
                              <input type="text" placeholder={t('checkout.information.firstName')} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-black transition-colors" />
                              <input type="text" placeholder={t('checkout.information.lastName')} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-black transition-colors" />
                              <input type="text" placeholder={t('checkout.information.address')} className="col-span-2 w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-black transition-colors" />
                              <input type="text" placeholder={t('checkout.information.city')} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-black transition-colors" />
                              <input type="text" placeholder={t('checkout.information.postalCode')} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-black transition-colors" />
                           </div>
                        </div>
                     )}

                     {currentStep === 2 && (
                        <div className="space-y-6">
                           <h2 className="text-2xl font-bold font-['Space_Grotesk']">{t('checkout.shipping.title')}</h2>
                           <div className="space-y-4">
                              <label className="flex items-center justify-between p-4 bg-white border border-black rounded-xl cursor-pointer ring-1 ring-black">
                                 <div className="flex items-center gap-4">
                                    <Truck size={24} />
                                    <div>
                                       <p className="font-bold">{t('checkout.shipping.standard')}</p>
                                       <p className="text-sm text-gray-500">{t('checkout.shipping.standardDuration')}</p>
                                    </div>
                                 </div>
                                 <span className="font-bold">{formatPrice(25)}</span>
                              </label>
                              <label className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl opacity-50 cursor-not-allowed">
                                 <div className="flex items-center gap-4">
                                    <div className="w-6 h-6 rounded-full border border-gray-300" />
                                    <div>
                                       <p className="font-bold">{t('checkout.shipping.express')}</p>
                                       <p className="text-sm text-gray-500">{t('checkout.shipping.expressDuration')}</p>
                                    </div>
                                 </div>
                                 <span className="font-bold">{formatPrice(65)}</span>
                              </label>
                           </div>
                        </div>
                     )}

                     {currentStep === 3 && (
                        <div className="space-y-6">
                           <h2 className="text-2xl font-bold font-['Space_Grotesk']">{t('checkout.payment.title')}</h2>
                           <div className="bg-blue-50 p-4 rounded-xl flex items-start gap-3 text-blue-800 text-sm mb-6">
                              <ShieldCheck size={18} className="flex-shrink-0 mt-0.5" />
                              <p>{t('checkout.payment.secureMessage')}</p>
                           </div>

                           <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
                              <div className="flex justify-between items-center mb-4">
                                 <span className="font-bold">{t('checkout.payment.creditCard')}</span>
                                 <div className="flex gap-2">
                                    <div className="w-8 h-5 bg-gray-200 rounded"></div>
                                    <div className="w-8 h-5 bg-gray-200 rounded"></div>
                                 </div>
                              </div>
                              <input type="text" placeholder={t('checkout.payment.creditCard')} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-black transition-colors" />
                              <div className="grid grid-cols-2 gap-4">
                                 <input type="text" placeholder="MM / YY" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-black transition-colors" />
                                 <input type="text" placeholder="CVC" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-black transition-colors" />
                              </div>
                              <input type="text" placeholder={t('checkout.payment.cardHolder')} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-black transition-colors" />
                           </div>
                        </div>
                     )}
                  </motion.div>
               </AnimatePresence>

               <div className="mt-10 flex items-center justify-between">
                  {currentStep > 1 ? (
                     <button onClick={() => setCurrentStep(c => c - 1)} className="flex items-center gap-2 font-bold hover:text-gray-600">
                        <ChevronLeft size={20} /> {t('checkout.buttons.back')}
                     </button>
                  ) : <div />}

                  <button
                     onClick={handleNext}
                     disabled={isProcessing}
                     className="bg-black text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:bg-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     {isProcessing ? t('checkout.buttons.processing') : currentStep === 3 ? `${t('checkout.buttons.pay')} ${formatPrice(total)}` : t('checkout.buttons.continue')}
                  </button>
               </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="bg-white p-8 rounded-3xl h-fit border border-gray-100 shadow-sm">
               <h3 className="font-bold text-xl mb-6">{t('checkout.summary.title')}</h3>
               <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto scrollbar-hide">
                  {cart.map((item) => (
                     <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4">
                        <div className="w-16 h-16 bg-gray-50 rounded-lg p-2 flex items-center justify-center relative">
                           <img src={item.image} alt={item.name} className="w-full h-full object-contain" />

                        </div>
                        <div className="flex-1">
                           <p className="font-bold text-sm">{item.name}</p>
                           <p className="text-xs text-gray-500">{item.brand} / {t('checkout.summary.size')} {item.selectedSize}</p>
                        </div>
                        <span className="font-bold text-sm">{formatPrice(item.price * item.quantity)}</span>
                     </div>
                  ))}
               </div>

               <div className="border-t border-gray-100 pt-6 space-y-3">
                  <div className="flex justify-between text-gray-500 text-sm">
                     <span>{t('checkout.summary.subtotal')}</span>
                     <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500 text-sm">
                     <span>{t('checkout.summary.shipping')}</span>
                     <span>{shipping === 0 ? t('checkout.summary.calculatedNext') : formatPrice(shipping)}</span>
                  </div>
               </div>

               <div className="border-t border-gray-100 pt-6 mt-6 flex justify-between items-end">
                  <span className="font-bold text-lg">{t('checkout.summary.total')}</span>
                  <span className="font-bold text-2xl tracking-tight">{formatPrice(total)}</span>
               </div>
            </div>

         </div>
      </div>
   );
};

export default Checkout;