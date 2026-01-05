
import React, { useState } from 'react';
import { TRANSLATIONS } from '../constants';
import { Language } from '../types';
import { 
  Search, 
  MapPin, 
  Phone, 
  Filter, 
  ChevronDown, 
  Tag, 
  Truck, 
  CheckCircle2,
  Package,
  Cpu
} from 'lucide-react';

interface MarketplaceProps {
  lang: Language;
}

const Marketplace: React.FC<MarketplaceProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const [activeCategory, setActiveCategory] = useState('all');

  const getIcon = (id: string) => {
    switch (id) {
      case 'equipment': return <Truck className="w-4 h-4" />;
      case 'seeds': return <Cpu className="w-4 h-4" />;
      case 'fertilizer': return <Tag className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const handleMapClick = (location: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div>
          <h1 className="text-4xl font-bold text-emerald-950 mb-4">{t.marketTitle}</h1>
          <p className="text-lg text-stone-600 max-w-xl">{t.marketSubtitle}</p>
        </div>
        <div className="w-full md:w-[400px] relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-shadow shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-1 space-y-8">
          <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm">
            <h3 className="font-bold text-emerald-950 mb-4 flex items-center gap-2">
              <Filter className="w-4 h-4" /> Categories
            </h3>
            <div className="space-y-2">
              {t.marketCategories.map((cat) => (
                <button 
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activeCategory === cat.id ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {getIcon(cat.id)}
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
            <h3 className="font-bold text-emerald-900 mb-3">{t.sellTitle}</h3>
            <p className="text-sm text-emerald-700/80 mb-4">{t.sellDesc}</p>
            <button className="w-full bg-emerald-700 text-white font-bold py-3 rounded-xl hover:bg-emerald-800 transition-colors">
              {t.sellBtn}
            </button>
          </div>
        </aside>

        {/* Ad Grid */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {t.adItems.filter(ad => activeCategory === 'all' || ad.category === activeCategory).map((ad) => (
              <div key={ad.id} className="group bg-white rounded-3xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl transition-all">
                <div className="relative h-48">
                  <img src={ad.image} alt={ad.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full font-bold text-emerald-950 shadow-sm">
                    {ad.price}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 mb-2">
                    <CheckCircle2 className="w-3 h-3" />
                    {t.verifiedSeller}
                  </div>
                  <h3 className="font-bold text-emerald-950 mb-4 text-lg group-hover:text-emerald-700">
                    {ad.title}
                  </h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-stone-500">
                      <MapPin className="w-4 h-4 text-stone-400" />
                      {ad.location}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <a 
                      href={`tel:${ad.contact}`}
                      className="flex items-center justify-center gap-2 bg-emerald-700 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-800 transition-colors shadow-sm"
                    >
                      <Phone className="w-4 h-4" /> {t.contactNow}
                    </a>
                    <button 
                      onClick={() => handleMapClick(ad.location)}
                      className="flex items-center justify-center gap-2 bg-stone-100 text-stone-700 py-2.5 rounded-xl text-sm font-bold hover:bg-stone-200 transition-colors"
                    >
                      <MapPin className="w-4 h-4" /> {lang === 'np' ? 'नक्सा' : 'Map'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="mt-12 text-center">
            <button className="px-8 py-3 bg-white border border-stone-200 rounded-full font-bold text-stone-600 hover:border-emerald-300 transition-colors flex items-center gap-2 mx-auto">
              {t.loadMore} <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
