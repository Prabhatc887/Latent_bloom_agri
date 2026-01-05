
export type Language = 'en' | 'np';

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  content: string;
  image: string;
  date: string;
  location: string;
}

export interface AdItem {
  id: string;
  title: string;
  price: string;
  category: 'tractor' | 'fertilizer' | 'seeds' | 'equipment';
  location: string;
  contact: string;
  image: string;
}

export interface TranslationStrings {
  home: string;
  news: string;
  marketplace: string;
  uploadTitle: string;
  uploadDesc: string;
  heroHeadline: string;
  heroBody1: string;
  heroBody2: string;
  generateBtn: string;
  analyzing: string;
  generatingVideo: string;
  finalizingAudio: string;
  newsTitle: string;
  newsSubtitle: string;
  marketTitle: string;
  marketSubtitle: string;
  contactNow: string;
  viewLocation: string;
  language: string;
  footerTagline: string;
  selectImage: string;
  startAiStudio: string;
  feature1Title: string;
  feature1Desc: string;
  feature2Title: string;
  feature2Desc: string;
  feature3Title: string;
  feature3Desc: string;
  quickLinks: string;
  connectWithUs: string;
  contactInfo: string;
  allRightsReserved: string;
  newsCategories: string[];
  newsItems: NewsItem[];
  marketCategories: { id: string; label: string }[];
  adItems: AdItem[];
  readMore: string;
  close: string;
  subscribeTitle: string;
  subscribeDesc: string;
  subscribeBtn: string;
  verifiedSeller: string;
  loadMore: string;
  sellTitle: string;
  sellDesc: string;
  sellBtn: string;
}
