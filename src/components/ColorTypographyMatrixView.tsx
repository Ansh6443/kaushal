import React, { useState } from 'react';
import { Language } from '../types';
import { COLOR_TOKENS, TYPOGRAPHY_SPECS, ICON_EMOJI_MATRIX } from '../data/researchData';
import { Palette, Copy, Check, Type, Sparkles } from 'lucide-react';

interface ColorTypographyMatrixViewProps {
  lang: Language;
}

export const ColorTypographyMatrixView: React.FC<ColorTypographyMatrixViewProps> = ({ lang }) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [customTestText, setCustomTestText] = useState<string>(
    'कौशल सेतु · Vocational Intelligence & Skill Gap Radar'
  );

  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="bg-[#111622] rounded-xl border border-[#1E293B] p-6">
        <div className="flex items-center gap-2 text-xs font-mono-data text-cyan-400 mb-1">
          <span>DESIGN SYSTEM TOKENS</span>
          <span>·</span>
          <span>DARK-MODE & NEON ENGINE</span>
          <span>·</span>
          <span className="text-emerald-400">WCAG AAA COMPLIANT</span>
        </div>
        <h1 className="text-2xl font-display font-bold text-slate-100 tracking-tight">
          {lang === 'en' ? 'Color Palette, Typography & Semiotic Matrix' : 'रंग पैलेट, फॉन्ट एवं प्रतीक मैट्रिक्स'}
        </h1>
        <p className="text-xs lg:text-sm text-slate-400 mt-1 max-w-3xl">
          {lang === 'en'
            ? 'Interactive design token sandbox. Copy hex codes, inspect contrast ratios, and test live Devanagari typography render performance.'
            : 'डिजाइन टोकन सैंडबॉक्स। हेक्स कोड कॉपी करें, कंट्रास्ट अनुपात देखें और लाइव देवनागरी टाइपोग्राफी का परीक्षण करें।'}
        </p>
      </div>

      {/* Color Swatch Sandbox */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-display font-bold text-slate-100 flex items-center gap-2">
            <Palette className="w-4 h-4 text-cyan-400" />
            <span>{lang === 'en' ? 'Core Palette Tokens (Click to Copy HEX)' : 'मुख्य रंग टोकन (क्लिक करके HEX कॉपी करें)'}</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono-data">
            Obsidian Base: <strong className="text-cyan-400">#090C12</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {COLOR_TOKENS.map((token, idx) => (
            <div
              key={idx}
              onClick={() => handleCopy(token.hex)}
              className="group cursor-pointer bg-[#111622] border border-[#1E293B] hover:border-cyan-500/50 rounded-xl overflow-hidden transition-all hover:-translate-y-0.5 shadow-sm"
            >
              <div
                className="h-28 p-3 flex flex-col justify-between transition-transform"
                style={{ backgroundColor: token.hex }}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono-data font-bold px-1.5 py-0.5 rounded shadow-sm ${
                    token.hex === '#090C12' || token.hex === '#111622' || token.hex === '#24314A' 
                      ? 'bg-white/10 text-white' 
                      : 'bg-black/60 text-white'
                  }`}>
                    {token.wcagContrast}
                  </span>
                  <div className="w-6 h-6 rounded bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    {copiedHex === token.hex ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  </div>
                </div>
                <div className={`font-mono-data font-bold text-sm drop-shadow ${
                  token.hex === '#090C12' || token.hex === '#111622' || token.hex === '#24314A'
                    ? 'text-slate-100'
                    : 'text-slate-950'
                }`}>
                  {token.hex}
                </div>
              </div>

              <div className="p-3.5 space-y-1.5 bg-[#111622]">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-100">{token.name}</h4>
                  <span className="text-[10px] font-mono-data text-emerald-400 font-semibold">{token.wcagScore}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                  {token.role}
                </p>
                <div className="pt-2 text-[10px] text-cyan-400 font-mono-data">
                  {copiedHex === token.hex ? '✓ Copied to clipboard!' : `RGB: ${token.rgb}`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Typography Tester */}
      <div className="bg-[#111622] rounded-xl border border-[#1E293B] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-display font-bold text-slate-100 flex items-center gap-2">
            <Type className="w-4 h-4 text-cyan-400" />
            <span>{lang === 'en' ? 'Live Typography Specimen Sandbox' : 'लाइव टाइपोग्राफी नमूना सैंडबॉक्स'}</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono-data">
            Bilingual Latin + Devanagari Pairings
          </span>
        </div>

        {/* Live Input Field */}
        <div>
          <label className="text-xs text-slate-400 block mb-1.5 font-medium">
            {lang === 'en' ? 'Test Your Custom Headline or Trade Title:' : 'अपनी पसंद का पाठ यहां लिखकर देखें:'}
          </label>
          <input
            type="text"
            value={customTestText}
            onChange={e => setCustomTestText(e.target.value)}
            className="w-full bg-[#0E131E] border border-[#24314A] rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-400 font-hindi"
          />
        </div>

        {/* Font Previews */}
        <div className="space-y-4 pt-2">
          
          <div className="p-4 rounded-lg bg-[#0E131E] border border-[#1E293B] space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono-data">
              <span className="text-cyan-400 font-bold">Space Grotesk + Noto Sans Devanagari Bold (Hero Display)</span>
              <span>clamp(1.5rem, 3vw, 2.25rem) · weight 700</span>
            </div>
            <div className="text-xl lg:text-2xl font-display font-bold text-slate-100 leading-snug tracking-tight">
              {customTestText}
            </div>
            <div className="text-[11px] text-slate-400 pt-1 font-mono-data">
              Characterized by crisp geometric vertices, confident structural stance, and zero AI rounding distortion.
            </div>
          </div>

          <div className="p-4 rounded-lg bg-[#0E131E] border border-[#1E293B] space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono-data">
              <span className="text-cyan-400 font-bold">Plus Jakarta Sans (Body Prose & Action Labels)</span>
              <span>15px · weight 500 · line-height 1.55</span>
            </div>
            <div className="text-sm font-medium text-slate-200 leading-relaxed">
              {customTestText} — High optical legibility across sub-HD mobile screens, generous counters, and calibrated stroke weight.
            </div>
          </div>

          <div className="p-4 rounded-lg bg-[#0E131E] border border-[#1E293B] space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono-data">
              <span className="text-cyan-400 font-bold">JetBrains Mono (Tabular Data & Telemetry)</span>
              <span>13px · tabular-nums · weight 600</span>
            </div>
            <div className="text-xs font-mono-data text-cyan-300">
              ₹24,000/mo · 85% REQ · 45% EVAL · Δ -40% GAP · 8.5 KM RADIUS · 24 HRS
            </div>
            <div className="text-[11px] text-slate-400 font-mono-data">
              Strict character spacing ensures perfect vertical alignment of decimal numbers, currencies, and distances in high-density tables.
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
