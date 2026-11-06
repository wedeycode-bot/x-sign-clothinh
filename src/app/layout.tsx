import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { ProductsProvider } from '@/context/ProductsContext';
import { CartProvider } from '@/context/CartContext';
import { SoundProvider } from '@/context/SoundContext';
import { SiteSettingsProvider } from '@/context/SiteSettingsContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/shop/CartDrawer';
import { QuickViewModal } from '@/components/shop/QuickViewModal';
import { SearchModal } from '@/components/shop/SearchModal';

import { BRAND_CONFIG } from '@/config/brand';

export const metadata: Metadata = {
  title: `${BRAND_CONFIG.name} • Official Streetwear Atelier`,
  description:
    'The official digital flagship for X-SIGN streetwear atelier in Accra, Ghana. High-density gothic spine graphic tees, ribbed knit beanies, and worldwide checkout.',
  keywords: [
    'X-SIGN',
    'streetwear',
    'luxury streetwear',
    'accra fashion',
    'heavyweight graphic tees',
    'ribbed beanies',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const savedTheme = localStorage.getItem('xsign_theme');
                if (savedTheme === 'light') {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                } else {
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="bg-zinc-50 dark:bg-[#08080a] text-zinc-900 dark:text-zinc-100 font-sans antialiased selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-200">
        <ThemeProvider>
          <SoundProvider>
            <SiteSettingsProvider>
              <ProductsProvider>
                <CartProvider>
                  {/* Global Navigation */}
                  <Navbar />

                  {/* Main Application Content */}
                  <main className="relative min-h-screen">
                    {children}
                  </main>

                  {/* Global Footer */}
                  <Footer />

                  {/* Interactive Overlays & Modals */}
                  <CartDrawer />
                  <QuickViewModal />
                  <SearchModal />
                </CartProvider>
              </ProductsProvider>
            </SiteSettingsProvider>
          </SoundProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
