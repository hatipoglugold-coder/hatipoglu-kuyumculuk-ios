import React, { useState } from 'react';
import { Bell, Plus, Trash2, CheckCircle2, AlertTriangle, ArrowUpRight, ArrowDownRight, Volume2, Sparkles } from 'lucide-react';
import { GoldItem, PriceAlert } from '../types';
import { formatTurkishLira } from '../utils/formatters';

interface AlertsViewProps {
  alerts: PriceAlert[];
  items: GoldItem[];
  onAddAlert: (newAlert: Omit<PriceAlert, 'id' | 'createdAt' | 'triggered'>) => void;
  onToggleAlert: (alertId: string) => void;
  onDeleteAlert: (alertId: string) => void;
  initialSelectedItemId?: string;
  isDarkMode?: boolean;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  alerts,
  items,
  onAddAlert,
  onToggleAlert,
  onDeleteAlert,
  initialSelectedItemId,
  isDarkMode = true,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string>(initialSelectedItemId || items[0]?.id || '');
  const [targetType, setTargetType] = useState<'buy' | 'sell'>('sell');
  const [direction, setDirection] = useState<'above' | 'below'>('above');
  const [targetPrice, setTargetPrice] = useState<number>(() => {
    const current = items.find((i) => i.id === selectedItemId)?.sellPrice || 6850;
    return Math.round(current * 1.01);
  });
  const [testNotificationSent, setTestNotificationSent] = useState(false);

  const selectedItem = items.find((i) => i.id === selectedItemId) || items[0];

  const handleItemChange = (itemId: string) => {
    setSelectedItemId(itemId);
    const item = items.find((i) => i.id === itemId);
    if (item) {
      const base = targetType === 'sell' ? item.sellPrice : item.buyPrice;
      setTargetPrice(direction === 'above' ? Math.round(base * 1.01) : Math.round(base * 0.99));
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || targetPrice <= 0) return;

    onAddAlert({
      itemId: selectedItem.id,
      itemName: selectedItem.name,
      targetType,
      direction,
      targetPrice,
      currentPrice: targetType === 'sell' ? selectedItem.sellPrice : selectedItem.buyPrice,
      isActive: true,
    });

    setShowAddModal(false);
  };

