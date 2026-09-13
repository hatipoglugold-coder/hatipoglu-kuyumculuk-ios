import React, { useState } from 'react';
import { Calculator, Plus, Minus, RotateCcw, Share2, Check, ArrowRightLeft, Sparkles } from 'lucide-react';
import { GoldItem } from '../types';
import { formatTurkishLira } from '../utils/formatters';

interface CalculatorViewProps {
  items: GoldItem[];
  prefilledItem?: GoldItem | null;
  isDarkMode?: boolean;
}

interface CalcRow {
  itemId: string;
  count: number;
  grams?: number;
}

export const CalculatorView: React.FC<CalculatorViewProps> = ({
  items,
  isDarkMode = true,
}) => {
  const [activeMode, setActiveMode] = useState<'ziynet' | 'currency'>('ziynet');

  // Rows for Ziynet / Altın calculator
  const [calcRows, setCalcRows] = useState<CalcRow[]>([
    { itemId: 'yeni-ceyrek', count: 2 },
    { itemId: '22-ayar-bilezik', count: 1, grams: 25 },
    { itemId: 'has-altin', count: 1, grams: 10 },
  ]);

  const [copiedSlip, setCopiedSlip] = useState(false);

  // Currency Converter State
  const [currencyAmount, setCurrencyAmount] = useState<number>(1000);
  const [fromCurrency, setFromCurrency] = useState<'TRY' | 'USD' | 'EUR' | 'HAS'>('TRY');
  const [toCurrency, setToCurrency] = useState<'TRY' | 'USD' | 'EUR' | 'HAS'>('HAS');

  const updateQuantity = (index: number, delta: number) => {
    setCalcRows((prev) => {
      const copy = [...prev];
      copy[index].count = Math.max(0, copy[index].count + delta);
      return copy;
    });
  };

  const updateGrams = (index: number, grams: number) => {
    setCalcRows((prev) => {
      const copy = [...prev];
      copy[index].grams = Math.max(0, grams);
      return copy;
    });
  };

  const addRow = (itemId: string) => {
    const existing = calcRows.find((r) => r.itemId === itemId);
    if (existing) {
      existing.count += 1;
      setCalcRows([...calcRows]);
    } else {
      const item = items.find((i) => i.id === itemId);
      setCalcRows([...calcRows, { itemId, count: 1, grams: item?.unit === 'Gram' ? 10 : undefined }]);
    }
  };

  const resetCalculator = () => {
    setCalcRows([]);
  };

  // Calculations
  const totals = calcRows.reduce(
    (acc, row) => {
      const item = items.find((i) => i.id === row.itemId);
      if (!item || row.count === 0) return acc;

      const multiplier = item.unit === 'Gram' ? (row.grams || 1) * row.count : row.count;
      const buyTotal = item.buyPrice * multiplier;
      const sellTotal = item.sellPrice * multiplier;

      return {
        totalBuy: acc.totalBuy + buyTotal,
        totalSell: acc.totalSell + sellTotal,
        totalItems: acc.totalItems + row.count,
      };
    },
    { totalBuy: 0, totalSell: 0, totalItems: 0 }
  );

  // Currency Convert Math
  const getRateInTry = (curr: string): number => {
    if (curr === 'TRY') return 1;
    if (curr === 'USD') return items.find((i) => i.id === 'usd-try')?.sellPrice || 48.54;
    if (curr === 'EUR') return items.find((i) => i.id === 'eur-try')?.sellPrice || 56.38;
    if (curr === 'HAS') return items.find((i) => i.id === 'has-altin')?.sellPrice || 6835.64;
    return 1;
  };

  const convertedResult = (() => {
    const fromRate = getRateInTry(fromCurrency);
    const toRate = getRateInTry(toCurrency);
    const amountInTry = currencyAmount * fromRate;
    return amountInTry / toRate;
  })();

  const handleCopySlip = () => {
    let slip = `⚜️ HATİPOĞLU KUYUMCULUK HESAP FİŞİ ⚜️\n`;
    slip += `Tarih: ${new Date().toLocaleDateString('tr-TR')} ${new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}\n`;
    slip += `------------------------------------\n`;

    calcRows.forEach((r) => {
      const item = items.find((i) => i.id === r.itemId);
      if (!item || r.count === 0) return;
      const multiplier = item.unit === 'Gram' ? (r.grams || 1) * r.count : rowGramsDisplay(r);
      slip += `• ${r.count}x ${item.name} ${item.unit === 'Gram' ? `(${rowGramsDisplay(r)} gr)` : ''}: ${formatTurkishLira(item.sellPrice * multiplier)} ₺\n`;
    });

    slip += `------------------------------------\n`;
    slip += `Müşteri Alırsa (Satış): ${formatTurkishLira(totals.totalSell)} ₺\n`;
    slip += `Müşteri Bozarsa (Alış): ${formatTurkishLira(totals.totalBuy)} ₺\n`;
    slip += `İletişim: 0 (212) 555 10 20\n`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(slip);
      setCopiedSlip(true);
      setTimeout(() => setCopiedSlip(false), 2500);
    }
  };

  function rowGramsDisplay(r: CalcRow) {
    return (r.grams || 1) * r.count;
  }

  return (
    <div className={`flex-1 flex flex-col overflow-y-auto no-scrollbar px-3.5 py-2.5 pb-16 transition-colors ${
      isDarkMode ? 'text-slate-100' : 'text-slate-800'
    }`}>
      {/* Header Tabs */}
      <div className="flex items-center justify-between">
        <div>
          <span className={`text-[11px] font-cinzel font-bold tracking-wider flex items-center gap-1 ${
            isDarkMode ? 'text-amber-400' : 'text-blue-600'
          }`}>
            <Sparkles className="w-3 h-3" /> KUYUMCU MATİK
          </span>
          <h2 className={`text-lg font-black tracking-tight ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}>
            Ziynet & Döviz Hesaplama
          </h2>
        </div>

        {/* Mode switcher */}
        <div className={`flex rounded-xl p-0.5 text-xs font-bold border transition-colors ${
          isDarkMode
            ? 'bg-[#0A1020] border-[#1C2945]'
            : 'bg-slate-100 border-slate-200'
        }`}>
          <button
            onClick={() => setActiveMode('ziynet')}
            className={`px-3 py-1 rounded-lg transition-all ${
              activeMode === 'ziynet'
                ? isDarkMode
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-white text-blue-700 shadow-xs border border-blue-200'
                : isDarkMode
                ? 'text-slate-400 hover:text-white'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Altın / Ziynet
          </button>
          <button
            onClick={() => setActiveMode('currency')}
            className={`px-3 py-1 rounded-lg transition-all ${
              activeMode === 'currency'
                ? isDarkMode
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-white text-blue-700 shadow-xs border border-blue-200'
                : isDarkMode
                ? 'text-slate-400 hover:text-white'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Döviz Çevirici
          </button>
        </div>
      </div>

      {activeMode === 'ziynet' ? (
        <>
          {/* Quick Add Buttons */}
          <div className="mt-3">
            <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1.5 ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Hızlı Ürün Ekle
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {[
                { id: 'has-altin', label: '+ Has Altın' },
                { id: '22-ayar-bilezik', label: '+ 22 Ayar Bilezik' },
                { id: 'eski-tam', label: '+ Eski Tam' },
                { id: 'yeni-tam', label: '+ Yeni Tam' },
                { id: 'yeni-yarim', label: '+ Yarım Altın' },
                { id: 'eski-ceyrek', label: '+ Eski Çeyrek' },
                { id: 'yeni-ceyrek', label: '+ Yeni Çeyrek' },
                { id: '22-ayar-hurda', label: '+ 22 Hurda' },
                { id: 'gumus-gram', label: '+ Gümüş' },
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => addRow(btn.id)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-semibold whitespace-nowrap active:scale-95 transition-all ios-press border ${
                    isDarkMode
                      ? 'bg-[#10192C] hover:bg-[#182542] border-[#1F2E50] text-amber-300/90'
                      : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-blue-700'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Totals Summary Banner */}
          <div className={`rounded-2xl p-3.5 mt-3 shadow-xl border transition-colors ${
            isDarkMode
              ? 'bg-[#090F1E] border-amber-500/25'
              : 'bg-white border-slate-200'
          }`}>
            <div className={`flex items-center justify-between border-b pb-2.5 ${
              isDarkMode ? 'border-[#182540]' : 'border-slate-200'
            }`}>
              <div>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
                  Müşteriden Alışınız (Size Satışı)
                </span>
                <div className="text-xl font-black font-mono-num text-emerald-600 dark:text-emerald-400">
                  {formatTurkishLira(totals.totalBuy)} ₺
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider">
                  Müşteriye Satışınız (Sizden Alışı)
                </span>
                <div className={`text-xl font-black font-mono-num ${isDarkMode ? 'text-amber-300' : 'text-amber-800'}`}>
                  {formatTurkishLira(totals.totalSell)} ₺
                </div>
              </div>
            </div>

            <div className="mt-2.5 flex items-center justify-between text-xs">
              <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>
                Makas Farkı:{' '}
                <strong className={`font-mono-num ${isDarkMode ? 'text-amber-400' : 'text-amber-800'}`}>
                  {formatTurkishLira(totals.totalSell - totals.totalBuy)} ₺
                </strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={resetCalculator}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-rose-500 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" /> Sıfırla
                </button>

                <button
                  onClick={handleCopySlip}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold active:scale-95 transition-all border ${
                    isDarkMode
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                      : 'bg-blue-50 border-blue-200 text-blue-700'
                  }`}
                >
                  {copiedSlip ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" /> Fiş Kopyalandı
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" /> Fiş Çıkar / Paylaş
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Calculator Items List */}
          <div className="mt-3.5 space-y-2">
            {calcRows.map((row, idx) => {
              const item = items.find((i) => i.id === row.itemId);
              if (!item) return null;

              const isGram = item.unit === 'Gram';
              const multiplier = isGram ? (row.grams || 1) * row.count : row.count;
              const rowTotalSell = item.sellPrice * multiplier;

              return (
                <div
                  key={idx}
                  className={`rounded-xl p-3 flex flex-col gap-2 border transition-colors ${
                    isDarkMode
                      ? 'bg-[#090F1E] border-[#1A2642]'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{item.name}</h4>
                      <span className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        Birim Satış: {formatTurkishLira(item.sellPrice)} ₺
                      </span>
                    </div>

                    <div className="text-right">
                      <span className={`text-sm font-black font-mono-num ${isDarkMode ? 'text-amber-300' : 'text-amber-800'}`}>
                        {formatTurkishLira(rowTotalSell)} ₺
                      </span>
                    </div>
                  </div>

                  {/* Quantity and Grams Controls */}
                  <div className={`flex items-center justify-between pt-1 border-t ${
                    isDarkMode ? 'border-[#141F35]' : 'border-slate-100'
                  }`}>
                    {isGram ? (
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Gram:</span>
                        <input
                          type="number"
                          step="0.5"
                          min="0.1"
                          value={row.grams || 1}
                          onChange={(e) => updateGrams(idx, parseFloat(e.target.value) || 0)}
                          className={`w-16 rounded-lg px-2 py-0.5 text-xs font-bold text-center font-mono-num focus:outline-none ${
                            isDarkMode
                              ? 'bg-[#060A14] border border-[#1C2945] text-white focus:border-amber-500/50'
                              : 'bg-slate-50 border border-slate-300 text-slate-900 focus:border-blue-500'
                          }`}
                        />
                        <span className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>gr</span>
                      </div>
                    ) : (
                      <div className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        {row.count} Adet
                      </div>
                    )}

                    {/* Plus / Minus */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(idx, -1)}
                        className={`w-7 h-7 rounded-lg border flex items-center justify-center active:scale-95 ${
                          isDarkMode
                            ? 'bg-[#141F35] border-[#202E4E] text-slate-300 hover:text-white'
                            : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-950'
                        }`}
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className={`font-mono-num font-bold text-xs min-w-[20px] text-center ${
                        isDarkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        {row.count}
                      </span>
                      <button
                        onClick={() => updateQuantity(idx, 1)}
                        className={`w-7 h-7 rounded-lg border flex items-center justify-center active:scale-95 ${
                          isDarkMode
                            ? 'bg-[#141F35] border-[#202E4E] text-slate-300 hover:text-white'
                            : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-950'
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* Currency Converter View */
        <div className={`rounded-2xl p-4 mt-3 shadow-xl space-y-4 border transition-colors ${
          isDarkMode
            ? 'bg-[#090F1E] border-amber-500/25'
            : 'bg-white border-slate-200'
        }`}>
          <div>
            <label className={`text-xs font-bold block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Dönüştürülecek Tutar
            </label>
            <div className="relative">
              <input
                type="number"
                value={currencyAmount}
                onChange={(e) => setCurrencyAmount(parseFloat(e.target.value) || 0)}
                className={`w-full rounded-xl px-3 py-2.5 text-lg font-black font-mono-num focus:outline-none ${
                  isDarkMode
                    ? 'bg-[#060A14] border border-[#1E2C4A] text-amber-300 focus:border-amber-500/50'
                    : 'bg-slate-50 border border-slate-300 text-blue-700 focus:border-blue-500'
                }`}
              />
              <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`}>
                {fromCurrency}
              </span>
            </div>
          </div>

          {/* Quick Currency Selectors */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1">
              <span className={`text-[10px] block mb-1 font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>KAYNAK</span>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value as any)}
                className={`w-full rounded-xl px-3 py-2 text-xs font-bold focus:outline-none ${
                  isDarkMode
                    ? 'bg-[#0E1628] border border-[#1E2C4A] text-white'
                    : 'bg-slate-50 border border-slate-300 text-slate-900'
                }`}
              >
                <option value="TRY">TRY (Türk Lirası ₺)</option>
                <option value="USD">USD (ABD Doları $)</option>
                <option value="EUR">EUR (Euro €)</option>
                <option value="HAS">HAS (Has Altın Gram)</option>
              </select>
            </div>

            <div className="pt-4">
              <button
                onClick={() => {
                  const temp = fromCurrency;
                  setFromCurrency(toCurrency);
                  setToCurrency(temp);
                }}
                className={`w-9 h-9 rounded-xl border flex items-center justify-center active:scale-95 ${
                  isDarkMode
                    ? 'bg-[#15223C] border-[#25365C] text-amber-400 hover:text-amber-300'
                    : 'bg-slate-100 border-slate-200 text-blue-600 hover:bg-slate-200'
                }`}
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1">
              <span className={`text-[10px] block mb-1 font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>HEDEF</span>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value as any)}
                className={`w-full rounded-xl px-3 py-2 text-xs font-bold focus:outline-none ${
                  isDarkMode
                    ? 'bg-[#0E1628] border border-[#1E2C4A] text-white'
                    : 'bg-slate-50 border border-slate-300 text-slate-900'
                }`}
              >
                <option value="HAS">HAS (Has Altın Gram)</option>
                <option value="TRY">TRY (Türk Lirası ₺)</option>
                <option value="USD">USD (ABD Doları $)</option>
                <option value="EUR">EUR (Euro €)</option>
              </select>
            </div>
          </div>

          {/* Converted Result Display */}
          <div className={`rounded-xl p-4 text-center border ${
            isDarkMode
              ? 'bg-[#060A14] border-[#1A2642]'
              : 'bg-slate-50 border-slate-200'
          }`}>
            <span className={`text-xs font-medium block mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {currencyAmount} {fromCurrency} Karşılığı:
            </span>
            <div className="text-2xl font-black font-mono-num text-emerald-600 dark:text-emerald-400 tracking-tight">
              {toCurrency === 'TRY'
                ? `${formatTurkishLira(convertedResult)} ₺`
                : toCurrency === 'HAS'
                ? `${convertedResult.toFixed(3)} Gram Altın`
                : `${convertedResult.toFixed(2)} ${toCurrency}`}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
