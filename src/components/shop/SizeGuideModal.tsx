'use client';

import React from 'react';
import { BRAND_CONFIG } from '@/config/brand';
import { X, Ruler } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose, category }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div
        className="relative w-full max-w-2xl bg-[#0e0f14] border border-white/10 rounded-2xl p-6 sm:p-8 overflow-hidden shadow-2xl z-10 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold uppercase text-white font-sans">
              Streetwear Sizing Guide • {BRAND_CONFIG.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed font-sans">
          Garments are engineered with an architectural, oversized drop-shoulder drape. If you prefer a tailored/standard fit, choose one size down.
        </p>

        {/* Measurement Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono text-left text-zinc-300">
            <thead className="bg-white/5 uppercase text-white border-b border-white/10">
              <tr>
                <th className="p-3">Size</th>
                <th className="p-3">Chest (cm / in)</th>
                <th className="p-3">Length (cm / in)</th>
                <th className="p-3">Shoulder (cm / in)</th>
                <th className="p-3">Ghana/EU Fit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="p-3 font-bold text-white">S</td>
                <td className="p-3">116 cm / 45.5&quot;</td>
                <td className="p-3">71 cm / 28.0&quot;</td>
                <td className="p-3">54 cm / 21.2&quot;</td>
                <td className="p-3 text-zinc-400">Regular 46</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-white">M</td>
                <td className="p-3">122 cm / 48.0&quot;</td>
                <td className="p-3">73 cm / 28.7&quot;</td>
                <td className="p-3">56 cm / 22.0&quot;</td>
                <td className="p-3 text-zinc-400">Regular 48-50</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-white">L</td>
                <td className="p-3">128 cm / 50.4&quot;</td>
                <td className="p-3">75 cm / 29.5&quot;</td>
                <td className="p-3">58 cm / 22.8&quot;</td>
                <td className="p-3 text-zinc-400">Regular 52</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-white">XL</td>
                <td className="p-3">134 cm / 52.8&quot;</td>
                <td className="p-3">77 cm / 30.3&quot;</td>
                <td className="p-3">60 cm / 23.6&quot;</td>
                <td className="p-3 text-zinc-400">Regular 54</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-white">XXL</td>
                <td className="p-3">140 cm / 55.1&quot;</td>
                <td className="p-3">79 cm / 31.1&quot;</td>
                <td className="p-3">62 cm / 24.4&quot;</td>
                <td className="p-3 text-zinc-400">Regular 56</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] font-mono text-zinc-400 space-y-1">
          <p className="text-white font-semibold uppercase">NEED FITTING ADVICE?</p>
          <p>Contact styling support: {BRAND_CONFIG.whatsappNumber}</p>
        </div>
      </div>
    </div>
  );
};
