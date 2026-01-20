import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Github } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-white border-t border-gray-100 pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        {/* Brand */}
        <div className="md:col-span-1">
          <Link to="/" className="text-3xl font-bold font-['Space_Grotesk'] tracking-tighter mb-6 block">
            SHUZEBI
          </Link>
          <p className="text-gray-500 mb-6 leading-relaxed">
            {t('footer.description')}
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-black hover:text-white transition-colors">
              <Instagram size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-black hover:text-white transition-colors">
              <Twitter size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-black hover:text-white transition-colors">
              <Facebook size={18} />
            </a>
          </div>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-bold mb-6">{t('footer.shop')}</h4>
          <ul className="space-y-4 text-gray-500 text-sm">
            <li><Link to="/shop" className="hover:text-black transition-colors">{t('footer.allProducts')}</Link></li>
            <li><Link to="/shop?sort=newest" className="hover:text-black transition-colors">{t('footer.newArrivals')}</Link></li>
            <li><Link to="/shop" className="hover:text-black transition-colors">{t('footer.brands')}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6">{t('footer.support')}</h4>
          <ul className="space-y-4 text-gray-500 text-sm">
            <li><Link to="/faq" className="hover:text-black transition-colors">{t('footer.helpCenter')}</Link></li>
            <li><Link to="/faq" className="hover:text-black transition-colors">{t('footer.shippingReturns')}</Link></li>
            <li><Link to="/faq" className="hover:text-black transition-colors">{t('footer.contactUs')}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6">{t('footer.company')}</h4>
          <ul className="space-y-4 text-gray-500 text-sm">

            <li><Link to="/faq" className="hover:text-black transition-colors">{t('footer.privacyPolicy')}</Link></li>
            <li><Link to="/faq" className="hover:text-black transition-colors">{t('footer.termsOfService')}</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
        <p>© 2024 SHUZEBI. {t('footer.rightsReserved')}</p>
        <div className="flex gap-8 mt-4 md:mt-0">
          <Link to="/faq" className="hover:text-black transition-colors">{t('footer.privacyPolicy')}</Link>
          <Link to="/faq" className="hover:text-black transition-colors">{t('footer.cookiePolicy')}</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;