import React, { useState, useMemo } from 'react';
import { GoldItem } from '../types';
import { formatTurkishLira } from '../utils/formatters';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Bell, Calendar, Sparkles } from 'lucide-react';

interface ChartViewProps {
  items: GoldItem[];
  selectedItem: GoldItem;
  onSelectItem: (item: GoldItem) => void;
  onSetAlert: (item: GoldItem) => void;
  isDarkMode?: boolean;
}

export const ChartView: React.FC<ChartViewProps> = ({
  items,
  selectedItem,
  onSelectItem,
  onSetAlert,
  isDarkMode = true,
}) => {
  const [timeRange, setTimeRange] = useState<'1G' | '1H' | '1A' | '3A' | '1Y'>('1G');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Generate dynamic chart data based on time range and item price
  const chartPoints = useMemo(() => {
    const base = selectedItem.sellPrice;
    const count = timeRange === '1G' ? 12 : timeRange === '1H' ? 14 : timeRange === '1A' ? 20 : 24;
    
    // Seeded random walk based on item name and range
    const points: { label: string; price: number }[] = [];
    let current = base * (timeRange === '1G' ? 0.995 : timeRange === '1H' ? 0.98 : timeRange === '1A' ? 0.96 : 0.92);
    
    for (let i = 0; i < count; i++) {
      const delta = (Math.sin(i * 0.8) + (Math.random() - 0.45) * 0.8) * (base * 0.003);
      current = Math.max(current + delta, base * 0.85);
      
      let label = '';
      if (timeRange === '1G') {
        const hour = 9 + Math.floor(i * 0.8);
        label = `${hour.toString().padStart(2, '0')}:00`;
      } else if (timeRange === '1H') {
        const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cts', 'Paz'];
        label = days[i % 7];
      } else {
        label = `${i + 1} Gün`;
      }
      
      points.push({ label, price: current });
    }
    // ensure last point matches current price
    points[points.length - 1].price = base;
    return points;
  }, [selectedItem, timeRange]);

  const prices = chartPoints.map((p) => p.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice || 1;

  const activePoint = hoverIndex !== null ? chartPoints[hoverIndex] : chartPoints[chartPoints.length - 1];
  const isPositive = selectedItem.changeRate >= 0;

  // SVG Coordinates
  const width = 360;
  const height = 180;
  const paddingX = 15;
  const paddingY = 20;

  const svgPath = useMemo(() => {
    if (chartPoints.length === 0) return '';
    const stepX = (width - paddingX * 2) / (chartPoints.length - 1);
    const usableHeight = height - paddingY * 2;

    const points = chartPoints.map((pt, i) => {
      const x = paddingX + i * stepX;
      const y = height - paddingY - ((pt.price - minPrice) / priceRange) * usableHeight;
      return `${x},${y}`;
    });

    return `M ${points.join(' L ')}`;
  }, [chartPoints, minPrice, priceRange]);

  const svgArea = useMemo(() => {
    if (!svgPath) return '';
    return `${svgPath} L ${width - paddingX},${height} L ${paddingX},${height} Z`;
  }, [svgPath]);

  return (
    <div className={`flex-1 flex flex-col overflow-y-auto no-scrollbar px-3.5 py-2.5 pb-16 transition-colors ${
      isDarkMode ? 'text-slate-100' : 'text-slate-800'
    }`}>
      {/* Item Selector Dropdown / Scroll Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2">
        {items.map((it) => (
          <button
            key={it.id}
            onClick={() => onSelectItem(it)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ios-press ${
              it.id === selectedItem.id
                ? isDarkMode
                  ? 'bg-gradient-to-r from-amber-500/30 to-amber-600/30 border border-amber-400 text-amber-200 shadow-md shadow-amber-950/40'
                  : 'bg-blue-50 border border-blue-300 text-blue-700 shadow-xs'
                : isDarkMode
                ? 'bg-[#0F1626] border border-[#1A253D] text-slate-400 hover:text-slate-200'
                : 'bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            {it.shortName || it.name}
          </button>
        ))}
      </div>

      {/* Selected Item Hero Header */}
      <div className={`rounded-2xl p-3.5 mt-1 shadow-xl transition-colors border ${
        isDarkMode
          ? 'bg-[#090F1E] border-amber-500/20'
          : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <div className={`flex items-center gap-1.5 text-xs font-cinzel font-bold ${
              isDarkMode ? 'text-amber-400/90' : 'text-blue-600'
            }`}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>{selectedItem.category === 'currency' ? 'DÖVİZ KURU' : 'CANLI ALTIN FİYATI'}</span>
            </div>
            <h2 className={`text-xl font-black tracking-tight mt-0.5 font-cinzel ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
              {selectedItem.name}
            </h2>
          </div>

          <button
            onClick={() => onSetAlert(selectedItem)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold active:scale-95 transition-all border ${
              isDarkMode
                ? 'bg-[#162238] border-amber-500/30 text-amber-300 hover:bg-[#1D2C4A]'
                : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Alarm Kur</span>
          </button>
        </div>

        {/* Dynamic Display Price with Active Scrub Support */}
        <div className="mt-3 flex items-baseline justify-between">
          <div>
            <div className={`text-[10px] font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {hoverIndex !== null ? `Seçili Nokta: ${activePoint.label}` : 'Canlı Satış Fiyatı'}
            </div>
            <div className={`text-2xl font-black font-mono-num tracking-tight ${
              isDarkMode ? 'text-amber-300' : 'text-amber-800'
            }`}>
              {formatTurkishLira(activePoint.price)} ₺
            </div>
          </div>

          <div className="text-right">
            <div className={`text-[10px] font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Değişim Oranı</div>
            <div
              className={`flex items-center justify-end text-sm font-black font-mono-num ${
                isPositive
                  ? isDarkMode ? 'text-emerald-400' : 'text-emerald-700'
                  : isDarkMode ? 'text-rose-400' : 'text-rose-600'
              }`}
            >
              {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              <span>{isPositive ? '+' : ''}%{selectedItem.changeRate.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className={`flex items-center justify-between gap-1 p-1 rounded-xl mt-3 border transition-colors ${
          isDarkMode
            ? 'bg-[#060A14] border-[#162238]'
            : 'bg-slate-100 border-slate-200'
        }`}>
          {(['1G', '1H', '1A', '3A', '1Y'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`flex-1 py-1 rounded-lg text-xs font-bold transition-all ${
                timeRange === range
                  ? isDarkMode
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'bg-white text-blue-700 shadow-xs border border-blue-200'
                  : isDarkMode
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {range}
            </button>
          ))}
        </div>

        {/* Interactive Chart Area */}
        <div className="relative mt-4 w-full h-[180px] select-none">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full overflow-visible"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="goldChartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.45" />
                <stop offset="60%" stopColor="#D97706" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#B45309" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            <line x1="0" y1={paddingY} x2={width} y2={paddingY} stroke={isDarkMode ? '#1A253D' : '#E2E8F0'} strokeDasharray="3 3" />
            <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke={isDarkMode ? '#1A253D' : '#E2E8F0'} strokeDasharray="3 3" />
            <line x1="0" y1={height - paddingY} x2={width} y2={height - paddingY} stroke={isDarkMode ? '#1A253D' : '#E2E8F0'} strokeDasharray="3 3" />

            {/* Area Fill */}
            <path d={svgArea} fill="url(#goldChartGradient)" />

            {/* Stroke Line */}
            <path
              d={svgPath}
              fill="none"
              stroke="#F59E0B"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Interactive Data Points on Touch / Hover */}
            {chartPoints.map((pt, i) => {
              const stepX = (width - paddingX * 2) / (chartPoints.length - 1);
              const x = paddingX + i * stepX;
              const y = height - paddingY - ((pt.price - minPrice) / priceRange) * (height - paddingY * 2);
              const isHovered = hoverIndex === i || (hoverIndex === null && i === chartPoints.length - 1);

              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r={isHovered ? 4.5 : 2}
                  fill={isHovered ? '#FCD34D' : '#F59E0B'}
                  stroke={isDarkMode ? '#090F1E' : '#FFFFFF'}
                  strokeWidth={isHovered ? 2 : 1}
                  className="transition-all cursor-pointer"
                  onMouseEnter={() => setHoverIndex(i)}
                  onTouchStart={() => setHoverIndex(i)}
                />
              );
            })}
          </svg>
        </div>

        {/* Min / Max labels */}
        <div className={`flex items-center justify-between text-[10px] mt-2 px-1 font-mono-num ${
          isDarkMode ? 'text-slate-400' : 'text-slate-500'
        }`}>
          <span>Min: {formatTurkishLira(minPrice)} ₺</span>
          <span>Ort: {formatTurkishLira((minPrice + maxPrice) / 2)} ₺</span>
          <span>Max: {formatTurkishLira(maxPrice)} ₺</span>
        </div>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-2 gap-2.5 mt-3">
        {/* Alış & Satış Karşılaştırması */}
        <div className={`rounded-xl p-3 border transition-colors ${
          isDarkMode ? 'bg-[#090F1E] border-[#18233C]' : 'bg-white border-slate-200'
        }`}>
          <span className={`text-[10px] font-medium block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Kuyumcu Alış</span>
          <span className="font-mono-num text-sm font-bold text-emerald-600 dark:text-emerald-400">
            {formatTurkishLira(selectedItem.buyPrice)} ₺
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">Müşteriden Alınan</span>
        </div>

        <div className={`rounded-xl p-3 border transition-colors ${
          isDarkMode ? 'bg-[#090F1E] border-[#18233C]' : 'bg-white border-slate-200'
        }`}>
          <span className={`text-[10px] font-medium block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Kuyumcu Satış</span>
          <span className={`font-mono-num text-sm font-bold ${isDarkMode ? 'text-amber-300' : 'text-amber-800'}`}>
            {formatTurkishLira(selectedItem.sellPrice)} ₺
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">Müşteriye Satılan</span>
        </div>

        <div className={`rounded-xl p-3 border transition-colors ${
          isDarkMode ? 'bg-[#090F1E] border-[#18233C]' : 'bg-white border-slate-200'
        }`}>
          <span className={`text-[10px] font-medium block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Makas Farkı (Spread)</span>
          <span className="font-mono-num text-sm font-bold text-amber-600 dark:text-amber-400">
            {formatTurkishLira(selectedItem.sellPrice - selectedItem.buyPrice)} ₺
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">
            %{(((selectedItem.sellPrice - selectedItem.buyPrice) / selectedItem.buyPrice) * 100).toFixed(2)} Fark
          </span>
        </div>

        <div className={`rounded-xl p-3 border transition-colors ${
          isDarkMode ? 'bg-[#090F1E] border-[#18233C]' : 'bg-white border-slate-200'
        }`}>
          <span className={`text-[10px] font-medium block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Günlük Aralık</span>
          <div className="flex items-center gap-1 text-[11px] font-mono-num text-slate-700 dark:text-slate-300 mt-0.5">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{formatTurkishLira(minPrice)}</span>
            <span>-</span>
            <span className="text-amber-600 dark:text-amber-400 font-bold">{formatTurkishLira(maxPrice)}</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">Son 24 Saat</span>
        </div>
      </div>
    </div>
  );
};