  const playChime = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);

      setTestNotificationSent(true);
      setTimeout(() => setTestNotificationSent(false), 2500);
    } catch {
      // Audio fallback
    }
  };

  return (
    <div className={`flex-1 flex flex-col overflow-y-auto no-scrollbar px-3.5 py-2.5 pb-16 transition-colors ${
      isDarkMode ? 'text-slate-100' : 'text-slate-800'
    }`}>
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <span className={`text-[11px] font-cinzel font-bold tracking-wider flex items-center gap-1 ${
            isDarkMode ? 'text-amber-400' : 'text-blue-600'
          }`}>
            <Sparkles className="w-3 h-3" /> FİYAT UYARILARI
          </span>
          <h2 className={`text-lg font-black tracking-tight ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}>
            Canlı Takip Alarmları
          </h2>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-xl text-xs shadow-md active:scale-95 transition-all ios-press"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Alarm</span>
        </button>
      </div>

      {/* Summary Banner */}
      <div className={`rounded-xl p-3 mt-3 flex items-center justify-between border transition-colors ${
        isDarkMode
          ? 'bg-[#090F1E] border-amber-500/20'
          : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            isDarkMode ? 'bg-amber-500/10 border border-amber-500/30 text-amber-300' : 'bg-blue-50 border border-blue-200 text-blue-600'
          }`}>
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <div className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {alerts.filter((a) => a.isActive).length} Aktif Alarm Kurulu
            </div>
            <div className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Hedef fiyata ulaşıldığında anlık bildirim ve ses çalar
            </div>
          </div>
        </div>

        <button
          onClick={playChime}
          title="Ses Bildirimini Test Et"
          className={`p-2 rounded-lg border active:scale-95 transition-all ${
            isDarkMode
              ? 'bg-[#141F35] border-[#223253] text-amber-300 hover:text-amber-200'
              : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900'
          }`}
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>

      {testNotificationSent && (
        <div className="mt-2 bg-emerald-500/15 border border-emerald-500/40 rounded-lg p-2 text-emerald-500 dark:text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Test bildirimi ve zil sesi başarıyla çalındı!</span>
        </div>
      )}

      {/* Alerts List */}
      <div className="mt-3.5 space-y-2.5">
        {alerts.length === 0 ? (
          <div className={`rounded-xl p-8 text-center border ${
            isDarkMode ? 'bg-[#090F1E] border-[#17243E]' : 'bg-white border-slate-200'
          }`}>
            <Bell className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <p className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Henüz kurulu bir fiyat alarmınız yok.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-3 px-4 py-1.5 bg-amber-500/20 border border-amber-500/40 text-amber-600 dark:text-amber-300 rounded-xl text-xs font-semibold"
            >
              İlk Alarmını Kur
            </button>
          </div>
        ) : (
          alerts.map((alert) => {
            const currentItem = items.find((i) => i.id === alert.itemId);
            const liveCurrentPrice = currentItem
              ? alert.targetType === 'sell'
                ? currentItem.sellPrice
                : currentItem.buyPrice
              : alert.currentPrice;

            const diff = alert.targetPrice - liveCurrentPrice;
            const diffPercent = ((diff / liveCurrentPrice) * 100).toFixed(1);

            return (
              <div
                key={alert.id}
                className={`border rounded-2xl p-3.5 transition-all ${
                  isDarkMode ? 'bg-[#090F1E]' : 'bg-white'
                } ${
                  alert.isActive
                    ? isDarkMode
                      ? 'border-amber-500/30 shadow-md shadow-amber-950/20'
                      : 'border-blue-300 shadow-sm'
                    : isDarkMode
                    ? 'border-[#18233C] opacity-60'
                    : 'border-slate-200 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                        alert.direction === 'above'
                          ? 'bg-emerald-500/15 text-emerald-500 dark:text-emerald-400'
                          : 'bg-rose-500/15 text-rose-500 dark:text-rose-400'
                      }`}
                    >
                      {alert.direction === 'above' ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4" />
                      )}
                    </div>

                    <div>
                      <h4 className={`text-sm font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {alert.itemName}
                      </h4>
                      <span className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        {alert.targetType === 'sell' ? 'Satış Fiyatı' : 'Alış Fiyatı'} •{' '}
                        {alert.direction === 'above' ? 'Üzerine çıkarsa' : 'Altına düşerse'}
                      </span>
                    </div>
                  </div>

                  {/* Toggle & Delete */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onToggleAlert(alert.id)}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                        alert.isActive ? 'bg-amber-500' : 'bg-slate-400 dark:bg-slate-700'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          alert.isActive ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>

                    <button
                      onClick={() => onDeleteAlert(alert.id)}
                      className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                      title="Alarmı Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Price Comparisons */}
                <div className={`mt-3 grid grid-cols-2 gap-2 p-2.5 rounded-xl border ${
                  isDarkMode ? 'bg-[#060A14] border-[#162238]' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div>
                    <span className={`text-[10px] block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Şu Anki Fiyat</span>
                    <span className={`font-mono-num text-xs font-extrabold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                      {formatTurkishLira(liveCurrentPrice)} ₺
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-amber-600 dark:text-amber-300 block">Hedef Fiyat</span>
                    <span className="font-mono-num text-sm font-black text-amber-600 dark:text-amber-300">
                      {formatTurkishLira(alert.targetPrice)} ₺
                    </span>
                  </div>
                </div>

                {/* Status bar */}
                <div className={`mt-2 flex items-center justify-between text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  <span>
                    Hedefe Kalan:{' '}
                    <strong className={diff > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}>
                      {formatTurkishLira(Math.abs(diff))} ₺ ({diffPercent}%)
                    </strong>
                  </span>
                  <span>{alert.createdAt}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* New Alert Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className={`w-full max-w-sm rounded-2xl p-4 shadow-2xl border ${
              isDarkMode
                ? 'bg-[#0E1628] border-amber-500/30'
                : 'bg-white border-slate-200'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`flex items-center justify-between border-b pb-2.5 ${
              isDarkMode ? 'border-[#1E2C4A]' : 'border-slate-200'
            }`}>
              <div className="flex items-center gap-2">
                <Bell className={`w-5 h-5 ${isDarkMode ? 'text-amber-400' : 'text-blue-600'}`} />
                <h3 className={`text-sm font-bold font-cinzel ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Yeni Fiyat Alarmı Kur
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className={`text-xs ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-3 space-y-3">
              {/* Product Selector */}
              <div>
                <label className={`text-[11px] font-bold block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Ürün Türü Seçin
                </label>
                <select
                  value={selectedItemId}
                  onChange={(e) => handleItemChange(e.target.value)}
                  className={`w-full rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none ${
                    isDarkMode
                      ? 'bg-[#080D1A] border border-[#1E2C4A] text-white focus:border-amber-500/50'
                      : 'bg-slate-50 border border-slate-300 text-slate-900 focus:border-blue-500'
                  }`}
                >
                  {items.map((it) => (
                    <option key={it.id} value={it.id}>
                      {it.name} ({formatTurkishLira(it.sellPrice)} ₺)
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Type (Alış / Satış) */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTargetType('buy')}
                  className={`py-1.5 text-xs font-bold rounded-xl border transition-all ${
                    targetType === 'buy'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-600 dark:text-emerald-300'
                      : isDarkMode
                      ? 'bg-[#080D1A] border-[#1E2C4A] text-slate-400'
                      : 'bg-slate-50 border-slate-300 text-slate-600'
                  }`}
                >
                  Alış Fiyatı (₺)
                </button>
                <button
                  type="button"
                  onClick={() => setTargetType('sell')}
                  className={`py-1.5 text-xs font-bold rounded-xl border transition-all ${
                    targetType === 'sell'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-700 dark:text-amber-300'
                      : isDarkMode
                      ? 'bg-[#080D1A] border-[#1E2C4A] text-slate-400'
                      : 'bg-slate-50 border-slate-300 text-slate-600'
                  }`}
                >
                  Satış Fiyatı (₺)
                </button>
              </div>

              {/* Direction: Üzerine Çıkarsa / Altına Düşerse */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDirection('above')}
                  className={`flex items-center justify-center gap-1 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                    direction === 'above'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-600 dark:text-emerald-300'
                      : isDarkMode
                      ? 'bg-[#080D1A] border-[#1E2C4A] text-slate-400'
                      : 'bg-slate-50 border-slate-300 text-slate-600'
                  }`}
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  Üzerine Çıkınca
                </button>
                <button
                  type="button"
                  onClick={() => setDirection('below')}
                  className={`flex items-center justify-center gap-1 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                    direction === 'below'
                      ? 'bg-rose-500/20 border-rose-500 text-rose-600 dark:text-rose-300'
                      : isDarkMode
                      ? 'bg-[#080D1A] border-[#1E2C4A] text-slate-400'
                      : 'bg-slate-50 border-slate-300 text-slate-600'
                  }`}
                >
                  <ArrowDownRight className="w-3.5 h-3.5" />
                  Altına İnince
                </button>
              </div>

              {/* Target Price input */}
              <div>
                <label className={`text-[11px] font-bold block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Hedef Fiyat (₺)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(parseFloat(e.target.value) || 0)}
                  className={`w-full rounded-xl px-3 py-2 text-sm font-bold font-mono-num focus:outline-none ${
                    isDarkMode
                      ? 'bg-[#080D1A] border border-[#1E2C4A] text-amber-300 focus:border-amber-500/50'
                      : 'bg-slate-50 border border-slate-300 text-amber-800 focus:border-blue-500'
                  }`}
                  required
                />
                {/* Quick increment buttons */}
                <div className="flex gap-1.5 mt-1.5">
                  {[10, 50, 100, 250].map((inc) => (
                    <button
                      key={inc}
                      type="button"
                      onClick={() => setTargetPrice((prev) => prev + (direction === 'above' ? inc : -inc))}
                      className={`flex-1 py-1 text-[10px] font-bold rounded-lg ${
                        isDarkMode
                          ? 'bg-[#152035] text-slate-300 hover:text-white'
                          : 'bg-slate-100 text-slate-700 hover:text-slate-900'
                      }`}
                    >
                      {direction === 'above' ? `+${inc}₺` : `-${inc}₺`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-xl text-xs shadow-lg active:scale-95 transition-all mt-2"
              >
                Alarmı Kaydet ve Başlat
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
