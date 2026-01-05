
import React, { useState, useRef } from 'react';
import { TRANSLATIONS } from '../constants';
import { Language } from '../types';
import { Upload, Play, Loader2, CheckCircle, Info, Sparkles } from 'lucide-react';
import { GeminiService } from '../services/geminiService';

interface HomeProps {
  lang: Language;
}

const Home: React.FC<HomeProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [hasAiKey, setHasAiKey] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const checkKey = async () => {
      const has = await GeminiService.hasKey();
      setHasAiKey(has);
    };
    checkKey();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setVideoUrl(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage) return;
    
    if (!hasAiKey) {
      await GeminiService.requestKey();
      setHasAiKey(true);
      return;
    }

    setIsGenerating(true);
    setVideoUrl(null);
    try {
      const result = await GeminiService.generateGrowthVideo(selectedImage, (msg) => {
        setProgressMsg(msg);
      });
      setVideoUrl(result.videoUrl);
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Failed to generate video. Ensure you have a valid API key.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 md:py-28">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        {/* Left Side: Content */}
        <div className="order-2 lg:order-1 animate-in slide-in-from-left duration-700">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-1.5 rounded-full text-sm font-bold mb-6">
            <Sparkles className="w-4 h-4" />
            <span>AI Agriculture Assistant</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-emerald-950 mb-4 leading-tight">
            {t.heroHeadline}
          </h1>
          <p className="text-lg md:text-xl text-stone-600 mb-6 leading-relaxed max-w-xl font-medium">
            {t.heroBody1}
          </p>
          <p className="text-base text-stone-500 mb-10 leading-relaxed max-w-xl italic">
            {t.heroBody2}
          </p>

          <div className="space-y-6 bg-white/50 p-6 rounded-3xl border border-stone-100">
            <div className="flex items-start gap-4">
              <div className="bg-emerald-100 p-2 rounded-lg text-emerald-700">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-stone-900">{t.feature1Title}</h4>
                <p className="text-stone-500">{t.feature1Desc}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-emerald-100 p-2 rounded-lg text-emerald-700">
                <Play className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-stone-900">{t.feature2Title}</h4>
                <p className="text-stone-500">{t.feature2Desc}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-emerald-100 p-2 rounded-lg text-emerald-700">
                <Info className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-stone-900">{t.feature3Title}</h4>
                <p className="text-stone-500">{t.feature3Desc}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Upload Card */}
        <div className="order-1 lg:order-2 animate-in slide-in-from-right duration-700">
          <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-2xl border border-emerald-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 z-0" />
            
            <div className="relative z-10">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
                  selectedImage ? 'border-emerald-500 bg-emerald-50/30' : 'border-stone-300 hover:border-emerald-400 hover:bg-stone-50'
                }`}
              >
                {selectedImage ? (
                  <div className="relative aspect-video rounded-2xl overflow-hidden border border-emerald-200">
                    <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <span className="text-white font-bold">{lang === 'np' ? 'फोटो परिवर्तन गर्नुहोस्' : 'Change Photo'}</span>
                    </div>
                  </div>
                ) : (
                  <div className="py-12">
                    <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-700">
                      <Upload className="w-10 h-10" />
                    </div>
                    <p className="text-stone-600 font-bold text-lg mb-1">{t.selectImage}</p>
                    <p className="text-sm text-stone-400">JPG, PNG (Max 5MB)</p>
                  </div>
                )}
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />

              <button
                disabled={!selectedImage || isGenerating}
                onClick={handleGenerate}
                className={`w-full mt-8 py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                  !selectedImage ? 'bg-stone-200 text-stone-400 cursor-not-allowed' : 
                  'bg-emerald-700 text-white hover:bg-emerald-800 shadow-xl hover:shadow-emerald-200 active:scale-[0.98]'
                }`}
              >
                {!hasAiKey ? (
                  <>
                    <Sparkles className="w-5 h-5" />
                    {t.startAiStudio}
                  </>
                ) : isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{progressMsg || 'Processing...'}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" />
                    {t.generateBtn}
                  </>
                )}
              </button>

              {/* Progress Bar */}
              {isGenerating && (
                <div className="mt-6">
                   <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full animate-[shimmer_2s_infinite] w-[60%]" style={{
                         backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                         backgroundSize: '200px 100%'
                      }} />
                   </div>
                </div>
              )}

              {/* Output Video */}
              {videoUrl && (
                <div className="mt-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
                  <h3 className="font-bold text-emerald-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-6 h-6 text-emerald-500" />
                    {lang === 'np' ? 'जीवनचक्र भिडियो तयार छ' : 'Lifecycle Result Ready'}
                  </h3>
                  <div className="rounded-[2rem] overflow-hidden shadow-2xl border border-emerald-100 aspect-video bg-black">
                    <video 
                      src={videoUrl} 
                      controls 
                      autoPlay
                      className="w-full h-full"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
