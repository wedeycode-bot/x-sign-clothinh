'use client';

import React, { useState } from 'react';
import { BRAND_CONFIG } from '@/config/brand';
import { Mail, Phone, MapPin, Check, ChevronDown } from 'lucide-react';

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const faqs = [
    {
      q: 'How does delivery work in Ghana (Accra & Nationwide)?',
      a: 'Within Greater Accra, orders placed before 3:00 PM GMT are dispatched same-day via our dedicated dispatch riders. Deliveries to Kumasi, Takoradi, Sunyani, Tamale, and Cape Coast arrive within 24 to 48 hours via VIP/EMS parcel service or door-to-door courier. Orders above GH₵ 1,200 qualify for complimentary delivery.',
    },
    {
      q: 'Do you ship internationally to the US, UK, Europe, and Nigeria?',
      a: 'Yes. All international parcels are shipped via DHL Express with direct air-freight tracking. Transit times are typically 3 to 5 business days to the United Kingdom, United States, Europe, and Canada.',
    },
    {
      q: 'Which payment methods are supported?',
      a: 'We natively support Ghanaian Mobile Money (MTN MoMo, Telecel Cash, and AT Money) as well as Visa, Mastercard, and Apple Pay. In our production environment, checkout securely connects to licensed Payment Service Providers.',
    },
    {
      q: 'What is your returns and exchange policy?',
      a: 'We offer a 14-day exchange or store credit guarantee on unworn, unwashed items in original archival packaging with all designer tags and barcodes intact.',
    },
    {
      q: 'How should I care for heavyweight garments?',
      a: 'To maintain the architectural drape and preserve printed graphics, always machine wash cold inside out on a gentle cycle, and lay flat to dry in the shade. Never tumble dry or iron directly over printed graphics.',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#08080a] text-zinc-900 dark:text-white pt-24 pb-24 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Header */}
        <div className="border-b border-black/10 dark:border-white/5 pb-12">
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block mb-2">
            CLIENT CARE & SUPPORT
          </span>
          <h1 className="text-4xl sm:text-6xl font-black uppercase text-zinc-950 dark:text-white font-sans tracking-tight">
            CLIENT SERVICES
          </h1>
          <p className="text-xs sm:text-sm font-mono text-zinc-600 dark:text-zinc-400 mt-2 max-w-xl">
            Direct assistance regarding delivery schedules, international shipping, sizing consultations, and order tracking.
          </p>
        </div>

        {/* 3 Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-zinc-100 dark:bg-[#0c0d12] border border-black/10 dark:border-white/10 space-y-3 shadow-sm dark:shadow-none">
            <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 text-black dark:text-white w-fit">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold uppercase text-zinc-950 dark:text-white">WHATSAPP SUPPORT</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
              Instant styling, size recommendations, and real-time order tracking.
            </p>
            <p className="text-xs font-mono text-zinc-950 dark:text-white pt-2 font-semibold">
              {BRAND_CONFIG.whatsappNumber} <br />
              <span className="text-[11px] text-zinc-500 font-normal">Mon – Sat, 9:00 AM – 7:00 PM GMT</span>
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-100 dark:bg-[#0c0d12] border border-black/10 dark:border-white/10 space-y-3 shadow-sm dark:shadow-none">
            <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 text-black dark:text-white w-fit">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold uppercase text-zinc-950 dark:text-white">EMAIL DESK</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
              For wholesale inquiries, press loans, and order queries.
            </p>
            <p className="text-xs font-mono text-zinc-950 dark:text-white pt-2 font-semibold">
              {BRAND_CONFIG.contactEmail} <br />
              <span className="text-[11px] text-zinc-500 font-normal">Guaranteed response within 4 hours</span>
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-100 dark:bg-[#0c0d12] border border-black/10 dark:border-white/10 space-y-3 shadow-sm dark:shadow-none">
            <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 text-black dark:text-white w-fit">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold uppercase text-zinc-950 dark:text-white">ATELIER LOCATION</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
              Fitting room and archival vault pickup point.
            </p>
            <p className="text-xs font-mono text-zinc-950 dark:text-white pt-2 font-semibold">
              {BRAND_CONFIG.flagshipAddress}
            </p>
          </div>
        </div>

        {/* FAQs and Contact Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8">
          {/* FAQ Column */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-2xl font-bold uppercase text-zinc-950 dark:text-white font-sans flex items-center gap-2">
              <span>FREQUENTLY ASKED QUESTIONS</span>
            </h2>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-xl bg-zinc-100 dark:bg-white/[0.02] border border-black/10 dark:border-white/5 overflow-hidden transition-all shadow-sm dark:shadow-none"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 text-sm font-semibold text-zinc-950 dark:text-white hover:text-black dark:hover:text-zinc-200 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-zinc-500 shrink-0 transition-transform duration-200 ${
                        openFaq === idx ? 'rotate-180 text-black dark:text-white' : ''
                      }`}
                    />
                  </button>

                  {openFaq === idx && (
                    <div className="px-5 pb-5 text-xs text-zinc-700 dark:text-zinc-400 font-sans leading-relaxed border-t border-black/10 dark:border-white/5 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-5 p-8 rounded-2xl bg-zinc-100 dark:bg-[#0c0d12] border border-black/10 dark:border-white/10 space-y-6 shadow-md dark:shadow-none">
            <div>
              <h3 className="text-lg font-bold uppercase text-zinc-950 dark:text-white font-sans">
                DIRECT SUPPORT MESSAGE
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-mono mt-1">
                Send a direct note to atelier support.
              </p>
            </div>

            {formSubmitted ? (
              <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-mono text-xs space-y-2 text-center">
                <Check className="w-8 h-8 mx-auto text-emerald-600 dark:text-emerald-400" />
                <p className="font-bold uppercase">Transmission Received</p>
                <p className="text-zinc-600 dark:text-zinc-400">Our support team will respond promptly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
                <div className="space-y-1">
                  <label className="text-zinc-600 dark:text-zinc-400 font-mono text-[11px] uppercase">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="[Your Name]"
                    className="w-full p-3 rounded-lg bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-black/30 dark:focus:border-white/30"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-600 dark:text-zinc-400 font-mono text-[11px] uppercase">Email or Phone</label>
                  <input
                    type="text"
                    required
                    placeholder="[name@domain.com or phone number]"
                    className="w-full p-3 rounded-lg bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-black/30 dark:focus:border-white/30"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-600 dark:text-zinc-400 font-mono text-[11px] uppercase">Subject</label>
                  <select className="w-full p-3 rounded-lg bg-white dark:bg-[#14151b] border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white focus:outline-none focus:border-black/30 dark:focus:border-white/30">
                    <option>Order & Delivery Query</option>
                    <option>Ghana Mobile Money Payment</option>
                    <option>Sizing & Fit Assistance</option>
                    <option>Press & Wholesale Inquiries</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-600 dark:text-zinc-400 font-mono text-[11px] uppercase">Message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="[How can our team assist you?]"
                    className="w-full p-3 rounded-lg bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-black/30 dark:focus:border-white/30 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 font-bold font-mono uppercase text-xs transition-colors shadow-md"
                >
                  Transmit Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
