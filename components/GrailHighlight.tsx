import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Target, Cpu, Activity } from 'lucide-react';
import { PRODUCTS } from '../constants';
import { useCurrency } from '../context/CurrencyContext';
import { useTranslation } from 'react-i18next';

const GrailHighlight: React.FC = () => {
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();
  const grail = PRODUCTS.find(p => p.name.includes('Mag')) || PRODUCTS[0];
  const sectionRef = useRef<HTMLElement>(null);

  // Mouse Parallax Logic
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 100, damping: 30 };
  const mouseXSpring = useSpring(mouseX, springConfig);
  const mouseYSpring = useSpring(mouseY, springConfig);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Parallax Scroll Hooks
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const yBackground = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const yImage = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const gridRotate = useTransform(scrollYProgress, [0, 1], [20, 45]);

  return (
    <div className="bg-black">
      <section
        ref={sectionRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative text-white pb-32 pt-32 overflow-hidden min-h-screen flex items-center rounded-t-[4rem] md:rounded-t-[6rem]"
      >
        {/* Futuristic Background Container */}
        <div className="absolute inset-0 z-0 bg-[#050505]">
          {/* 3D Perspective Grid */}
          <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none" style={{ perspective: '1000px' }}>
            <motion.div
              style={{ rotateX: 60, scale: 2, y: yBackground }}
              className="absolute inset-0 bg-[linear-gradient(to_right,#1e3a8a_1px,transparent_1px),linear-gradient(to_bottom,#1e3a8a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"
            />
          </div>

          {/* Galaxy / Nebula Layer */}
          <div className="absolute inset-0 opacity-40">
            <img
              src="https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2048&auto=format&fit=crop"
              alt="Galaxy"
              className="w-full h-full object-cover mix-blend-screen"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
          </div>

          {/* Scanning Beam */}
          <motion.div
            animate={{ top: ['-10%', '110%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent blur-md opacity-30 z-10"
          />
        </div>

        {/* HUD Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none opacity-20 z-0">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/4 left-10 w-64 h-64 border border-blue-500/30 rounded-full border-dashed flex items-center justify-center"
          >
            <div className="w-48 h-48 border border-white/10 rounded-full" />
            <div className="absolute top-0 w-2 h-2 bg-blue-500 rounded-full" />
          </motion.div>
          <div className="absolute bottom-1/4 right-10 flex flex-col gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-2">
                <div className="h-1 w-12 bg-blue-500/40 rounded-full" />
                <div className="h-1 w-2 bg-blue-500/20 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">

          {/* Left: Text Content with Chromatic Effect */}
          <div className="order-2 md:order-1 relative">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3 text-blue-400 mb-8 overflow-hidden group">
                <Target size={18} className="animate-pulse" />
                <span className="font-bold tracking-[0.3em] uppercase text-xs">{t('grail.systemAnalysis')}</span>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-blue-500/50 to-transparent" />
              </div>

              <h2 className="text-7xl md:text-9xl font-bold font-['Space_Grotesk'] leading-[0.8] mb-8 tracking-tighter relative">
                <span className="relative z-10">{t('grail.future')}</span><br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-blue-600 animate-gradient-x">
                  {t('grail.ready')}
                </span>
                {/* Visual Ghosting Effect */}
                <span className="absolute top-0 left-0 -translate-x-1 -translate-y-1 text-blue-500/10 z-0 blur-sm">{t('grail.future')}</span>
              </h2>

              <p className="text-gray-400 text-lg md:text-xl mb-12 max-w-md leading-relaxed font-light backdrop-blur-sm p-4 rounded-2xl bg-white/5 border border-white/5">
                {t('grail.descPart1')} <span className="text-blue-400 font-bold">V-AXIS</span> {t('grail.descPart2')}
              </p>

              <div className="flex flex-wrap items-center gap-8">
                <Link to={`/product/${grail.id}`}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative bg-white text-black px-12 py-6 rounded-full font-bold overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <span className="relative flex items-center gap-3 z-10 group-hover:text-white transition-colors">
                      {t('grail.acquire')} <ArrowRight size={20} />
                    </span>
                  </motion.button>
                </Link>

                <div className="flex flex-col border-l border-white/20 pl-8">
                  <span className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">{t('grail.valuation')}</span>
                  <span className="text-3xl font-['Space_Grotesk'] tracking-tight text-white">{formatPrice(grail.price)}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Holographic Shoe Reveal */}
          <div className="order-1 md:order-2 relative h-[500px] md:h-[700px] flex items-center justify-center">

            {/* Holographic Ring */}
            <motion.div
              style={{ rotateX, rotateY }}
              className="absolute w-[400px] h-[400px] md:w-[600px] md:h-[600px] border border-blue-500/20 rounded-full z-0"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-blue-500/5 to-transparent blur-2xl" />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 border border-blue-400/10 rounded-full border-dashed"
              />
            </motion.div>

            <motion.div
              style={{ rotateX, rotateY, y: yImage }}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative z-10 w-full"
            >
              <motion.img
                src="/images/future.png"
                alt="Future Sneaker"
                className="w-full h-auto object-contain drop-shadow-[0_0_50px_rgba(59,130,246,0.3)] filter contrast-125 brightness-110 select-none"
                draggable={false}
                animate={{
                  y: [0, -20, 0],
                  filter: [
                    "drop-shadow(0 0 50px rgba(59,130,246,0.3)) contrast(1.2) brightness(1.1)",
                    "drop-shadow(0 0 70px rgba(59,130,246,0.5)) contrast(1.3) brightness(1.2)",
                    "drop-shadow(0 0 50px rgba(59,130,246,0.3)) contrast(1.2) brightness(1.1)"
                  ]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Data Callouts */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute top-1/4 -right-4 p-4 rounded-xl bg-black/40 backdrop-blur-xl border border-blue-500/30 min-w-[140px] hidden md:block"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Cpu size={14} className="text-blue-400" />
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">{t('grail.neuralCore')}</span>
                </div>
                <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    animate={{ width: ['20%', '90%', '60%'] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="h-full bg-blue-500"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="absolute bottom-1/4 -left-4 p-4 rounded-xl bg-black/40 backdrop-blur-xl border border-purple-500/30 min-w-[140px] hidden md:block"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Activity size={14} className="text-purple-400" />
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">{t('grail.stability')}</span>
                </div>
                <p className="text-sm font-bold text-white uppercase tracking-tighter">{t('grail.optimized')}</p>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* Footer Blend with subtle glow */}
      <div className="relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-blue-500/20 blur-xl" />
        <div className="h-24 bg-white rounded-t-[4rem] md:rounded-t-[6rem]"></div>
      </div>
    </div>
  );
};

export default GrailHighlight;