import React, { useState, useRef } from 'react';
import { TRANSLATIONS } from '../constants';
import { Language } from '../types';
import { Upload, Play, Loader2, CheckCircle, Info, Sparkles } from 'lucide-react';

interface HomeProps {
  lang: Language;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
console.log("Backend URL:", BACKEND_URL);


const Home: React.FC<HomeProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setVideoUrl(null);
      };
      reader.readAsDataURL(file);
    }
  };

const handleGenerate = async () => {
  if (!selectedFile) return;

  setIsGenerating(true);
  setVideoUrl(null);
  setProgressMsg("Uploading image...");
  console.log("Selected file:", selectedFile);

  try {
    if (!BACKEND_URL) {
      throw new Error("Backend URL not set in .env");
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    setProgressMsg("Generating plant growth video (this may take several minutes)...");
    console.log("Sending request to backend...");

    const response = await fetch(`${BACKEND_URL}/generate_video/`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error("Backend error: " + text);
    }

    const data = await response.json();

    const videoPath = data.final_video;

    setVideoUrl(`${BACKEND_URL}/${videoPath.replace(/\\/g, "/")}`);

    setProgressMsg("Done!");
  } catch (error: any) {
    console.error(error);
    alert(error.message || "Failed to generate video");
  } finally {
    setIsGenerating(false);
  }
};


  return (
    <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        
        {/* Left Side */}
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
            <Feature icon={<CheckCircle />} title={t.feature1Title} desc={t.feature1Desc} />
            <Feature icon={<Play />} title={t.feature2Title} desc={t.feature2Desc} />
            <Feature icon={<Info />} title={t.feature3Title} desc={t.feature3Desc} />
          </div>
        </div>

        {/* Right Side */}
        <div className="order-1 lg:order-2 animate-in slide-in-from-right duration-700">
          <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-2xl border border-emerald-100 relative overflow-hidden">

            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
                selectedImage ? 'border-emerald-500 bg-emerald-50/30' : 'border-stone-300 hover:border-emerald-400'
              }`}
            >
              {selectedImage ? (
                <img src={selectedImage} className="rounded-2xl w-full" />
              ) : (
                <div className="py-12">
                  <Upload className="w-10 h-10 mx-auto mb-4" />
                  <p>{t.selectImage}</p>
                </div>
              )}
            </div>

            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*"/>

            <button
              disabled={!selectedImage || isGenerating}
              onClick={handleGenerate}
              className="w-full mt-8 py-5 rounded-2xl font-bold text-lg bg-emerald-700 text-white"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="inline animate-spin mr-2" />
                  {progressMsg || "Processing..."}
                </>
              ) : (
                <>
                  <Play className="inline mr-2" />
                  {t.generateBtn}
                </>
              )}
            </button>

            {videoUrl && (
              <div className="mt-8">
                <h3 className="font-bold text-emerald-900 mb-4">Generated Video:</h3>
                <video src={videoUrl} controls autoPlay className="w-full rounded-xl" />
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

const Feature = ({ icon, title, desc }: any) => (
  <div className="flex items-start gap-4">
    <div className="bg-emerald-100 p-2 rounded-lg text-emerald-700">{icon}</div>
    <div>
      <h4 className="font-bold">{title}</h4>
      <p className="text-stone-500">{desc}</p>
    </div>
  </div>
);

export default Home;
