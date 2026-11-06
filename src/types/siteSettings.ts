export interface SiteSettings {
  hero: {
    title: string;
    tagline: string;
    description: string;
    primaryCtaText: string;
    primaryCtaLink: string;
    secondaryCtaText: string;
    secondaryCtaLink: string;
  };
  marquee: {
    items: string[];
  };
  campaignFilm: {
    title: string;
    subtitle: string;
    videoUrl?: string; // YouTube or direct MP4 URL
  };
  manifesto: {
    heading: string;
    subheading: string;
    paragraph1: string;
    paragraph2: string;
  };
  contact: {
    email: string;
    phone: string;
    whatsappNumber: string;
    flagshipAddress: string;
    instagram: string;
    tiktok: string;
    twitter: string;
    youtube: string;
    twitch: string;
  };
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  hero: {
    title: 'X-SIGN',
    tagline: 'Togg it your way!!',
    description:
      'X-SIGN FLEX TEE — Crafted with heart, worn with purpose. Engineered from heavy fabric of 100% cotton with Glitter Gold, Glitter Silver, Glow in Dark, Reflective & Fine Finished DTF.',
    primaryCtaText: 'SHOP COLLECTION',
    primaryCtaLink: '/shop',
    secondaryCtaText: 'VIEW LOOKBOOK',
    secondaryCtaLink: '/lookbook',
  },
  marquee: {
    items: [
      'X-SIGN // STREETWEAR ATELIER',
      'Togg it your way!!',
      'ACCRA • GLOBAL DISPATCH',
      'DROP 01 FIRST EDITION',
      'HEAVYWEIGHT 100% COTTON',
      'METALLIC FOIL & PRECISION DTF',
    ],
  },
  campaignFilm: {
    title: 'OFFICIAL CAMPAIGN ENSEMBLE',
    subtitle: 'Accra Street Atelier // First Edition',
    videoUrl: '',
  },
  manifesto: {
    heading: 'DON’T JUST LOOK DIFFERENT. MAKE YOUR PRESENCE UNDENIABLE.',
    subheading: 'TOGG IT YOUR WAY',
    paragraph1:
      'Every fit is an opportunity to express yourself, break the rules, and leave a lasting impression. We don’t dress to blend in — we dress to stand apart. Built on confidence, driven by originality, and inspired by those who create their own lane, X SIGN represents a lifestyle beyond ordinary fashion.',
    paragraph2:
      'Engineered with heavyweight organic textiles, architectural drop silhouettes, and contemporary streetwear tailoring.',
  },
  contact: {
    email: 'xsignclothing@gmail.com',
    phone: '+233 (0) 53 081 3362',
    whatsappNumber: '+233 (0) 53 081 3362',
    flagshipAddress: 'Accra, Greater Accra Region, Ghana',
    instagram: '@xsignclothing',
    tiktok: '@xsignclothing',
    twitter: '@xsignclothing',
    youtube: '@xsignclothing',
    twitch: 'xsignclothing',
  },
};
