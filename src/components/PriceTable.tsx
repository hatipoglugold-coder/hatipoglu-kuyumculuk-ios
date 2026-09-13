import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, TrendingUp, Bell, Calculator, Share2, Check } from 'lucide-react';
import { GoldItem } from '../types';
import { formatTurkishLira } from '../utils/formatters';
import { BrandLogo } from './BrandLogo';

interface PriceTableProps {
  items: GoldItem[];
  onSelectItemForChart: (item: GoldItem) => void;
  onSelectItemForAlert: (item: GoldItem) => void;
  onSelectItemForCalc: (item: GoldItem) => void;
  onToggleFavorite?: (itemId: string) => void;
  isDarkMode?: boolean;
}

export const PriceTable: React.FC<PriceTableProps> = ({
  items,
  onSelectItemForChart,
  onSelectItemForAlert,
  onSelectItemForCalc,
  onToggleFavorite,
  isDarkMode = true,
}) => {
  const [activeActionItem, setActiveActionItem] = useState<GoldItem | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  // Track price changes for visual flashing: 'up' (green) or 'down' (red)
  const [flashMap, setFlashMap] = useState<
    Record<string, { buy?: 'up' | 'down'; sell?: 'up' | 'down' }>
  >({});
  const prevPricesRef = useRef<Record<string, { buy: number; sell: number }>>({});

  useEffect(() => {
    const newFlashes: Record<string, { buy?: 'up' | 'down'; sell?: 'up' | 'down' }> = {};
    let hasChanges = false;

    items.forEach((item) => {
      const prev = prevPricesRef.current[item.id];
      if (prev) {
        let buyFlash: 'up' | 'down' | undefined;
        let sellFlash: 'up' | 'down' | undefined;

        if (item.buyPrice > prev.buy) {
          buyFlash = 'up';
          hasChanges = true;
        } else if (item.buyPrice < prev.buy) {
          buyFlash = 'down';
          hasChanges = true;
        }

        if (item.sellPrice > prev.sell) {
          sellFlash = 'up';
          hasChanges = true;
        } else if (item.sellPrice < prev.sell) {
          sellFlash = 'down';
          hasChanges = true;
        }

        if (buyFlash || sellFlash) {
          newFlashes[item.id] = { buy: buyFlash, sell: sellFlash };
        }
      }
      prevPricesRef.current[item.id] = { buy: item.buyPrice, sell: item.sellPrice };
    });

    if (hasChanges) {
      setFlashMap((prev) => ({ ...prev, ...newFlashes }));

      const timer = setTimeout(() => {
        setFlashMap((current) => {
          const updated = { ...current };
          Object.keys(newFlashes).forEach((id) => {
            delete updated[id];
          });
          return updated;
        });
      }, 1400);

      return () => clearTimeout(timer);
    }
  }, [items]);

  const handleShare = (item: GoldItem) => {
    const text = `⚜️ HATİPOĞLU KUYUMCULUK ⚜️\n${item.name}\nAlış: ${formatTurkishLira(item.buyPrice)} ₺\nSatış: ${formatTurkishLira(item.sellPrice)} ₺\n\nGüncel fiyatlar için: 0 (212) 555 10 20`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Main Table Container */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-2">
        {/* Table Header */}
        <div className={`sticky top-0 z-20 backdrop-blur-md px-3 py-1.5 flex items-center text-xs font-bold tracking-wider transition-colors ${
          isDarkMode
            ? 'bg-[#060A14]/95 border-y border-[#261E14]'
            : 'bg-slate-100/95 border-y border-slate-200'
        }`}>
          {/* Ürün Türü */}
          <div className={`flex-1 flex items-center gap-1 font-cinzel ${
            isDarkMode ? 'text-amber-200/90' : 'text-slate-800'
          }`}>
            <Sparkles className={`w-3 h-3 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`} />
            <span className="text-[11px] tracking-widest font-black">ÜRÜN TÜRÜ</span>
          </div>

          {/* Alış (₺) */}
          <div className={`w-[95px] sm:w-[110px] text-right font-cinzel text-[11px] font-black tracking-wider ${
            isDarkMode ? 'text-emerald-400' : 'text-emerald-700'
          }`}>
            ALIŞ (₺)
          </div>

          {/* Satış (₺) */}
          <div className={`w-[95px] sm:w-[110px] text-right font-cinzel text-[11px] font-black tracking-wider pl-2 ${
            isDarkMode ? 'text-amber-300' : 'text-amber-800'
          }`}>
            SATIŞ (₺)
          </div>
        </div>

        {/* Rows */}
        <div className={`divide-y ${isDarkMode ? 'divide-[#151D2E]/40' : 'divide-slate-100'}`}>
          {items.map((item, idx) => {
            const isAltRow = idx % 2 === 1;
            return (
              <div
                key={item.id}
                id={`price-row-${item.id}`}
                onClick={() => setActiveActionItem(item)}
                className={`group px-3 py-1.5 flex items-center transition-colors cursor-pointer select-none ios-press ${
                  isDarkMode
                    ? isAltRow ? 'bg-[#090F1E]/80' : 'bg-[#060A14]'
                    : isAltRow ? 'bg-slate-50/70' : 'bg-white'
                } ${
                  isDarkMode
                    ? 'hover:bg-[#121B32] active:bg-[#152240]'
                    : 'hover:bg-blue-50/50 active:bg-blue-100/50'
                }`}
              >
                {/* Product Name Column */}
                <div className="flex-1 flex flex-col justify-center truncate pr-2 min-w-0">
                  <span className={`text-[13px] font-bold tracking-tight truncate leading-snug ${
                    isDarkMode
                      ? 'text-slate-100 group-hover:text-amber-200'
                      : 'text-slate-900 group-hover:text-blue-700'
                  }`}>
                    {item.name}
                  </span>
                </div>

                {/* Alış (₺) Price Column - Dynamic Flash on Change */}
                <div className="w-[95px] sm:w-[110px] text-right shrink-0">
                  {(() => {
                    const buyFlash = flashMap[item.id]?.buy;
                    return (
                      <span
                        className={`font-mono-num text-[14px] tracking-tight inline-flex items-center justify-end gap-1 px-1.5 py-0.5 rounded transition-all duration-300 ${
                          buyFlash === 'up'
                            ? 'font-black bg-emerald-500/30 text-emerald-400 border border-emerald-500/60 shadow-[0_0_12px_rgba(16,185,129,0.5)] scale-105'
                            : buyFlash === 'down'
                            ? 'font-black bg-rose-500/30 text-rose-400 border border-rose-500/60 shadow-[0_0_12px_rgba(244,63,94,0.5)] scale-105'
                            : isDarkMode
                            ? 'font-bold text-[#10B981]'
                            : 'font-bold text-[#059669]'
                        }`}
                      >
                        {buyFlash === 'up' && (
                          <span className="text-[10px] font-black text-emerald-400 leading-none">▲</span>
                        )}
                        {buyFlash === 'down' && (
                          <span className="text-[10px] font-black text-rose-400 leading-none">▼</span>
                        )}
                        <span>{formatTurkishLira(item.buyPrice)}</span>
                      </span>
                    );
                  })()}
                </div>

                {/* Satış (₺) Price Column - Dynamic Flash on Change */}
                <div className="w-[95px] sm:w-[110px] text-right shrink-0 pl-1.5">
                  {(() => {
                    const sellFlash = flashMap[item.id]?.sell;
                    return (
                      <span
                        className={`font-mono-num text-[14px] tracking-tight inline-flex items-center justify-end gap-1 px-1.5 py-0.5 rounded transition-all duration-300 ${
                          sellFlash === 'up'
                            ? 'font-black bg-emerald-500/30 text-emerald-400 border border-emerald-500/60 shadow-[0_0_12px_rgba(16,185,129,0.5)] scale-105'
                            : sellFlash === 'down'
                            ? 'font-black bg-rose-500/30 text-rose-400 border border-rose-500/60 shadow-[0_0_12px_rgba(244,63,94,0.5)] scale-105'
                            : isDarkMode
                            ? 'font-bold text-[#FBBF24]'
                            : 'font-bold text-[#D97706]'
                        }`}
                      >
                        {sellFlash === 'up' && (
                          <span className="text-[10px] font-black text-emerald-400 leading-none">▲</span>
                        )}
                        {sellFlash === 'down' && (
                          <span className="text-[10px] font-black text-rose-400 leading-none">▼</span>
                        )}
                        <span>{formatTurkishLira(item.sellPrice)}</span>
                      </span>
                    );
                  })()}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* iOS Action Sheet / Quick Action Bottom Modal for Selected Item */}
      {activeActionItem && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center p-3 animate-fadeIn"
          onClick={() => setActiveActionItem(null)}
        >
          <div
            className={`w-full max-w-sm rounded-2xl p-4 shadow-2xl flex flex-col gap-3.5 mb-14 border transition-colors ${
              isDarkMode
                ? 'bg-[#0E1628] border-amber-500/30'
                : 'bg-white border-slate-200 shadow-2xl'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`flex items-center justify-between border-b pb-2.5 ${
              isDarkMode ? 'border-[#1E2C4A]' : 'border-slate-200'
            }`}>
              <div className="space-y-1">
                <BrandLogo size="sm" isDarkMode={isDarkMode} />
                <h3 className={`text-base font-bold tracking-tight pt-1 ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  {activeActionItem.name}
                </h3>
              </div>
              <div className="text-right">
                <span className={`text-[10px] block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Makas Farkı
                </span>
                <span className={`text-xs font-mono-num font-bold ${
                  isDarkMode ? 'text-amber-400' : 'text-amber-800'
                }`}>
                  {formatTurkishLira(activeActionItem.sellPrice - activeActionItem.buyPrice)} ₺
                </span>
              </div>
            </div>

            {/* Current Rates Display */}
            <div className={`grid grid-cols-2 gap-2 p-2.5 rounded-xl border ${
              isDarkMode ? 'bg-[#080D1A] border-[#17223B]' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex flex-col">
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase">
                  Bizim Alışımız (Sizin Satışınız)
                </span>
                <span className="font-mono-num text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                  {formatTurkishLira(activeActionItem.buyPrice)} ₺
                </span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold uppercase">
                  Bizim Satışımız (Sizin Alışınız)
                </span>
                <span className="font-mono-num text-base font-extrabold text-amber-700 dark:text-amber-400">
                  {formatTurkishLira(activeActionItem.sellPrice)} ₺
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <button
                id="modal-chart-btn"
                onClick={() => {
                  onSelectItemForChart(activeActionItem);
                  setActiveActionItem(null);
                }}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl transition-all border ios-press ${
                  isDarkMode
                    ? 'bg-[#17223B] hover:bg-[#202E4E] text-slate-200 border-[#233355]'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                }`}
              >
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                Grafiğe Git
              </button>

              <button
                id="modal-alert-btn"
                onClick={() => {
                  onSelectItemForAlert(activeActionItem);
                  setActiveActionItem(null);
                }}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl transition-all border ios-press ${
                  isDarkMode
                    ? 'bg-[#17223B] hover:bg-[#202E4E] text-slate-200 border-[#233355]'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                }`}
              >
                <Bell className="w-4 h-4 text-amber-500" />
                Alarm Kur
              </button>

              <button
                id="modal-calc-btn"
                onClick={() => {
                  onSelectItemForCalc(activeActionItem);
                  setActiveActionItem(null);
                }}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl transition-all border ios-press ${
                  isDarkMode
                    ? 'bg-[#17223B] hover:bg-[#202E4E] text-slate-200 border-[#233355]'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                }`}
              >
                <Calculator className="w-4 h-4 text-blue-500" />
                Hesap Makinesi
              </button>

              <button
                id="modal-share-btn"
                onClick={() => handleShare(activeActionItem)}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl transition-all border ios-press ${
                  isDarkMode
                    ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/30'
                    : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300'
                }`}
              >
                {copiedText ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-500" />
                    Kopyalandı!
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    Fiyatı Paylaş
                  </>
                )}
              </button>
            </div>

            {/* Cancel / Close */}
            <button
              onClick={() => setActiveActionItem(null)}
              className={`w-full py-2 text-xs font-semibold text-center ${
                isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Kapat
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
