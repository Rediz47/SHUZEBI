import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { PRODUCTS, BRANDS } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, ChevronDown, Check, X, Filter } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { useTranslation } from 'react-i18next';

const CATEGORIES = ["All", "Basketball", "Lifestyle", "Running"];

const COLORS = Array.from(new Set(PRODUCTS.flatMap(p => p.colors))).sort();
const SIZES = Array.from(new Set(PRODUCTS.flatMap(p => p.sizes))).sort((a, b) => a - b);
const MAX_PRICE = 2000;

interface ShopProps {
  wishlistIds: number[];
  toggleWishlist: (id: number) => void;
}

const Shop: React.FC<ShopProps> = ({ wishlistIds, toggleWishlist }) => {
  const { t } = useTranslation();
  const { formatPrice, exchangeRate } = useCurrency();
  const [searchParams, setSearchParams] = useSearchParams();

  const SORT_OPTIONS = [
    { label: t('shop.sort.newest'), value: "newest" },
    { label: t('shop.sort.price_asc'), value: "price_asc" },
    { label: t('shop.sort.price_desc'), value: "price_desc" },
  ];

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, MAX_PRICE * exchangeRate]);
  const [sortBy, setSortBy] = useState<string>("newest");

  // Input local state to allow free typing (String or Number)
  const [minInput, setMinInput] = useState<string | number>(0);
  const [maxInput, setMaxInput] = useState<string | number>(Math.round(MAX_PRICE * exchangeRate));

  // Mobile Filter Drawer State
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Handle Currency Changes - Scale the price filter
  const lastExchangeRate = React.useRef(exchangeRate);
  useEffect(() => {
    if (exchangeRate !== lastExchangeRate.current) {
      const ratio = exchangeRate / lastExchangeRate.current;
      setPriceRange(prev => [prev[0] * ratio, prev[1] * ratio]);
      setMinInput(prev => typeof prev === 'number' ? Math.round(prev * ratio) : prev);
      setMaxInput(prev => typeof prev === 'number' ? Math.round(prev * ratio) : prev);
      lastExchangeRate.current = exchangeRate;
    }
  }, [exchangeRate]);

  // Initialize from URL
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam && CATEGORIES.includes(categoryParam)) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  // Handle Toggles
  const toggleBrand = (brandName: string) => {
    setSelectedBrands(prev =>
      prev.includes(brandName) ? prev.filter(b => b !== brandName) : [...prev, brandName]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const toggleSize = (size: number) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  // Price Input Handlers
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Allow digits only or empty string
    if (val === '' || /^\d+$/.test(val)) {
      setMinInput(val);
      const numMin = val === '' ? 0 : Number(val);
      const numMax = maxInput === '' ? 0 : Number(maxInput);
      setPriceRange([numMin, numMax]);
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '' || /^\d+$/.test(val)) {
      setMaxInput(val);
      const numMin = minInput === '' ? 0 : Number(minInput);
      const numMax = val === '' ? 0 : Number(val);
      setPriceRange([numMin, numMax]);
    }
  };

  const handleResetFilters = () => {
    const currentMax = MAX_PRICE * exchangeRate;
    setSelectedCategory("All");
    setSelectedBrands([]);
    setSelectedColors([]);
    setSelectedSizes([]);
    setPriceRange([0, currentMax]);
    setMinInput(0);
    setMaxInput(Math.round(currentMax));
  };

  // Filter Logic
  const filteredProducts = PRODUCTS.filter(product => {
    const matchCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
    const convertedPrice = product.price * exchangeRate;
    const matchPrice = convertedPrice >= priceRange[0] && convertedPrice <= priceRange[1];
    const matchColor = selectedColors.length === 0 || product.colors.some(c => selectedColors.includes(c));
    const matchSize = selectedSizes.length === 0 || product.sizes.some(s => selectedSizes.includes(s));

    return matchCategory && matchBrand && matchPrice && matchColor && matchSize;
  }).sort((a, b) => {
    if (sortBy === "price_asc") return a.price - b.price;
    if (sortBy === "price_desc") return b.price - a.price;
    return b.id - a.id; // Default newest (by ID)
  });

  // Reusable Filter Content as a render function to avoid focus loss on re-render
  const renderFilters = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { getSymbol } = useCurrency();
    return (
      <div className="space-y-10">

        {/* Categories */}
        <div>
          <h3 className="font-bold text-sm uppercase tracking-widest text-gray-500 mb-4">{t('shop.categoryTitle')}</h3>
          <div className="space-y-1">
            {CATEGORIES.map(cat => (
              <motion.button
                key={cat}
                whileHover={{ x: 4 }}
                onClick={() => {
                  setSelectedCategory(cat);
                  setSearchParams(cat === "All" ? {} : { category: cat });
                }}
                className={`block w-full text-left px-4 py-3 rounded-xl transition-all font-medium text-sm ${selectedCategory === cat
                  ? 'bg-black text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                {t(`categories.${cat.toLowerCase()}`)}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="h-[1px] bg-gray-100 w-full" />

        {/* Price Range - Manual Only */}
        <div>
          <h3 className="font-bold text-sm uppercase tracking-widest text-gray-500 mb-6">{t('shop.priceRangeTitle')}</h3>
          <div className="px-2">
            <div className="flex justify-between items-center gap-4">
              <div className="flex-1 bg-gray-50 rounded-xl px-3 py-2 border border-transparent focus-within:border-black transition-colors">
                <span className="text-xs text-gray-400 block mb-1">Min</span>
                <div className="flex items-center">
                  <span className="text-sm font-bold mr-1">{getSymbol()}</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={minInput}
                    onChange={handleMinChange}
                    className="w-full bg-transparent font-bold focus:outline-none appearance-none"
                  />
                </div>
              </div>
              <div className="text-gray-300">-</div>
              <div className="flex-1 bg-gray-50 rounded-xl px-3 py-2 border border-transparent focus-within:border-black transition-colors">
                <span className="text-xs text-gray-400 block mb-1">Max</span>
                <div className="flex items-center">
                  <span className="text-sm font-bold mr-1">{getSymbol()}</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={maxInput}
                    onChange={handleMaxChange}
                    className="w-full bg-transparent font-bold focus:outline-none appearance-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-[1px] bg-gray-100 w-full" />

        {/* Brands */}
        <div>
          <h3 className="font-bold text-sm uppercase tracking-widest text-gray-500 mb-4">{t('shop.brandsTitle')}</h3>
          <div className="space-y-3">
            {BRANDS.map(brand => (
              <motion.label
                key={brand.name}
                className="flex items-center gap-3 cursor-pointer group p-1"
                whileHover={{ x: 2 }}
              >
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${selectedBrands.includes(brand.name) ? 'bg-black border-black' : 'border-gray-300 group-hover:border-black'
                  }`}>
                  {selectedBrands.includes(brand.name) && <Check size={12} className="text-white" />}
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={selectedBrands.includes(brand.name)}
                  onChange={() => toggleBrand(brand.name)}
                />
                <span className={`text-sm transition-colors ${selectedBrands.includes(brand.name) ? 'font-bold text-black' : 'text-gray-600'}`}>
                  {brand.name}
                </span>
              </motion.label>
            ))}
          </div>
        </div>

        <div className="h-[1px] bg-gray-100 w-full" />

        {/* Colors */}
        <div>
          <h3 className="font-bold text-sm uppercase tracking-widest text-gray-500 mb-4">{t('shop.colorTitle')}</h3>
          <div className="flex flex-wrap gap-3">
            {COLORS.map(color => (
              <button
                key={color}
                onClick={() => toggleColor(color)}
                className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all shadow-sm ${selectedColors.includes(color) ? 'ring-2 ring-offset-2 ring-black scale-110' : 'hover:scale-110 border-gray-200'
                  }`}
                style={{ backgroundColor: color.toLowerCase() === 'white' ? '#fff' : color.toLowerCase() }}
                title={color}
              >
                {color.toLowerCase() === 'white' && <span className="sr-only">White</span>}
                {selectedColors.includes(color) && (
                  <Check size={14} className={color.toLowerCase() === 'white' ? 'text-black' : 'text-white'} />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="h-[1px] bg-gray-100 w-full" />

        {/* Sizes */}
        <div>
          <h3 className="font-bold text-sm uppercase tracking-widest text-gray-500 mb-4">{t('shop.sizeTitle')}</h3>
          <div className="grid grid-cols-4 gap-2">
            {SIZES.map(size => (
              <button
                key={size}
                onClick={() => toggleSize(size)}
                className={`py-2 text-sm rounded-lg border transition-all ${selectedSizes.includes(size)
                  ? 'bg-black text-white border-black font-bold'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-black'
                  }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 max-w-7xl mx-auto">

      {/* Header & Mobile Sort/Filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-bold font-['Space_Grotesk'] mb-2">{t('shop.title')}</h1>
          <p className="text-gray-500 text-sm">{filteredProducts.length} {t('shop.results')}</p>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="md:hidden flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-full font-bold text-sm hover:bg-gray-50"
          >
            <Filter size={16} /> {t('shop.filters')}
          </button>

          <div className="relative flex-1 md:w-64">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-200 px-4 py-3 pr-10 rounded-full text-sm font-medium focus:outline-none focus:border-black cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
            >
              {SORT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
          </div>
        </div>
      </div>

      <div className="flex gap-12">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-64 flex-shrink-0 sticky top-32 h-fit pr-4 overflow-y-auto max-h-[calc(100vh-8rem)] scrollbar-hide">
          {renderFilters()}
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div
                  layout
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard
                    product={product}
                    isWishlisted={wishlistIds.includes(product.id)}
                    onToggleWishlist={() => toggleWishlist(product.id)}
                    isShopPage={true}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-32 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <SlidersHorizontal className="text-gray-400" />
              </div>
              <p className="text-gray-900 text-xl font-bold font-['Space_Grotesk'] mb-2">{t('shop.noProducts')}</p>
              <p className="text-gray-500 text-sm">{t('shop.noProductsDesc')}</p>
              <button
                onClick={handleResetFilters}
                className="mt-6 px-6 py-2 bg-black text-white rounded-full font-bold text-sm hover:bg-gray-800 transition-colors"
              >
                {t('shop.clearFilters')}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-black/50 z-[60] md:hidden backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[2rem] z-[70] p-6 max-h-[85vh] overflow-y-auto md:hidden"
            >
              <div className="sticky top-0 bg-white pb-4 z-10 flex justify-between items-center border-b border-gray-100 mb-6">
                <h2 className="text-xl font-bold font-['Space_Grotesk']">{t('shop.filters')}</h2>
                <button onClick={() => setIsFilterOpen(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                  <X size={20} />
                </button>
              </div>
              {renderFilters()}
              <div className="sticky bottom-0 bg-white pt-6 border-t border-gray-100 mt-8">
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="w-full bg-black text-white py-4 rounded-full font-bold hover:shadow-lg transition-all active:scale-[0.98]"
                >
                  {t('shop.showResults')} ({filteredProducts.length})
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Shop;