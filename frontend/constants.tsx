
import { TranslationStrings } from './types';

export const TRANSLATIONS: Record<'en' | 'np', TranslationStrings> = {
  en: {
    home: 'Home',
    news: 'News',
    marketplace: 'Marketplace',
    uploadTitle: 'Crop Growth Visualizer',
    uploadDesc: 'Upload a photo of your crop to see its complete lifecycle and get expert growth advice.',
    heroHeadline: 'From Hidden Space to Real Harvest',
    heroBody1: 'From a single input crop image, the system generates a smooth lifecycle transition video with stage-wise images and synchronized audio descriptions at each growth stage.',
    heroBody2: 'Unlocking the full potential of agriculture through intelligent, visual, and accessible AI solutions for a sustainable future.',
    generateBtn: 'Generate AI Growth Video',
    analyzing: 'Analyzing your crop species...',
    generatingVideo: 'Generating growth lifecycle video...',
    finalizingAudio: 'Adding AI narration...',
    newsTitle: 'Farming News & Stories',
    newsSubtitle: 'Stay updated with success stories from Nepal and global innovations.',
    marketTitle: 'Agricultural Marketplace',
    marketSubtitle: 'Connect with sellers for top-quality seeds, fertilizers, and equipment.',
    contactNow: 'Contact Seller',
    viewLocation: 'View Location',
    language: 'नेपाली',
    footerTagline: 'Empowering farmers with the power of Latent_Bloom AI.',
    selectImage: 'Click to select or drag crop photo',
    startAiStudio: 'Connect AI Studio to Start',
    feature1Title: 'Crop Analysis',
    feature1Desc: 'Instant identification of plant species and health.',
    feature2Title: 'Visual Growth Journey',
    feature2Desc: 'See a time-lapse of your crop from seed to harvest.',
    feature3Title: 'Smart Guidance',
    feature3Desc: 'Voice-narrated tips for every growth stage.',
    quickLinks: 'Quick Links',
    connectWithUs: 'Connect With Us',
    contactInfo: 'Contact Info',
    allRightsReserved: 'All rights reserved.',
    readMore: 'Read Full Story',
    close: 'Close',
    subscribeTitle: 'Want Weekly Farming Tips?',
    subscribeDesc: 'Join 10,000+ farmers receiving our expert AI-powered newsletters every Monday.',
    subscribeBtn: 'Subscribe Now',
    verifiedSeller: 'Verified Seller',
    loadMore: 'Load More',
    sellTitle: 'Sell your items',
    sellDesc: 'Are you a merchant? List your farming products on Latent_Bloom.',
    sellBtn: 'List Item Now',
    newsCategories: ['All', 'Nepal Success Stories', 'Global Innovations', 'Technical Tips', 'Market Trends'],
    marketCategories: [
      { id: 'all', label: 'All Products' },
      { id: 'equipment', label: 'Tractors & Tools' },
      { id: 'seeds', label: 'Quality Seeds' },
      { id: 'fertilizer', label: 'Fertilizers' }
    ],
    newsItems: [
      {
        id: '1',
        title: 'Modern Coffee Farming in Gulmi',
        description: 'Local farmers in Gulmi are adopting drip irrigation, increasing yield by 40%.',
        content: 'Coffee farming in Gulmi has taken a major leap forward. By moving away from traditional rain-fed methods to precision drip irrigation, farmers have not only saved water but also significantly increased the quality of the beans.',
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800&auto=format&fit=crop',
        date: 'Oct 12, 2023',
        location: 'Gulmi, Nepal'
      },
      {
        id: '2',
        title: 'Global Vertical Farming Trends',
        description: 'How indoor vertical farms are revolutionizing vegetable production in urban areas.',
        content: 'Vertical farming is no longer science fiction. Multi-story warehouses are being converted into lush vegetable gardens using hydroponics and LED lighting.',
        image: 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?q=80&w=800&auto=format&fit=crop',
        date: 'Oct 10, 2023',
        location: 'Global'
      },
      {
        id: '3',
        title: 'Rice Harvest Hits Record in Terai',
        description: 'Favorable monsoon and quality seeds lead to a bumper harvest this year.',
        content: 'The Terai region recorded its highest rice production in a decade thanks to timely monsoons and high-yield seeds.',
        image: 'https://images.unsplash.com/photo-1536633100371-3323067f9b0f?q=80&w=800&auto=format&fit=crop',
        date: 'Oct 05, 2023',
        location: 'Terai Region'
      }
    ],
    adItems: [
      {
        id: '1',
        title: 'Mini Power Tiller 7HP',
        price: 'Rs. 45,000',
        category: 'equipment',
        location: 'Chitwan, Nepal',
        contact: '+9779800000000',
        image: 'https://images.unsplash.com/photo-1594488311394-49a0ee16ecd2?q=80&w=600&auto=format&fit=crop'
      },
      {
        id: '2',
        title: 'Organic Fertilizer (25kg)',
        price: 'Rs. 1,200',
        category: 'fertilizer',
        location: 'Kathmandu, Nepal',
        contact: '+9779811111111',
        image: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?q=80&w=600&auto=format&fit=crop'
      },
      {
        id: '3',
        title: 'Hybrid Corn Seeds (High Yield)',
        price: 'Rs. 800/kg',
        category: 'seeds',
        location: 'Pokhara, Nepal',
        contact: '+9779822222222',
        image: 'https://images.unsplash.com/photo-1551009175-15bdf9dcb580?q=80&w=600&auto=format&fit=crop'
      }
    ]
  },
  np: {
    home: 'होम',
    news: 'समाचार',
    marketplace: 'बजार',
    uploadTitle: 'बाली विकास भिजुअलाइजर',
    uploadDesc: 'तपाईंको बालीको फोटो अपलोड गर्नुहोस् र यसको पूर्ण जीवनचक्र र विशेषज्ञ सल्लाह पाउनुहोस्।',
    heroHeadline: 'लुकेको ठाउँबाट वास्तविक फसलसम्म',
    heroBody1: 'एउटै बालीको फोटोबाट, प्रणालीले प्रत्येक वृद्धि चरणमा तस्बिरहरू र सिङ्क्रोनाइज गरिएको अडियो विवरणहरू सहितको सहज जीवनचक्र भिडियो तयार गर्दछ।',
    heroBody2: 'दिगो भविष्यका लागि बौद्धिक, दृश्य र सुलभ AI समाधानहरू मार्फत कृषिको पूर्ण सम्भावनालाई उजागर गर्दै।',
    generateBtn: 'AI विकास भिडियो बनाउनुहोस्',
    analyzing: 'तपाईंको बालीको प्रकार विश्लेषण गर्दै...',
    generatingVideo: 'विकास जीवनचक्र भिडियो तयार गर्दै...',
    finalizingAudio: 'AI वर्णन थप्दै...',
    newsTitle: 'कृषि समाचार र कथाहरू',
    newsSubtitle: 'नेपालका सफल कथाहरू र विश्वव्यापी आविष्कारहरूसँग अपडेट रहनुहोस्।',
    marketTitle: 'कृषि बजार',
    marketSubtitle: 'उच्च गुणस्तरका बीउ, मल र उपकरणहरूको लागि बिक्रेताहरूसँग जोडिनुहोस्।',
    contactNow: 'सम्पर्क गर्नुहोस्',
    viewLocation: 'स्थान हेर्नुहोस्',
    language: 'English',
    footerTagline: 'Latent_Bloom AI को शक्तिले किसानहरूलाई सशक्त बनाउँदै।',
    selectImage: 'फोटो चयन गर्न क्लिक गर्नुहोस् वा तान्नुहोस्',
    startAiStudio: 'सुरु गर्न AI स्टुडियो जडान गर्नुहोस्',
    feature1Title: 'बाली विश्लेषण',
    feature1Desc: 'बिरुवा प्रजाति र स्वास्थ्यको तत्काल पहिचान।',
    feature2Title: 'दृश्य विकास यात्रा',
    feature2Desc: 'बीउदेखि फसलसम्म तपाईंको बालीको टाइम-ल्याप्स हेर्नुहोस्।',
    feature3Title: 'स्मार्ट मार्गदर्शन',
    feature3Desc: 'हरेक विकास चरणको लागि अडियो सल्लाहहरू।',
    quickLinks: 'द्रुत लिङ्कहरू',
    connectWithUs: 'हामीसँग जोडिनुहोस्',
    contactInfo: 'सम्पर्क जानकारी',
    allRightsReserved: 'सर्वाधिकार सुरक्षित।',
    readMore: 'पूर्ण कथा पढ्नुहोस्',
    close: 'बन्द गर्नुहोस्',
    subscribeTitle: 'साप्ताहिक कृषि सुझावहरू चाहनुहुन्छ?',
    subscribeDesc: 'हरेक सोमबार हाम्रो विशेषज्ञ AI-संचालित न्यूजलेटर प्राप्त गर्ने १०,०००+ किसानहरूमा सामेल हुनुहोस्।',
    subscribeBtn: 'अहिले सदस्यता लिनुहोस्',
    verifiedSeller: 'प्रमाणित बिक्रेता',
    loadMore: 'थप लोड गर्नुहोस्',
    sellTitle: 'आफ्नो सामान बेच्नुहोस्',
    sellDesc: 'के तपाईं व्यापारी हुनुहुन्छ? Latent_Bloom मा आफ्नो कृषि उत्पादनहरू सूचीबद्ध गर्नुहोस्।',
    sellBtn: 'अहिले सूचीबद्ध गर्नुहोस्',
    newsCategories: ['सबै', 'नेपालका सफल कथाहरू', 'विश्वव्यापी आविष्कारहरू', 'प्राविधिक सुझावहरू', 'बजार प्रवृत्ति'],
    marketCategories: [
      { id: 'all', label: 'सबै उत्पादनहरू' },
      { id: 'equipment', label: 'ट्र्याक्टर र उपकरणहरू' },
      { id: 'seeds', label: 'गुणस्तरीय बीउ' },
      { id: 'fertilizer', label: 'मलखाद' }
    ],
    newsItems: [
      {
        id: '1',
        title: 'गुल्मीमा आधुनिक कफी खेती',
        description: 'गुल्मीका स्थानीय किसानहरूले थोपा सिँचाइ अपनाइरहेका छन्, जसले उत्पादनमा ४०% वृद्धि गरेको छ।',
        content: 'गुल्मीमा कफी खेतीले ठूलो फड्को मारेको छ। परम्परागत आकाशे पानीमा आधारित खेतीलाई छोडेर थोपा सिँचाइ प्रणाली अपनाउँदा किसानहरूले पानीको बचत मात्र गरेका छैनन्, कफीको गुणस्तरमा पनि सुधार ल्याएका छन्।',
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800&auto=format&fit=crop',
        date: 'असोज २६, २०८०',
        location: 'गुल्मी, नेपाल'
      },
      {
        id: '2',
        title: 'विश्वव्यापी भर्टिकल खेती प्रवृत्तिहरू',
        description: 'सहरी क्षेत्रमा भर्टिकल खेतीले कसरी तरकारी उत्पादनमा क्रान्ति ल्याइरहेको छ।',
        content: 'भर्टिकल खेती अब कुनै सपना मात्र रहेन। विश्वका ठूला शहरहरूमा पुराना गोदामहरूलाई हराभरा तरकारी बारीमा परिणत गरिँदैछ।',
        image: 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?q=80&w=800&auto=format&fit=crop',
        date: 'असोज २४, २०८०',
        location: 'विश्वव्यापी'
      },
      {
        id: '3',
        title: 'तराईमा धानको उत्पादनमा रेकर्ड',
        description: 'अनुकूल मनसुन र गुणस्तरीय बीउका कारण यस वर्ष धानको उत्पादनमा भारी वृद्धि भएको छ।',
        content: 'नेपालको अन्न भण्डार मानिने तराई क्षेत्रमा यस वर्ष धानको उत्पादन १० वर्षयताकै उच्च विन्दुमा पुगेको छ।',
        image: 'https://images.unsplash.com/photo-1536633100371-3323067f9b0f?q=80&w=800&auto=format&fit=crop',
        date: 'असोज १९, २०८०',
        location: 'तराई क्षेत्र'
      }
    ],
    adItems: [
      {
        id: '1',
        title: 'मिनी पावर टिलर ७ एचपी',
        price: 'रु. ४५,०००',
        category: 'equipment',
        location: 'चितवन, नेपाल',
        contact: '+9779800000000',
        image: 'https://images.unsplash.com/photo-1594488311394-49a0ee16ecd2?q=80&w=600&auto=format&fit=crop'
      },
      {
        id: '2',
        title: 'जैविक मल (२५ केजी)',
        price: 'रु. १,२००',
        category: 'fertilizer',
        location: 'काठमाडौं, नेपाल',
        contact: '+9779811111111',
        image: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?q=80&w=600&auto=format&fit=crop'
      },
      {
        id: '3',
        title: 'हाइब्रिड मकैको बीउ (उच्च उत्पादन)',
        price: 'रु. ८००/केजी',
        category: 'seeds',
        location: 'पोखरा, नेपाल',
        contact: '+9779822222222',
        image: 'https://images.unsplash.com/photo-1551009175-15bdf9dcb580?q=80&w=600&auto=format&fit=crop'
      }
    ]
  }
};
