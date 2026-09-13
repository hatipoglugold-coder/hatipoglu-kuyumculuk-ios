import React from 'react';
import { Volume2, Sparkles } from 'lucide-react';

interface MarqueeTickerProps {
  text?: string;
  isDarkMode?: boolean;
  onEditClick?: () => void;
}

export const MarqueeTicker: React.FC<MarqueeTickerProps> = ({
  text,
  isDarkMode = true,
  onEditClick,
}) => {
  const content =
    text && text.trim().length > 0
      ? text
      : '⚜️ HATİPOĞLU KUYUMCULUK • Canlı Serbest Piyasa Fiyatları • Has Altın, Ziynet ve Sarrafiye Alım-Satımında Güvenin Adresi • Tel: 05448166660 • EYYÜP peygamber caddesi no:122-b Şanlıurfa Eyyübiye ⚜️';

  return (
    <div
      className={`relative h-7 sm:h-8 flex items-center border-t select-none overflow-hidden transition-colors z-30 shrink-0 ${
        isDarkMode
          ? 'bg-[#040814]/95 border-[#152033] text-amber-200/90'
          : 'bg-amber-50/95 border-amber-200/80 text-amber-950'
      }`}
    >
      {/* Static Badge on the left */}
      <div
        className={`h-full px-2 sm:px-2.5 flex items-center gap-1.5 shrink-0 z-10 border-r text-[10px] font-black tracking-wider uppercase backdrop-blur-md shadow-xs ${
          isDarkMode
            ? 'bg-[#070E22] border-[#1C2C4D] text-amber-400'
            : 'bg-amber-100 border-amber-300 text-amber-900'
        }`}
        title="Canlı Duyuru Bandı"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
        </span>
        <Volume2 className="w-3 h-3 text-amber-400 shrink-0" />
        <span className="font-cinzel text-[10px] font-black hidden xs:inline">DUYURU</span>
      </div>

      {/* Marquee Viewport */}
      <div className="flex-1 overflow-hidden relative flex items-center">
        {/* Subtle Fade Edges */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-3 pointer-events-none z-10 ${
            isDarkMode
              ? 'bg-gradient-to-r from-[#040814] to-transparent'
              : 'bg-gradient-to-r from-amber-50 to-transparent'
          }`}
        />
        <div
          className={`absolute right-0 top-0 bottom-0 w-3 pointer-events-none z-10 ${
            isDarkMode
              ? 'bg-gradient-to-l from-[#040814] to-transparent'
              : 'bg-gradient-to-l from-amber-50 to-transparent'
          }`}
        />

        {/* Scrolling text container with duplicate text for infinite smooth loop */}
        <div className="animate-marquee-infinite text-[11px] font-semibold tracking-wide py-0.5">
          <span className="inline-block px-4 whitespace-nowrap">{content}</span>
          <span className="inline-block px-4 whitespace-nowrap">{content}</span>
          <span className="inline-block px-4 whitespace-nowrap">{content}</span>
        </div>
      </div>

      {/* Quick edit hint button for admin */}
      {onEditClick && (
        <button
          onClick={onEditClick}
          className={`h-full px-1.5 flex items-center justify-center shrink-0 z-10 border-l text-[10px] transition-colors ${
            isDarkMode
              ? 'bg-[#070E22]/90 border-[#1C2C4D] text-slate-500 hover:text-amber-300'
              : 'bg-amber-100/90 border-amber-300 text-slate-500 hover:text-amber-800'
          }`}
          title="Yönetici Panelinden Kayan Yazıyı Düzenle"
        >
          <Sparkles className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};
