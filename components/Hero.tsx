import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants, useMotionValue, useTransform } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HERO_SLIDES } from '../constants';
import Magnetic from './Magnetic';
import { useCurrency } from '../context/CurrencyContext';

import { useTranslation } from 'react-i18next';

const Hero: React.FC = () => {
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Mouse Parallax Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-window.innerHeight / 2, window.innerHeight / 2], [5, -5]);
  const rotateY = useTransform(x, [-window.innerWidth / 2, window.innerWidth / 2], [-5, 5]);

  const handleMouseMove = (e: React.MouseEvent) => {
    x.set(e.clientX - window.innerWidth / 2);
    y.set(e.clientY - window.innerHeight / 2);
  };

  // Preload images
  useEffect(() => {
    HERO_SLIDES.forEach((slide) => {
      const img = new Image();
      img.src = slide.image;
    });
  }, []);

  // Auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  };

  const imageVariants: Variants = {
    enter: (direction: number) => ({
      // If direction is 0 (initial load), stay centered horizontally, otherwise slide
      x: direction === 0 ? 0 : direction > 0 ? 500 : -500,
      // If direction is 0, slide up from bottom slightly
      y: direction === 0 ? 100 : 0,
      opacity: 0,
      // Start smaller if loading, larger if sliding
      scale: direction === 0 ? 0.8 : 1.5,
      rotate: 8,
    }),
    center: {
      zIndex: 1,
      x: 0,
      y: 0,
      opacity: 1,
      scale: 1,
      rotate: 8,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] // Custom bouncy bezier
      }
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 500 : -500,
      opacity: 0,
      scale: 0.8,
      rotate: 8,
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    })
  };

  return (
    <div
      className="relative h-screen min-h-[700px] w-full bg-[#FAFAFA] overflow-hidden flex items-center justify-center"
      onMouseMove={handleMouseMove}
    >
      {/* Massive Background Typography */}
      <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 overflow-hidden pointer-events-none z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 0.04 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 1 }}
            className="text-center"
          >
            <h1 className="text-[25vw] font-bold text-black font-['Space_Grotesk'] leading-[0.8] tracking-tighter whitespace-nowrap">
              {HERO_SLIDES[currentIndex].bgText}
            </h1>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="max-w-[1400px] w-full mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 items-center relative z-10 h-full">

        {/* Left Content - Typography */}
        <div className="md:col-span-5 flex flex-col items-start justify-center h-full pt-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8"
            >
              <div className="flex items-center gap-4">
                <div className="h-[1px] w-12 bg-black"></div>
                <span className="text-xs font-bold tracking-[0.3em] uppercase">Season 04 / Drop {currentIndex + 1}</span>
              </div>

              <div className="overflow-hidden">
                <motion.h2
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="text-6xl md:text-8xl lg:text-9xl font-bold font-['Space_Grotesk'] leading-[0.9] tracking-tight text-black mix-blend-multiply"
                >
                  {HERO_SLIDES[currentIndex].name.split(" ")[0]}<br />
                  <span className="text-gray-400">{HERO_SLIDES[currentIndex].name.split(" ").slice(1).join(" ")}</span>
                </motion.h2>
              </div>

              <div className="flex items-center gap-8 pt-6">
                <Link to={`/product/${HERO_SLIDES[currentIndex].id}`}>
                  <Magnetic>
                    <button className="bg-black text-white px-10 py-5 rounded-full flex items-center gap-3 font-bold hover:bg-gray-900 transition-all shadow-2xl">
                      {t('hero.explore')} <ArrowRight size={20} />
                    </button>
                  </Magnetic>
                </Link>
                <span className="text-2xl font-medium font-['Space_Grotesk']">{formatPrice(HERO_SLIDES[currentIndex].price)}</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Content - 3D Floating Shoe */}
        <div className="md:col-span-7 relative h-full flex items-center justify-center perspective-[1200px]">
          <motion.div
            style={{
              rotateX,
              rotateY,
              filter: "drop-shadow(0px 60px 80px rgba(0,0,0,0.25))"
            }}
            className="relative z-10 w-full h-[60vh] flex items-center justify-center"
          >
            <AnimatePresence custom={direction} mode="popLayout">
              <motion.img
                key={currentIndex}
                custom={direction}
                variants={imageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                src={HERO_SLIDES[currentIndex].image}
                alt={HERO_SLIDES[currentIndex].name}
                className="absolute w-[90%] md:w-[105%] h-auto object-contain max-w-none select-none"
                draggable={false}
              />
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="absolute bottom-12 w-full max-w-[1400px] px-6 flex justify-between items-end z-20 pointer-events-none">
        <div className="flex gap-4 pointer-events-auto">
          {HERO_SLIDES.map((slide, idx) => (
            <div
              key={slide.id}
              onClick={() => {
                setDirection(idx > currentIndex ? 1 : -1);
                setCurrentIndex(idx);
              }}
              className={`h-1 cursor-pointer transition-all duration-500 rounded-full ${idx === currentIndex ? 'w-12 bg-black' : 'w-4 bg-gray-300 hover:bg-gray-400'}`}
            />
          ))}
        </div>

        <div className="flex gap-4 pointer-events-auto">
          <Magnetic>
            <button
              onClick={prevSlide}
              className="w-16 h-16 rounded-full border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white transition-all bg-white shadow-lg"
            >
              <ArrowLeft size={24} />
            </button>
          </Magnetic>
          <Magnetic>
            <button
              onClick={nextSlide}
              className="w-16 h-16 rounded-full border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white transition-all bg-white shadow-lg"
            >
              <ArrowRight size={24} />
            </button>
          </Magnetic>
        </div>
      </div>
    </div>
  );
};

export default Hero;