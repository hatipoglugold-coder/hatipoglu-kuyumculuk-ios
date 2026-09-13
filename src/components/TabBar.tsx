import React from 'react';
import { Layers, TrendingUp, Bell, Calculator, Phone, ShieldCheck } from 'lucide-react';
import { TabType } from '../types';

interface TabBarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  activeAlertCount: number;
  isDarkMode?: boolean;
}

export const TabBar: React.FC<TabBarProps> = ({
  currentTab,
  onSelectTab,
  activeAlertCount,
  isDarkMode = true,
}) => {
  const tabs = [
    {
      id: 'prices' as TabType,
      label: 'Fiyatlar',
      icon: Layers,
    },
    {
      id: 'chart' as TabType,
      label: 'Grafik',
      icon: TrendingUp,
    },
    {
      id: 'alerts' as TabType,
      label: 'Alarmlar',
      icon: Bell,
      badge: activeAlertCount > 0 ? activeAlertCount : undefined,
    },
    {
      id: 'calc' as TabType,
      label: 'Hesapla',
      icon: Calculator,
    },
    {
      id: 'contact' as TabType,
      label: 'İletişim',
      icon: Phone,
    },
    {
      id: 'admin' as TabType,
      label: 'Yönetici',
      icon: ShieldCheck,
    },
  ];

  return (
    <nav className={`relative z-30 backdrop-blur-xl pt-2 pb-1.5 px-2 select-none transition-colors ${
      isDarkMode
        ? 'bg-[#060A14]/95 border-t border-[#1C160F]'
        : 'bg-white/95 border-t border-slate-200 shadow-lg'
    }`}>
      <div className="flex items-center justify-around gap-0.5 sm:gap-1 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          const IconComponent = tab.icon;

          return (
            <button
              key={tab.id}
              id={`tab-btn-${tab.id}`}
              onClick={() => onSelectTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-0.5 sm:px-1 rounded-2xl transition-all relative ios-press ${
                isActive
                  ? isDarkMode
                    ? 'bg-gradient-to-b from-[#241A0B] to-[#161005] border border-[#C59B27]/50 shadow-inner'
                    : 'bg-blue-50 border border-blue-200 shadow-xs'
                  : isDarkMode
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {/* Badge for Alerts */}
              {tab.badge !== undefined && (
                <span className="absolute top-0 right-1.5 sm:right-3 min-w-[17px] h-[17px] px-1 bg-[#E11D48] text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {tab.badge}
                </span>
              )}

              <IconComponent
                className={`w-4 h-4 sm:w-5 sm:h-5 mb-0.5 transition-transform ${
                  isActive
                    ? isDarkMode
                      ? 'text-[#F5C044] scale-105'
                      : 'text-blue-600 scale-105'
                    : isDarkMode
                    ? 'text-slate-400'
                    : 'text-slate-400'
                }`}
              />

              <span
                className={`text-[10px] sm:text-[11px] font-semibold tracking-tight transition-colors whitespace-nowrap ${
                  isActive
                    ? isDarkMode
                      ? 'text-[#F5C044] font-bold'
                      : 'text-blue-600 font-bold'
                    : isDarkMode
                    ? 'text-slate-400'
                    : 'text-slate-500'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* iOS Home Indicator Line */}
      <div className={`w-32 h-[4px] rounded-full mx-auto mt-2 mb-0.5 ${
        isDarkMode ? 'bg-slate-600/40' : 'bg-slate-300'
      }`}></div>
    </nav>
  );
};
