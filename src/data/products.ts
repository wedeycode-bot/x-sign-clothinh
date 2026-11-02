import { Product, Collection } from '@/types/product';
import { BRAND_CONFIG } from '@/config/brand';

export const PRODUCTS: Product[] = [
  // 01. THE SHIRT: X-SIGN FLEX TEE
  {
    id: 'xsign-flex-tee',
    slug: 'xsign-flex-tee',
    title: 'X-SIGN FLEX TEE',
    subtitle: '100% Heavy Cotton • Glitter Gold, Silver, Glow-in-the-Dark & Reflective DTF',
    category: 't-shirts',
    garmentType: 'tshirt',
    priceGHS: 299,
    priceUSD: 23,
    priceGBP: 18,
    priceEUR: 21,
    isNew: true,
    isFeatured: true,
    stockCount: 85,
    dropName: 'X-SIGN DROP 01',
    images: [
      '/campaign/models/IMG_4338.jpg',
      '/products/shirts/IMG_4266.PNG',
      '/campaign/models/IMG_4330.jpg',
      '/products/shirts/IMG_4251.PNG',
      '/campaign/models/IMG_4368.jpg',
      '/products/shirts/IMG_4260.PNG',
      '/campaign/models/IMG_4472.jpg',
      '/products/shirts/IMG_4259.PNG',
      '/campaign/models/IMG_4394.jpg',
    ],
    colors: [
      {
        name: 'Onyx Black / Glow in Dark & Reflective',
        hex: '#111113',
        modelHex: '#18181b',
        images: [
          '/campaign/models/IMG_4338.jpg',
          '/products/shirts/IMG_4266.PNG',
          '/products/shirts/IMG_4252.PNG',
          '/campaign/models/IMG_4323.jpg',
        ],
      },
      {
        name: 'Chalk White / Glitter Silver & DTF',
        hex: '#f4f4f4',
        modelHex: '#f0ede6',
        images: [
          '/campaign/models/IMG_4330.jpg',
          '/products/shirts/IMG_4251.PNG',
          '/products/shirts/IMG_4250.PNG',
        ],
      },
      {
        name: 'Onyx Black / Sovereign Glitter Gold',
        hex: '#d4af37',
        modelHex: '#18181b',
        images: [
          '/campaign/models/IMG_4368.jpg',
          '/products/shirts/IMG_4260.PNG',
          '/products/shirts/IMG_4258.PNG',
        ],
      },
      {
        name: 'Chalk White / Celestial Glitter Gold',
        hex: '#e6ca65',
        modelHex: '#f0ede6',
        images: [
          '/campaign/models/IMG_4472.jpg',
          '/products/shirts/IMG_4259.PNG',
        ],
      },
      {
        name: 'Onyx Black / Starlight Diamond',
        hex: '#2b2b30',
        modelHex: '#18181b',
        images: [
          '/campaign/models/IMG_4394.jpg',
          '/products/shirts/IMG_4267.PNG',
          '/products/shirts/IMG_4263.PNG',
        ],
      },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Crafted with heart, worn with purpose. Engineered from custom 320 GSM heavyweight 100% combed cotton, the X-SIGN Flex Tee combines architectural drop-shoulder streetwear tailoring with hand-finished metallic glitter gold, silver foil, and light-reactive reflective accents.',
    fabricDetails: {
      composition: 'Heavy fabric of 100% Cotton',
      weight: '320 GSM compact streetwear jersey',
      finish: 'Glitter Gold, Glitter Silver, Glow in Dark, Reflective and Fine Finished DTF',
      origin: 'Atelier Crafted in Accra',
    },
    features: [
      'X-SIGN FLEX TEE: Crafted with heart, worn with purpose.',
      'Fine materials: Glitter Gold & Glitter Silver metallic shimmer accents',
      'Glow in the Dark & Reflective light-activated elements',
      'Fine Finished Direct-to-Film (DTF) precision detailing',
      'Heavy fabric constructed from 100% premium cotton',
    ],
    careInstructions: [
      'Machine wash cold inside out on gentle cycle',
      'Hang dry in shade to preserve artwork vibrancy',
      'Do not iron directly over printed graphics',
    ],
    model3DConfig: {
      garmentType: 'tshirt',
      defaultColor: '#1a1a1a',
      roughness: 0.9,
      metalness: 0.05,
      fabricPattern: 'smooth',
      scale: [1, 1, 1],
    },
  },

  // 02. BEANIE TYPE 1: CLASSIC EMBROIDERED CREST BEANIE
  {
    id: 'xsign-beanie-classic',
    slug: 'xsign-ribbed-beanie-classic',
    title: 'X-SIGN RIBBED BEANIE (Embroidered Crest)',
    subtitle: '7-Gauge Chunky Rib Knit • Raised 3D Embroidered Crest',
    category: 'accessories',
    garmentType: 'accessory',
    priceGHS: 149,
    priceUSD: 12,
    priceGBP: 9,
    priceEUR: 11,
    isNew: true,
    isFeatured: true,
    stockCount: 50,
    dropName: '',
    images: [
      '/products/caps/IMG_3375.PNG',
      '/products/caps/IMG_4228.PNG',
      '/products/caps/xsign-white-beanie-street-look.jpg',
      '/products/caps/IMG_4216.PNG',
      '/products/caps/IMG_4220.PNG',
    ],
    colors: [
      {
        name: 'Pitch Black / White Crest',
        hex: '#0f0f10',
        modelHex: '#171718',
        images: [
          '/products/caps/IMG_3375.PNG',
          '/products/caps/IMG_4225.PNG',
          '/products/caps/IMG_4237.PNG',
        ],
      },
      {
        name: 'Chalk White / Obsidian Crest',
        hex: '#f0f0f2',
        modelHex: '#f0ede6',
        images: [
          '/products/caps/IMG_4228.PNG',
          '/products/caps/xsign-white-beanie-street-look.jpg',
          '/products/caps/IMG_4231.PNG',
          '/products/caps/IMG_4226.PNG',
          '/products/caps/IMG_4227.PNG',
          '/products/caps/IMG_4246.PNG',
        ],
      },
      {
        name: 'Heather Grey / White Crest',
        hex: '#9e9e9e',
        modelHex: '#888888',
        images: [
          '/products/caps/IMG_4216.PNG',
          '/products/caps/IMG_4217.PNG',
          '/products/caps/IMG_4219.PNG',
          '/products/caps/IMG_4199.PNG',
        ],
      },
      {
        name: 'Mocha Camel / White Crest',
        hex: '#b5927b',
        modelHex: '#ba9a83',
        images: [
          '/products/caps/IMG_4220.PNG',
          '/products/caps/IMG_4221.PNG',
          '/products/caps/IMG_4223.PNG',
          '/products/caps/IMG_4240.PNG',
        ],
      },
    ],
    sizes: ['ONE SIZE'],
    description: 'Chunky 7-gauge double-cuffed fisherman beanie knitted from ultra-soft non-itch thermal acrylic blend. Features the iconic high-density white or obsidian X-SIGN oval crest embroidery.',
    fabricDetails: {
      composition: '100% Soft-Spun Thermal Acrylic Knit',
      weight: 'Chunky 7-gauge double-fold',
      finish: 'High-density multi-pass 3D embroidery',
      origin: 'Atelier Crafted in Accra',
    },
    features: [
      'High-contrast dense embroidery oval crest',
      'Double-ply folding cuff for adjustable depth',
      'Retains snug shape without sagging',
      'Ultra soft next-to-skin touch',
    ],
    careInstructions: ['Hand wash cold with mild detergent', 'Dry flat on a clean surface'],
    model3DConfig: {
      garmentType: 'accessory',
      defaultColor: '#171718',
      roughness: 0.9,
      metalness: 0.05,
      fabricPattern: 'heavy-terry',
      scale: [0.8, 0.8, 0.8],
    },
  },

  // 03. BEANIE TYPE 2: GLITTER GOLD SHIMMER BEANIE
  {
    id: 'xsign-beanie-glitter-gold',
    slug: 'xsign-ribbed-beanie-glitter-gold',
    title: 'X-SIGN RIBBED BEANIE (Glitter Gold Crest)',
    subtitle: '7-Gauge Chunky Rib Knit • Radiant Gold Shimmer Emblem',
    category: 'accessories',
    garmentType: 'accessory',
    priceGHS: 149,
    priceUSD: 12,
    priceGBP: 9,
    priceEUR: 11,
    isNew: true,
    isFeatured: true,
    stockCount: 35,
    dropName: '',
    images: [
      '/products/caps/IMG_4195.PNG',
      '/products/caps/IMG_4202.PNG',
      '/products/caps/IMG_4197.PNG',
      '/products/caps/IMG_4203.PNG',
      '/products/caps/IMG_4242.PNG',
      '/products/caps/IMG_4244.PNG',
    ],
    colors: [
      {
        name: 'Pitch Black / Gold Shimmer',
        hex: '#171718',
        modelHex: '#171718',
        images: [
          '/products/caps/IMG_4195.PNG',
          '/products/caps/IMG_4242.PNG',
          '/products/caps/IMG_4209.PNG',
        ],
      },
      {
        name: 'Chalk White / Gold Shimmer',
        hex: '#f0f0f2',
        modelHex: '#f0ede6',
        images: [
          '/products/caps/IMG_4202.PNG',
          '/products/caps/IMG_4244.PNG',
        ],
      },
    ],
    sizes: ['ONE SIZE'],
    description: 'Dark and light luxury headwear woven with ribbed thermal stitch and finished with the signature X-SIGN emblem in radiant gold shimmer embroidery.',
    fabricDetails: {
      composition: '100% Soft-Spun Thermal Knit',
      weight: 'Chunky 7-gauge double-fold',
      finish: 'Lustrous metallic gold thread embroidery',
      origin: 'Atelier Crafted in Accra',
    },
    features: [
      'Glimmering gold embroidery oval emblem',
      'Deep fold cuff for flexible styling',
      'Ultra comfortable non-irritating fit',
      'Deluxe atelier construction',
    ],
    careInstructions: ['Hand wash cold gently', 'Dry flat in shade'],
    model3DConfig: {
      garmentType: 'accessory',
      defaultColor: '#171718',
      roughness: 0.85,
      metalness: 0.25,
      fabricPattern: 'heavy-terry',
      scale: [0.8, 0.8, 0.8],
    },
  },
];

// Helper to resolve any legacy slug to the right product and color variant
export function findProductBySlug(slug: string): { product: Product; initialColorName?: string } | null {
  // Direct match
  const direct = PRODUCTS.find((p) => p.slug === slug);
  if (direct) return { product: direct };

  // Legacy Tee Slugs
  if (slug === 'xsign-gothic-spine-tee-black') {
    return {
      product: PRODUCTS[0],
      initialColorName: 'Onyx Black / Glow in Dark & Reflective',
    };
  }
  if (slug === 'xsign-gothic-spine-tee-white') {
    return {
      product: PRODUCTS[0],
      initialColorName: 'Chalk White / Glitter Silver & DTF',
    };
  }
  if (slug === 'xsign-sovereign-gold-tee') {
    return {
      product: PRODUCTS[0],
      initialColorName: 'Onyx Black / Sovereign Glitter Gold',
    };
  }
  if (slug === 'xsign-celestial-gold-tee-white') {
    return {
      product: PRODUCTS[0],
      initialColorName: 'Chalk White / Celestial Glitter Gold',
    };
  }
  if (slug === 'xsign-diamond-starlight-tee') {
    return {
      product: PRODUCTS[0],
      initialColorName: 'Onyx Black / Starlight Diamond',
    };
  }

  // Legacy Beanie Slugs
  if (slug === 'xsign-ribbed-beanie-black') {
    return {
      product: PRODUCTS[1],
      initialColorName: 'Pitch Black / White Crest',
    };
  }
  if (slug === 'xsign-ribbed-beanie-white-black') {
    return {
      product: PRODUCTS[1],
      initialColorName: 'Chalk White / Obsidian Crest',
    };
  }
  if (slug === 'xsign-ribbed-beanie-grey') {
    return {
      product: PRODUCTS[1],
      initialColorName: 'Heather Grey / White Crest',
    };
  }
  if (slug === 'xsign-ribbed-beanie-mocha') {
    return {
      product: PRODUCTS[1],
      initialColorName: 'Mocha Camel / White Crest',
    };
  }
  if (slug === 'xsign-ribbed-beanie-gold') {
    return {
      product: PRODUCTS[2],
      initialColorName: 'Pitch Black / Gold Shimmer',
    };
  }
  if (slug === 'xsign-ribbed-beanie-white-gold') {
    return {
      product: PRODUCTS[2],
      initialColorName: 'Chalk White / Gold Shimmer',
    };
  }

  return null;
}

export const COLLECTIONS: Collection[] = [
  {
    id: 'col-01',
    slug: 'drop-01-first-edition',
    title: 'X-SIGN COLLECTION TEES',
    tagline: BRAND_CONFIG.tagline,
    season: 'Permanent Drop',
    year: BRAND_CONFIG.estYear,
    description: 'The monumental X-SIGN graphic drop. Crafted with heart and purpose from heavy fabric of 100% cotton with Glitter Gold, Glitter Silver, Glow in Dark, Reflective, and Fine Finished DTF.',
    coverImage: '/images/xsign-campaign.jpg',
    editorialImages: [
      '/products/shirts/IMG_4266.PNG',
      '/products/shirts/IMG_4251.PNG',
      '/products/shirts/IMG_4260.PNG',
    ],
    productIds: ['xsign-flex-tee'],
  },
  {
    id: 'col-02',
    slug: 'capsule-headwear-edition',
    title: 'SIGNATURE HEADWEAR // KNIT CAPSULE',
    tagline: 'All-Weather Knits',
    season: 'Permanent Capsule',
    year: BRAND_CONFIG.estYear,
    description: 'Chunky 7-gauge thermal double-cuffed beanies in two specialized editions: Classic 3D Embroidered Crest and Sovereign Gold Shimmer Emblem.',
    coverImage: '/products/caps/IMG_4228.PNG',
    editorialImages: [
      '/products/caps/IMG_3375.PNG',
      '/products/caps/IMG_4195.PNG',
      '/products/caps/IMG_4220.PNG',
    ],
    productIds: ['xsign-beanie-classic', 'xsign-beanie-glitter-gold'],
  },
];
