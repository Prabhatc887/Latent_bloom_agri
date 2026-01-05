
import React, { useState } from 'react';
import { TRANSLATIONS } from '../constants';
import { Language, NewsItem } from '../types';
import { Calendar, MapPin, ArrowRight, Bookmark, X } from 'lucide-react';

interface NewsProps {
  lang: Language;
}

const News: React.FC<NewsProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const [activeCategory, setActiveCategory] = useState(0);
  const [selectedStory, setSelectedStory] = useState<NewsItem | null>(null);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-emerald-950 mb-4">{t.newsTitle}</h1>
        <p className="text-lg text-stone-600 max-w-2xl">{t.newsSubtitle}</p>
      </div>

      {/* Categories */}
      <div className="flex gap-4 mb-12 overflow-x-auto pb-4 scrollbar-hide">
        {t.newsCategories.map((cat, i) => (
          <button 
            key={i} 
            onClick={() => setActiveCategory(i)}
            className={`px-5 py-2 rounded-full whitespace-nowrap font-medium transition-colors ${
              activeCategory === i ? 'bg-emerald-700 text-white' : 'bg-white text-stone-600 border border-stone-200 hover:border-emerald-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* News Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {t.newsItems.map((item) => (
          <article key={item.id} className="group bg-white rounded-3xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl transition-all">
            <div className="relative h-56 overflow-hidden">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur rounded-full text-stone-700 hover:bg-white transition-colors">
                <Bookmark className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-4 bg-emerald-900/80 backdrop-blur text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                {item.location}
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 text-sm text-stone-400 mb-3">
                <Calendar className="w-4 h-4" />
                <span>{item.date}</span>
              </div>
              <h3 className="text-xl font-bold text-emerald-950 mb-3 group-hover:text-emerald-700 transition-colors">
                {item.title}
              </h3>
              <p className="text-stone-600 mb-6 line-clamp-2 leading-relaxed">
                {item.description}
              </p>
              <button 
                onClick={() => setSelectedStory(item)}
                className="flex items-center gap-2 text-emerald-700 font-bold hover:gap-3 transition-all"
              >
                {t.readMore} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Full Story Modal */}
      {selectedStory && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <div 
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-md" 
            onClick={() => setSelectedStory(null)}
          />
          <div className="relative w-full max-w-3xl bg-white rounded-[2rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]">
            <div className="relative h-64 md:h-80 shrink-0">
              <img src={selectedStory.image} alt={selectedStory.title} className="w-full h-full object-cover" />
              <button 
                onClick={() => setSelectedStory(null)}
                className="absolute top-6 right-6 p-2 bg-white/90 backdrop-blur rounded-full shadow-lg hover:bg-white transition-colors"
              >
                <X className="w-6 h-6 text-stone-900" />
              </button>
            </div>
            <div className="p-8 md:p-12 overflow-y-auto">
              <div className="flex items-center gap-4 text-emerald-700 text-sm font-bold mb-4">
                <span className="bg-emerald-100 px-3 py-1 rounded-full">{selectedStory.date}</span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {selectedStory.location}
                </span>
              </div>
              <h2 className="text-3xl font-bold text-emerald-950 mb-6 leading-tight">
                {selectedStory.title}
              </h2>
              <div className="text-lg text-stone-600 leading-relaxed space-y-4">
                {selectedStory.content.split('\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
              <button 
                onClick={() => setSelectedStory(null)}
                className="mt-10 px-8 py-3 bg-stone-900 text-white rounded-xl font-bold hover:bg-stone-800 transition-colors"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Featured Newsletter */}
      <div className="mt-24 bg-emerald-900 rounded-[2.5rem] p-10 md:p-16 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-800 rounded-full -ml-32 -mt-32 opacity-20" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-800 rounded-full -mr-48 -mb-48 opacity-20" />
        
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{t.subscribeTitle}</h2>
          <p className="text-emerald-100/80 mb-8 text-lg">{t.subscribeDesc}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-grow px-6 py-4 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
            <button className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold px-8 py-4 rounded-xl transition-colors">
              {t.subscribeBtn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;
