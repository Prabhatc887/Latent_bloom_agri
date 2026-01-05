
import React, { useState } from 'react';
import { TRANSLATIONS } from './constants';
import { Language } from './types';
import Home from './pages/Home';
import News from './pages/News';
import Marketplace from './pages/Marketplace';
import { 
  Menu, 
  X, 
  Globe, 
  Facebook, 
  Twitter, 
  Instagram,
  Leaf,
  Home as HomeIcon,
  Newspaper,
  ShoppingBag
} from 'lucide-react';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const t = TRANSLATIONS[lang];

  const toggleLang = () => {
    setLang(prev => prev === 'en' ? 'np' : 'en');
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 scroll-smooth">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200 px-4 py-3 md:px-8 flex items-center justify-between">
        <button onClick={() => scrollToSection('hero')} className="flex items-center gap-2 group">
          <div className="bg-emerald-700 p-2 rounded-lg group-hover:bg-emerald-600 transition-colors">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-emerald-900 tracking-tight">Latent_Bloom</span>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => scrollToSection('hero')} className="hover:text-emerald-700 font-medium transition-colors">{t.home}</button>
          <button onClick={() => scrollToSection('news')} className="hover:text-emerald-700 font-medium transition-colors">{t.news}</button>
          <button onClick={() => scrollToSection('marketplace')} className="hover:text-emerald-700 font-medium transition-colors">{t.marketplace}</button>
          <button 
            onClick={toggleLang}
            className="flex items-center gap-2 bg-stone-100 px-3 py-1.5 rounded-full border border-stone-200 hover:bg-stone-200 transition-colors"
          >
            <Globe className="w-4 h-4" />
            <span className="text-sm font-semibold">{t.language}</span>
          </button>
        </div>

        {/* Mobile Menu Btn */}
        <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2">
          <Menu className="w-6 h-6" />
        </button>
      </nav>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-64 bg-white p-6 shadow-xl flex flex-col gap-6">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-emerald-900">{lang === 'np' ? 'मेनु' : 'Menu'}</span>
              <button onClick={() => setIsSidebarOpen(false)}><X className="w-6 h-6" /></button>
            </div>
            <button onClick={() => scrollToSection('hero')} className="flex items-center gap-3 text-lg font-medium p-2 hover:bg-stone-50 rounded-lg text-left">
              <HomeIcon className="w-5 h-5 text-emerald-700" /> {t.home}
            </button>
            <button onClick={() => scrollToSection('news')} className="flex items-center gap-3 text-lg font-medium p-2 hover:bg-stone-50 rounded-lg text-left">
              <Newspaper className="w-5 h-5 text-emerald-700" /> {t.news}
            </button>
            <button onClick={() => scrollToSection('marketplace')} className="flex items-center gap-3 text-lg font-medium p-2 hover:bg-stone-50 rounded-lg text-left">
              <ShoppingBag className="w-5 h-5 text-emerald-700" /> {t.marketplace}
            </button>
            <button 
              onClick={() => { toggleLang(); setIsSidebarOpen(false); }}
              className="flex items-center gap-3 text-lg font-medium p-2 hover:bg-stone-50 rounded-lg w-full text-left"
            >
              <Globe className="w-5 h-5 text-emerald-700" /> {t.language}
            </button>
          </div>
        </div>
      )}

      {/* Main Content Sections */}
      <main className="flex-grow">
        <section id="hero" className="scroll-mt-20">
          <Home lang={lang} />
        </section>
        <section id="news" className="scroll-mt-20 bg-white border-y border-stone-200">
          <News lang={lang} />
        </section>
        <section id="marketplace" className="scroll-mt-20 bg-stone-50">
          <Marketplace lang={lang} />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-emerald-950 text-emerald-50 py-16 px-4 md:px-8 border-t border-emerald-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="w-6 h-6 text-emerald-400" />
              <span className="text-xl font-bold tracking-tight">Latent_Bloom</span>
            </div>
            <p className="text-emerald-200/80 leading-relaxed max-w-sm mb-6">
              {t.footerTagline}
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-emerald-900 rounded-full hover:bg-emerald-800 transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="p-2 bg-emerald-900 rounded-full hover:bg-emerald-800 transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="p-2 bg-emerald-900 rounded-full hover:bg-emerald-800 transition-colors"><Instagram className="w-5 h-5" /></a>
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-bold mb-2 text-emerald-400">{t.quickLinks}</h3>
            <button onClick={() => scrollToSection('hero')} className="text-left text-emerald-200/80 hover:text-white transition-colors">{t.home}</button>
            <button onClick={() => scrollToSection('news')} className="text-left text-emerald-200/80 hover:text-white transition-colors">{t.news}</button>
            <button onClick={() => scrollToSection('marketplace')} className="text-left text-emerald-200/80 hover:text-white transition-colors">{t.marketplace}</button>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-emerald-400">{t.connectWithUs}</h3>
            <p className="text-sm text-emerald-200/60 mb-2 font-bold">{t.contactInfo}</p>
            <p className="text-sm text-emerald-200/60">support@latentbloom.com</p>
            <p className="text-sm text-emerald-200/60">+977-1-4XXXXXX</p>
            <p className="text-sm text-emerald-200/60 mt-4">Kathmandu, Nepal</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-emerald-900/50 text-center text-sm text-emerald-200/40">
          © {new Date().getFullYear()} Latent_Bloom AI. {t.allRightsReserved}
        </div>
      </footer>
    </div>
  );
};

export default App;
