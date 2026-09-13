import React, { useState, useEffect } from 'react';
import { RotateCw, Bell, Sun, Moon, Calendar, Clock } from 'lucide-react';
import { MarketStats, StoreConfig } from '../types';
import { BrandLogo } from './BrandLogo';

interface HeaderProps {
  marketStats?: MarketStats;
  storeConfig: StoreConfig;
  onRefresh: () => void;
  isRefreshing: boolean;
  activeAlertCount: number;
  onOpenAlerts: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenAppStoreAssets?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  storeConfig,
  onRefresh,
  isRefreshing,
  activeAlertCount,
  onOpenAlerts,
  isDarkMode,
  onToggleTheme,
  onOpenAppStoreAssets,
}) => {
  const [currentDateTime, setCurrentDateTime] = useState<Date>(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentDateTime.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    weekday: 'short',
  });

  const formattedTime = currentDateTime.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <header className="px-4 pt-2.5 pb-2 select-none">
      {/* Top Utility Row: Live Indicator on Left, Modern Clock & Date in Top-Right Corner */}
      <div className="flex items-center justify-between gap-2 mb-2.5 pb-1.5 border-b border-slate-800/40 dark:border-amber-500/15">
        {/* Left: Live Status Signal */}
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10.5px] font-semibold tracking-tight text-emerald-500 dark:text-emerald-400 truncate">
            Canlı Serbest Piyasa
          </span>
        </div>

        {/* Right Corner: Sleek Modern Live Clock & Date Capsule */}
        <div
          id="header-datetime-widget"
          className={`flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 rounded-full border backdrop-blur-md transition-all select-none shrink-0 shadow-sm ${
            isDarkMode
              ? 'bg-gradient-to-r from-[#0C1220]/95 via-[#131B2E]/95 to-[#0A0F1D]/95 border-[#C59B27]/35 text-slate-200 shadow-black/40'
              : 'bg-white/95 border-slate-200 text-slate-700 shadow-slate-200/50'
          }`}
        >
          <div className="flex items-center gap-1 text-[10.5px] font-medium text-slate-400 dark:text-slate-300">
            <Calendar className="w-3 h-3 text-amber-500 shrink-0" />
            <span className="capitalize whitespace-nowrap">{formattedDate}</span>
          </div>

          <span className="text-slate-500 dark:text-slate-600 text-xs select-none">•</span>

          <div className="flex items-center gap-1 font-mono font-bold text-xs">
            <Clock className="w-3 h-3 text-amber-500 shrink-0" />
            <span
              className={`tracking-wider whitespace-nowrap ${
                isDarkMode ? 'text-[#F5C044]' : 'text-amber-700'
              }`}
            >
              {formattedTime}
            </span>
          </div>
        </div>
      </div>

      {/* Main Brand & Action Bar: Logo completely uncrowded, Action buttons on far right */}
      <div className="flex items-center justify-between gap-3">
        {/* Left: Authentic 3D Gold Logo with generous dedicated space */}
        <div className="flex items-center shrink-0 min-w-0">
          <BrandLogo
            size="md"
            showTagline={true}
            tagline={storeConfig.tagline}
            isDarkMode={isDarkMode}
          />
        </div>

        {/* Right: Quick Action Buttons (Refresh, Alerts, Theme) */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Refresh Button */}
          <button
            id="refresh-rates-btn"
            onClick={onRefresh}
            aria-label="Fiyatları Güncelle"
            title="Canlı Kurları Yenile"
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ios-press ${
              isDarkMode
                ? 'bg-[#151D30]/80 hover:bg-[#1C2742] border border-[#253252] text-slate-300'
                : 'bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 shadow-sm'
            }`}
          >
            <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-500 dark:text-amber-400' : ''}`} />
          </button>

          {/* Bell / Alerts Button with Badge */}
          <button
            id="header-alerts-btn"
            onClick={onOpenAlerts}
            aria-label="Fiyat Alarmları"
            title="Fiyat Alarmları"
            className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all ios-press ${
              isDarkMode
                ? 'bg-[#151D30]/80 hover:bg-[#1C2742] border border-[#253252] text-slate-300'
                : 'bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 shadow-sm'
            }`}
          >
            <Bell className="w-4 h-4" />
            {activeAlertCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-[#E11D48] text-white text-[10px] font-bold flex items-center justify-center shadow-md animate-pulse">
                {activeAlertCount}
              </span>
            )}
          </button>

          {/* Theme Toggle Button */}
          <button
            id="theme-toggle-btn"
            onClick={onToggleTheme}
            aria-label="Tema Değiştir"
            title={isDarkMode ? 'Aydınlık Moda Geç' : 'Karanlık Moda Geç'}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ios-press ${
              isDarkMode
                ? 'bg-[#151D30]/80 hover:bg-[#1C2742] border border-[#253252] text-amber-300'
                : 'bg-amber-100/90 hover:bg-amber-200 border border-amber-300 text-amber-800 shadow-sm'
            }`}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
