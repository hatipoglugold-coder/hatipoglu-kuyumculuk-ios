import React, { useState, useEffect, useCallback } from 'react';
import { IosFrame } from './components/IosFrame';
import { Header } from './components/Header';
import { PriceTable } from './components/PriceTable';
import { ChartView } from './components/ChartView';
import { AlertsView } from './components/AlertsView';
import { CalculatorView } from './components/CalculatorView';
import { ContactView } from './components/ContactView';
import { AdminView } from './components/AdminView';
import { AdminAuthGate } from './components/AdminAuthGate';
import { TabBar } from './components/TabBar';
import { MarqueeTicker } from './components/MarqueeTicker';
import { AppStoreAssetsModal } from './components/AppStoreAssetsModal';
import {
  initialGoldItems,
  initialMarketStats,
  initialAlerts,
  initialStoreConfig,
} from './data/mockData';
import { GoldItem, MarketStats, PriceAlert, StoreConfig, TabType } from './types';
import { Bell, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [items, setItems] = useState<GoldItem[]>(() => {
    const saved = localStorage.getItem('hatipoglu_gold_items');
    if (saved) {
      try {
        const parsed: GoldItem[] = JSON.parse(saved);
        const filtered = parsed.filter((i) => i.id !== '14-ayar' && i.id !== '18-ayar' && i.id !== 'ata-lira');
        const orderMap = new Map(initialGoldItems.map((item, index) => [item.id, index]));
        filtered.sort((a, b) => {
          const posA = orderMap.has(a.id) ? orderMap.get(a.id)! : 999;
          const posB = orderMap.has(b.id) ? orderMap.get(b.id)! : 999;
          return posA - posB;
        });
        return filtered;
      } catch {
        return initialGoldItems;
      }
    }
    return initialGoldItems;
  });

  const [marketStats, setMarketStats] = useState<MarketStats>(() => {
    const saved = localStorage.getItem('hatipoglu_market_stats');
    return saved ? JSON.parse(saved) : initialMarketStats;
  });

  const [alerts, setAlerts] = useState<PriceAlert[]>(() => {
    const saved = localStorage.getItem('hatipoglu_alerts');
    return saved ? JSON.parse(saved) : initialAlerts;
  });

  const [storeConfig, setStoreConfig] = useState<StoreConfig>(() => {
    const saved = localStorage.getItem('hatipoglu_store_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // If it had the old default placeholder Istanbul address or phone, migrate to new Şanlıurfa details
        if (
          parsed.phone === '0 (212) 555 10 20' ||
          !parsed.phone ||
          parsed.address?.includes('Kapalıçarşı')
        ) {
          return {
            ...parsed,
            phone: '05448166660',
            whatsapp: '+90 544 816 66 60',
            address: 'EYYÜP peygamber caddesi no:122-b Şanlıurfa Eyyübiye',
          };
        }
        return parsed;
      } catch {
        return initialStoreConfig;
      }
    }
    return initialStoreConfig;
  });

  const [currentTab, setCurrentTab] = useState<TabType>('prices');
  const [selectedChartItem, setSelectedChartItem] = useState<GoldItem>(items[0]);
  const [prefilledCalcItem, setPrefilledCalcItem] = useState<GoldItem | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeToast, setActiveToast] = useState<{ title: string; message: string } | null>(null);
  const [isAppStoreModalOpen, setIsAppStoreModalOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return (
      localStorage.getItem('hatipoglu_admin_auth') === 'true' ||
      sessionStorage.getItem('hatipoglu_admin_auth') === 'true'
    );
  });

  const handleAdminLogin = (remember: boolean) => {
    setIsAdminAuthenticated(true);
    if (remember) {
      localStorage.setItem('hatipoglu_admin_auth', 'true');
    } else {
      sessionStorage.setItem('hatipoglu_admin_auth', 'true');
    }
    setActiveToast({
      title: '🛡️ YÖNETİCİ GİRİŞİ BAŞARILI',
      message: 'Yetkili oturumu açıldı. Kapalıçarşı formül motoru ve mağaza ayarları aktif.',
    });
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('hatipoglu_admin_auth');
    sessionStorage.removeItem('hatipoglu_admin_auth');
    setActiveToast({
      title: '🔒 OTURUM KAPATILDI',
      message: 'Yönetici paneli kilitlendi.',
    });
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('hatipoglu_gold_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('hatipoglu_alerts', JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem('hatipoglu_store_config', JSON.stringify(storeConfig));
  }, [storeConfig]);

  // Audio Chime helper for alerts
  const playAlertSound = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch {
      // Audio fallback
    }
  }, []);

  // Check and trigger price alerts
  const checkAlerts = useCallback((updatedItems: GoldItem[]) => {
    setAlerts((prevAlerts) => {
      let hasTriggered = false;
      const nextAlerts = prevAlerts.map((alert) => {
        if (!alert.isActive || alert.triggered) return alert;

        const currentItem = updatedItems.find((i) => i.id === alert.itemId);
        if (!currentItem) return alert;

        const currentPrice = alert.targetType === 'sell' ? currentItem.sellPrice : currentItem.buyPrice;
        const conditionMet =
          alert.direction === 'above'
            ? currentPrice >= alert.targetPrice
            : currentPrice <= alert.targetPrice;

        if (conditionMet) {
          hasTriggered = true;
          setActiveToast({
            title: `🔔 FİYAT ALARMI TETİKLENDİ: ${alert.itemName}`,
            message: `Hedeflenen ${alert.targetPrice} ₺ seviyesine ulaşıldı! (Güncel: ${currentPrice.toFixed(2)} ₺)`,
          });
          return { ...alert, triggered: true, isActive: false };
        }
        return alert;
      });

      if (hasTriggered) {
        playAlertSound();
      }

      return nextAlerts;
    });
  }, [playAlertSound]);

  // Simulated live market micro-fluctuations (every 4.5 seconds for live feel)
  useEffect(() => {
    if (storeConfig.manualMode) return;

    const interval = setInterval(() => {
      // Randomly tweak 1-2 items slightly
      setItems((prev) => {
        const next = [...prev];
        const count = Math.random() > 0.5 ? 2 : 1;

        for (let i = 0; i < count; i++) {
          const randomIdx = Math.floor(Math.random() * next.length);
          const item = next[randomIdx];

          // Decide direction: 55% up, 45% down
          const isGoingUp = Math.random() > 0.45;
          const deltaPct = (Math.random() * 0.0008 + 0.0002) * (isGoingUp ? 1 : -1);
          let newSell = Math.round(item.sellPrice * (1 + deltaPct) * 100) / 100;
          if (newSell === item.sellPrice) {
            newSell += isGoingUp ? 1 : -1;
          }
          const spread = item.sellPrice - item.buyPrice;
          const newBuy = Math.round((newSell - spread) * 100) / 100;

          next[randomIdx] = {
            ...item,
            prevSellPrice: item.sellPrice,
            prevBuyPrice: item.buyPrice,
            sellPrice: newSell,
            buyPrice: newBuy,
            isUp: newSell >= item.sellPrice,
          };
        }

        checkAlerts(next);
        return next;
      });

      // Also slight tick for ONS
      setMarketStats((prev) => {
        const onsDelta = (Math.random() - 0.48) * 0.8;
        return {
          ...prev,
          onsUsd: Math.round((prev.onsUsd + onsDelta) * 10) / 10,
        };
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [storeConfig.manualMode, checkAlerts]);

  // Refresh trigger
  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      // Apply fresh slight update
      setItems((prev) => {
        const updated = prev.map((it) => {
          const delta = (Math.random() * 0.0006 - 0.0002);
          const newSell = Math.round(it.sellPrice * (1 + delta) * 100) / 100;
          const spread = it.sellPrice - it.buyPrice;
          return {
            ...it,
            sellPrice: newSell,
            buyPrice: Math.round((newSell - spread) * 100) / 100,
          };
        });
        checkAlerts(updated);
        return updated;
      });
      setIsRefreshing(false);
      setActiveToast({
        title: 'Fiyatlar Güncellendi',
        message: 'Kapalıçarşı serbest piyasa verileri anlık senkronize edildi.',
      });
    }, 600);
  };

  // Toast auto-dismiss
  useEffect(() => {
    if (activeToast) {
      const t = setTimeout(() => setActiveToast(null), 4000);
      return () => clearTimeout(t);
    }
  }, [activeToast]);

  // Actions from PriceTable
  const handleSelectItemForChart = (item: GoldItem) => {
    setSelectedChartItem(item);
    setCurrentTab('chart');
  };

  const handleSelectItemForAlert = (item: GoldItem) => {
    setSelectedChartItem(item);
    setCurrentTab('alerts');
  };

  const handleSelectItemForCalc = (item: GoldItem) => {
    setPrefilledCalcItem(item);
    setCurrentTab('calc');
  };

  const handleToggleFavorite = (itemId: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, isFavorite: !it.isFavorite } : it))
    );
  };

  // Add Alert
  const handleAddAlert = (newAlertData: Omit<PriceAlert, 'id' | 'createdAt' | 'triggered'>) => {
    const newAlert: PriceAlert = {
      ...newAlertData,
      id: `alert-${Date.now()}`,
      triggered: false,
      createdAt: new Date().toLocaleDateString('tr-TR') + ' ' + new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    };
    setAlerts((prev) => [newAlert, ...prev]);
    setActiveToast({
      title: 'Fiyat Alarmı Kuruldu',
      message: `${newAlert.itemName} için ${newAlert.targetPrice} ₺ alarmı aktif edildi.`,
    });
  };

  const handleToggleAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, isActive: !a.isActive } : a))
    );
  };

  const handleDeleteAlert = (alertId: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
  };

  // Admin adjustments
  const handleUpdateStoreConfig = (newConfig: StoreConfig) => {
    setStoreConfig(newConfig);
    // If spread was adjusted, apply to items
    if (newConfig.spreadAdjustmentPercent !== storeConfig.spreadAdjustmentPercent) {
      const spreadFactor = 1 + newConfig.spreadAdjustmentPercent / 100;
      setItems((prev) =>
        prev.map((it) => {
          const baseSpread = it.sellPrice - it.buyPrice;
          const newSpread = baseSpread * spreadFactor;
          return {
            ...it,
            sellPrice: Math.round((it.buyPrice + newSpread) * 100) / 100,
          };
        })
      );
    }
  };

  const handleUpdateItemPrice = (itemId: string, buyPrice: number, sellPrice: number) => {
    setItems((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, buyPrice, sellPrice } : it))
    );
  };

  const handleResetDefaults = () => {
    setItems(initialGoldItems);
    setMarketStats(initialMarketStats);
    setStoreConfig(initialStoreConfig);
    setAlerts(initialAlerts);
    localStorage.removeItem('hatipoglu_gold_items');
    localStorage.removeItem('hatipoglu_market_stats');
    localStorage.removeItem('hatipoglu_store_config');
    localStorage.removeItem('hatipoglu_alerts');
    setActiveToast({
      title: 'Fabrika Ayarlarına Dönüldü',
      message: 'Orijinal görseldeki tüm altın ve döviz fiyatları geri yüklendi.',
    });
  };

  const activeAlertCount = alerts.filter((a) => a.isActive).length;

  return (
    <IosFrame isDarkMode={isDarkMode}>
      {/* Brand Header & Market Ticker */}
      <Header
        marketStats={marketStats}
        storeConfig={storeConfig}
        onRefresh={handleManualRefresh}
        isRefreshing={isRefreshing}
        activeAlertCount={activeAlertCount}
        onOpenAlerts={() => setCurrentTab('alerts')}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        onOpenAppStoreAssets={() => setIsAppStoreModalOpen(true)}
      />

      {/* Dynamic Main Body based on currentTab */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
        {currentTab === 'prices' && (
          <PriceTable
            items={items}
            onSelectItemForChart={handleSelectItemForChart}
            onSelectItemForAlert={handleSelectItemForAlert}
            onSelectItemForCalc={handleSelectItemForCalc}
            onToggleFavorite={handleToggleFavorite}
            isDarkMode={isDarkMode}
          />
        )}

        {currentTab === 'chart' && (
          <ChartView
            items={items}
            selectedItem={selectedChartItem}
            onSelectItem={(it) => setSelectedChartItem(it)}
            onSetAlert={handleSelectItemForAlert}
            isDarkMode={isDarkMode}
          />
        )}

        {currentTab === 'alerts' && (
          <AlertsView
            alerts={alerts}
            items={items}
            onAddAlert={handleAddAlert}
            onToggleAlert={handleToggleAlert}
            onDeleteAlert={handleDeleteAlert}
            initialSelectedItemId={selectedChartItem.id}
            isDarkMode={isDarkMode}
          />
        )}

        {currentTab === 'calc' && (
          <CalculatorView
            items={items}
            prefilledItem={prefilledCalcItem}
            isDarkMode={isDarkMode}
          />
        )}

        {currentTab === 'contact' && (
          <ContactView
            storeConfig={storeConfig}
            isDarkMode={isDarkMode}
          />
        )}

        {currentTab === 'admin' &&
          (!isAdminAuthenticated ? (
            <AdminAuthGate
              onSuccess={handleAdminLogin}
              onCancel={() => setCurrentTab('prices')}
              isDarkMode={isDarkMode}
            />
          ) : (
            <AdminView
              storeConfig={storeConfig}
              items={items}
              marketStats={marketStats}
              onUpdateStoreConfig={handleUpdateStoreConfig}
              onUpdateItemPrice={handleUpdateItemPrice}
              onApplyFormulaItems={(updatedItems) => {
                setItems(updatedItems);
                checkAlerts(updatedItems);
              }}
              onResetDefaults={handleResetDefaults}
              onLogout={handleAdminLogout}
              isDarkMode={isDarkMode}
              onOpenAppStoreAssets={() => setIsAppStoreModalOpen(true)}
            />
          ))}
      </main>

      {/* Floating In-App iOS Toast Notification */}
      {activeToast && (
        <div className={`absolute top-14 left-4 right-4 z-50 rounded-2xl p-3 shadow-2xl backdrop-blur-md flex items-start gap-3 animate-fadeIn select-none border transition-colors ${
          isDarkMode
            ? 'bg-[#0E1628]/95 border-amber-500/40'
            : 'bg-white/95 border-slate-200 shadow-xl'
        }`}>
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
            isDarkMode
              ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
              : 'bg-blue-50 border border-blue-200 text-blue-600'
          }`}>
            <Bell className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className={`text-xs font-bold tracking-tight ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
              {activeToast.title}
            </h4>
            <p className={`text-[11px] mt-0.5 leading-snug ${
              isDarkMode ? 'text-slate-300' : 'text-slate-600'
            }`}>
              {activeToast.message}
            </p>
          </div>
          <button
            onClick={() => setActiveToast(null)}
            className={`text-xs p-1 ${
              isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            ✕
          </button>
        </div>
      )}

      {/* En Alt Kayan Yazı / Canlı Bilgi Bandı (Marquee Ticker) */}
      <MarqueeTicker
        text={storeConfig.marqueeText}
        isDarkMode={isDarkMode}
        onEditClick={() => setCurrentTab('admin')}
      />

      {/* iOS Bottom Navigation Bar */}
      <TabBar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        activeAlertCount={activeAlertCount}
        isDarkMode={isDarkMode}
      />

      {/* Apple App Store Assets Download & Preview Modal */}
      <AppStoreAssetsModal
        isOpen={isAppStoreModalOpen}
        onClose={() => setIsAppStoreModalOpen(false)}
        isDarkMode={isDarkMode}
      />
    </IosFrame>
  );
}
