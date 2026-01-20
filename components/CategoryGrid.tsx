import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const categories = [
  {
    id: 1,
    name: "Basketball",
    image: "",
    bg: "bg-zinc-100"
  },
  {
    id: 2,
    name: "Lifestyle",
    image: "",
    bg: "bg-stone-100"
  },
  {
    id: 3,
    name: "Running",
    image: "images/newbalance530.png",
    bg: "bg-slate-100"
  }
];

const CategoryGrid: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="mb-12">
        <h2 className="text-3xl md:text-4xl font-bold font-['Space_Grotesk']">{t('homePage.curatedCollections')}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <Link to="/shop" key={cat.id} className="block group">
            <div
              className={`relative h-[400px] rounded-3xl overflow-hidden ${cat.bg} flex items-center justify-center`}
            >
              {/* Abstract Background Shape */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/5" />

              {cat.image && (
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-3/4 drop-shadow-xl z-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[12deg] group-hover:translate-y-2 select-none"
                  draggable={false}
                />
              )}

              <div className="absolute bottom-8 left-8 z-20">
                <h3 className="text-2xl font-bold mb-2 group-hover:translate-x-2 transition-transform duration-300 font-['Space_Grotesk']">{t(`categories.${cat.name.toLowerCase()}`)}</h3>
                <span className="flex items-center gap-2 text-sm font-bold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  {t('homePage.shopNow')} <ArrowUpRight size={16} />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;