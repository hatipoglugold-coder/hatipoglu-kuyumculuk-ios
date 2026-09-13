import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Smartphone, Maximize2 } from 'lucide-react';

interface IosFrameProps {
  children: React.ReactNode;
  isDarkMode: boolean;
}

export const IosFrame: React.FC<IosFrameProps> = ({ children, isDarkMode }) => {
  const [usePhoneFrame, setUsePhoneFrame] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<string>(() => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const mins = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${mins}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-center p-0 sm:p-4 transition-colors duration-300 ${
      isDarkMode ? 'bg-[#03060C]' : 'bg-[#EBF0F7]'
    }`}>
      {/* Desktop Helper Bar to toggle Phone Frame vs Full Screen */}
      <div className={`hidden sm:flex items-center gap-3 mb-3 px-4 py-1.5 rounded-full shadow-lg text-xs font-semibold transition-colors ${
        isDarkMode
          ? 'bg-[#0A101D] border border-amber-500/20 text-slate-300'
          : 'bg-white border border-slate-300 text-slate-700 shadow-sm'
      }`}>
        <span className={`flex items-center gap-1.5 ${isDarkMode ? 'text-amber-300' : 'text-blue-600'}`}>
          <Smartphone className="w-3.5 h-3.5" />
          <span>Hatipoğlu Kuyumculuk • iOS Deneyimi</span>
        </span>
        <span className={isDarkMode ? 'text-slate-600' : 'text-slate-300'}>|</span>
        <button
          onClick={() => setUsePhoneFrame(!usePhoneFrame)}
          className={`flex items-center gap-1 transition-colors ${
            isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Maximize2 className="w-3 h-3" />
          <span>{usePhoneFrame ? 'Genişletilmiş Ekran' : 'iPhone Çerçevesi'}</span>
        </button>
      </div>

      {/* Main Container - either constrained iPhone or Full screen on mobile */}
      <div
        className={`w-full flex flex-col transition-all duration-300 ${
          usePhoneFrame
            ? `sm:max-w-[420px] sm:h-[880px] sm:max-h-[92vh] sm:rounded-[50px] sm:border-[10px] relative overflow-hidden ${
                isDarkMode
                  ? 'sm:border-[#1E2536] sm:shadow-[0_25px_70px_rgba(0,0,0,0.85)]'
                  : 'sm:border-slate-300 sm:shadow-[0_25px_60px_rgba(0,0,0,0.15)]'
              }`
            : `max-w-2xl min-h-screen sm:min-h-[850px] sm:rounded-3xl sm:border overflow-hidden ${
                isDarkMode ? 'sm:border-amber-500/20' : 'sm:border-slate-200'
              }`
        } ${isDarkMode ? 'bg-[#060A14]' : 'bg-[#FAFCFF]'}`}
      >
        {/* iOS Native Status Bar */}
        <div className={`w-full pt-2.5 px-6 pb-1 flex items-center justify-between text-xs font-semibold select-none z-40 shrink-0 transition-colors ${
          isDarkMode ? 'text-slate-200' : 'text-slate-800'
        }`}>
          {/* Time */}
          <span className={`font-mono-num font-bold text-[13px] tracking-tight ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}>
            {currentTime}
          </span>

          {/* Dynamic Island on iPhone frame */}
          {usePhoneFrame && (
            <div className="w-24 h-5 bg-black rounded-full mx-auto hidden sm:flex items-center justify-end px-2.5 gap-1.5 border border-white/5">
              <span className="w-2 h-2 rounded-full bg-[#111] border border-blue-900/60"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 animate-pulse"></span>
            </div>
          )}

          {/* Status Icons: 5G, Wifi, Battery */}
          <div className="flex items-center gap-1.5">
            <span className={`text-[10px] font-black tracking-tighter ${
              isDarkMode ? 'text-slate-300' : 'text-slate-700'
            }`}>5G</span>
            <Wifi className={`w-3.5 h-3.5 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`} />
            <div className="flex items-center gap-0.5">
              <span className={`text-[10px] font-bold font-mono-num ${
                isDarkMode ? 'text-slate-300' : 'text-slate-700'
              }`}>98%</span>
              <BatteryMedium className="w-4 h-4 text-emerald-500" />
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
          {children}
        </div>
      </div>
    </div>
  );
};
