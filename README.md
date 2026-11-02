# BONSAM • Immersive 3D Streetwear E-Commerce Experience

> **Born in Accra. Engineered for the Cosmos.**  
> An avant-garde digital fashion exhibition and high-performance streetwear storefront inspired by Afrix, built with **Next.js 14**, **Three.js**, **React Three Fiber (R3F)**, **Drei**, **Tailwind CSS**, and **Web Audio API**.

---

## 🌟 Creative Direction & Core Experiences

### Experience A: Immersive 3D World
- **Atmospheric 3D Scene**: Obsidian brutalist monoliths, floating gold-trimmed architectural plinths, and metallic kinetic orbital rings.
- **Cinematic Lighting & Shadow System**: Dual directional rims, warm golden point lights, and realtime contact shadows.
- **Floating Particles & Atmospheric Haze**: Subtle gold dust and cyber-blue particles floating through the digital runway space.
- **Web Audio Ambient Generator**: Dual-oscillator analog drone pad with resonant low-pass filter breathing modulation and UI sound effects, disabled by default.

### Experience B: Interactive 3D Clothing
- **Realistic 3D Garment Models**: Parametric 3D meshes for:
  - *Oversized Drop-Shoulder Heavyweight Hoodie* (double-ply hood, kangaroo pocket, gold runes, drawstring aglets)
  - *Boxy Heavyweight Tee* (300 GSM drape, bound rib collar ring, drop sleeve hems)
  - *Accra Modular Tactical Cargos* (articulated knees, 3D box pockets, cinch cuffs)
  - *Atelier Raw Selvedge Denim* (16oz rigid drape, selvedge detail)
  - *Exo-Puffer Armored Utility Vest* (horizontal baffles, stand-up collar, tactical straps)
  - *Monogram Knit Balaclava* (merino ribbing, eyewear slits, gold forehead talisman)
- **Real-Time 360° Inspection**: Full orbit rotation, pinch/scroll zoom, reset camera angle, wireframe surface toggle, and PBR micro-weave bump texture toggle.
- **Dynamic Colorway Synchronization**: Switch colorways in real time and see the 3D garment update instantly.

### Experience C: Cinematic Fashion Storytelling
- **The Codex of Bonsam**: Mythological Akan lore of *Sasabonsam* translated into contemporary cyberpunk luxury streetwear.
- **Editorial Asymmetry**: Typographic infinite marquees, lookbook image grids, and high-density material callouts (550 GSM French Terry, Kurabo Japanese selvedge).

---

## 🛍️ Ghana-Ready E-Commerce Architecture

- **Native Currency: Ghanaian Cedi (GH₵)** as default, with instant live conversion to **USD ($)**, **GBP (£)**, and **EUR (€)** across all pages.
- **Ghanaian Delivery Matrix**:
  - *Greater Accra*: Same-day atelier dispatch rider (orders before 3 PM GMT)
  - *Kumasi, Takoradi, Sunyani, Tamale*: 24–48h express delivery
  - *Ghana Post Digital Address (GPS)* field integrated (e.g., `GA-183-9024`)
  - *Free Shipping*: Automatically unlocked for orders above **GH₵ 1,200**
- **Payment Gateway Architecture**:
  - *Ghanaian Mobile Money*: MTN MoMo, Telecel Cash, and AT Money
  - *Cards*: Visa, Mastercard, and Apple Pay
  - *Production Ready*: Pre-configured architecture for Paystack / Hubtel / Flutterwave webhooks and API integration.

---

## 🗺️ Complete Page Structure

1. **Homepage (`/`)**:
   - `01. Cinematic Introduction`: Full-screen 3D world with sound toggle and direct entrance options
   - `02. Main Hero`: Interactive 3D hero stage with live garment switcher and editorial typography
   - `03. Featured Collections`: "Drop 004: Sacred Shadows" & "Season 01: Forest of Iron"
   - `04. Latest Drop 004`: Product grid with category tabs and 3D quick inspect
   - `05. Fashion Campaign`: "Mythology meets Cyber-Streetwear" manifesto
   - `06. New Arrivals`: Fresh atelier drops with instant bag addition
   - `07. Brand Section`: Accra craftsmanship, living wage standards, and workshop ethos
   - `08. Global Footer`: Client care, Ghana & worldwide dispatch info, newsletter archive
2. **Catalog Shop (`/shop`)**: Multi-category filtering (Hoodies, T-Shirts, Pants, Jeans, Shirts, Shorts, Accessories), size filter, in-stock toggle, and price/drop sorting.
3. **Product Detail (`/product/[slug]`)**: Seamless switch between 3D Realtime Inspector and Editorial Photography Gallery, color swatches, size selector, sizing chart modal, fabric specs, and related garments.
4. **Collections Overview (`/collections`)**: Lookbooks, seasonal narratives, and curated capsule drops.
5. **Brand Lore (`/about`)**: The story of Sasabonsam, heavy-gauge textile manufacturing, and the Accra design philosophy.
6. **Client Support (`/support`)**: Delivery schedules, FAQ accordion, WhatsApp concierge, and direct contact desk.
7. **Encrypted Checkout (`/checkout`)**: Ghana & international delivery address form, MoMo / Card selection, order confirmation, and celebratory receipt.

---

## 🚀 Getting Started

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm start
```
