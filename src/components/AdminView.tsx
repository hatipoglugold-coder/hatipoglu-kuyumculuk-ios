import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Sliders,
  RefreshCw,
  Save,
  Phone,
  Sparkles,
  Check,
  Calculator,
  Binary,
  Layers,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  LogOut,
  RotateCcw,
  Info,
  DollarSign,
  Download,
  Smartphone,
  Apple,
  Github,
  UploadCloud,
  Megaphone,
  Volume2,
  Key,
  Lock,
  User,
  Eye,
  EyeOff,
} from 'lucide-react';
import { GoldItem, StoreConfig, MarketStats } from '../types';
import { formatTurkishLira } from '../utils/formatters';
import {
  JewelryFormulaConfig,
  defaultFormulaConfig,
  calculatePricesFromFormula,
  MultiplierFormulaCard,
  defaultMultiplierCards,
} from '../utils/jewelryFormula';
import {
  getAdminCredentials,
  saveAdminCredentials,
  resetAdminCredentials,
} from '../utils/adminAuth';
import { MobileExportSection } from './MobileExportSection';
import { GitHubSyncModal } from './GitHubSyncModal';
import { BrandLogo } from './BrandLogo';

interface AdminViewProps {
  storeConfig: StoreConfig;
  items: GoldItem[];
  marketStats?: MarketStats;
  onUpdateStoreConfig: (newConfig: StoreConfig) => void;
  onUpdateItemPrice: (itemId: string, buyPrice: number, sellPrice: number) => void;
  onApplyFormulaItems?: (updatedItems: GoldItem[]) => void;
  onResetDefaults: () => void;
  onLogout?: () => void;
  isDarkMode?: boolean;
  onOpenAppStoreAssets?: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  storeConfig,
  items,
  marketStats,
  onUpdateStoreConfig,
  onUpdateItemPrice,
  onApplyFormulaItems,
  onResetDefaults,
  onLogout,
  isDarkMode = true,
  onOpenAppStoreAssets,
}) => {
  const [configForm, setConfigForm] = useState<StoreConfig>(storeConfig);
  const [selectedItemId, setSelectedItemId] = useState<string>(items[0]?.id || '');
  const [editBuy, setEditBuy] = useState<number>(items[0]?.buyPrice || 0);
  const [editSell, setEditSell] = useState<number>(items[0]?.sellPrice || 0);
  const [savedBanner, setSavedBanner] = useState<string | null>(null);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);

  // Admin Credentials State (Kullanıcı Adı & Şifre Değiştirme)
  const [adminCreds, setAdminCreds] = useState(() => getAdminCredentials());
  const [newUsername, setNewUsername] = useState(adminCreds.username);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [credError, setCredError] = useState<string | null>(null);
  const [credSuccess, setCredSuccess] = useState<string | null>(null);

  // Jewelry Formula Multipliers State (matching IMG_0568.jpeg)
  const [formulaConfig, setFormulaConfig] = useState<JewelryFormulaConfig>(() => {
    const saved = localStorage.getItem('hatipoglu_formula_config_v2');
    if (saved) {
      try {
        const parsed: JewelryFormulaConfig = JSON.parse(saved);
        parsed.cards = (parsed.cards || []).filter(
          (c) =>
            c.id !== 'yeni-ata' &&
            c.id !== '14-ayar' &&
            c.id !== 'gremse' &&
            c.targetItemId !== 'ata-lira' &&
            c.targetItemId !== '14-ayar' &&
            c.targetItemId !== 'gremse'
        );
        const hasHurda = parsed.cards.some((c) => c.id === '22-ayar-hurda' || c.targetItemId === '22-ayar-hurda');
        if (!hasHurda) {
          const hurdaDefault = defaultMultiplierCards.find((c) => c.id === '22-ayar-hurda');
          if (hurdaDefault) {
            parsed.cards.push(hurdaDefault);
          }
        }
        return parsed;
      } catch {
        return defaultFormulaConfig;
      }
    }
    return {
      ...defaultFormulaConfig,
      onsUsd: marketStats?.onsUsd || defaultFormulaConfig.onsUsd,
      usdTry: marketStats?.usdTry || defaultFormulaConfig.usdTry,
      eurTry: marketStats?.eurTry || defaultFormulaConfig.eurTry,
    };
  });

  const [showFormulaDetails, setShowFormulaDetails] = useState(true);

  // Active item for manual price edit
  const activeItem = items.find((i) => i.id === selectedItemId) || items[0];

  // Dynamic formula calculation result based on Grand Bazaar has multipliers
  const formulaResult = useMemo(() => {
    return calculatePricesFromFormula(formulaConfig, marketStats, items);
  }, [formulaConfig, marketStats, items]);

  const handleItemSelect = (id: string) => {
    setSelectedItemId(id);
    const item = items.find((i) => i.id === id);
    if (item) {
      setEditBuy(item.buyPrice);
      setEditSell(item.sellPrice);
    }
  };

  const handleSaveManualPrice = () => {
    onUpdateItemPrice(selectedItemId, editBuy, editSell);
    setSavedBanner(`${activeItem?.name || 'Ürün'} fiyatı başarıyla güncellendi!`);
    setTimeout(() => setSavedBanner(null), 2500);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStoreConfig(configForm);
    setSavedBanner('Mağaza iletişim ve başlık bilgileri kaydedildi!');
    setTimeout(() => setSavedBanner(null), 2500);
  };

  // Update a single formula card's multiplier
  const handleUpdateCardMultiplier = (
    cardId: string,
    field: 'buyMultiplier' | 'sellMultiplier',
    val: number
  ) => {
    setFormulaConfig((prev) => {
      const updatedCards = prev.cards.map((c) => {
        if (c.id === cardId) {
          const newCard = { ...c, [field]: val };
          // Update badge
          const buyStr = (field === 'buyMultiplier' ? val : c.buyMultiplier).toString().replace('.', ',');
          const sellStr = (field === 'sellMultiplier' ? val : c.sellMultiplier).toString().replace('.', ',');
          newCard.badge = `A: ×${buyStr} | S: ×${sellStr}`;
          if (field === 'buyMultiplier') {
            newCard.buyFormulaText = `Alış × ${val}`;
          } else {
            newCard.sellFormulaText = `Satış × ${val}`;
          }
          return newCard;
        }
        return c;
      });
      const nextConfig = { ...prev, cards: updatedCards };
      localStorage.setItem('hatipoglu_formula_config_v2', JSON.stringify(nextConfig));
      return nextConfig;
    });
  };

  // Apply calculated formula prices to store items
  const handleApplyFormulaToStore = () => {
    if (!onApplyFormulaItems) return;

    // Has Altın is updated to the effective Has Altın buy & sell
    const updatedItems = items.map((storeIt) => {
      if (storeIt.id === 'has-altin') {
        const newBuy = formulaResult.effectiveHasBuy;
        const newSell = formulaResult.effectiveHasSell;
        return {
          ...storeIt,
          prevBuyPrice: storeIt.buyPrice,
          prevSellPrice: storeIt.sellPrice,
          buyPrice: newBuy,
          sellPrice: newSell,
          isUp: newSell >= storeIt.sellPrice,
        };
      }

      // Check if formula card matches this item
      const formulaMatch = formulaResult.calculatedItems.find((fi) => fi.targetItemId === storeIt.id);
      if (formulaMatch) {
        return {
          ...storeIt,
          prevBuyPrice: storeIt.buyPrice,
          prevSellPrice: storeIt.sellPrice,
          buyPrice: formulaMatch.buyPrice,
          sellPrice: formulaMatch.sellPrice,
          isUp: formulaMatch.sellPrice >= storeIt.sellPrice,
        };
      }

      return storeIt;
    });

    onApplyFormulaItems(updatedItems);
    localStorage.setItem('hatipoglu_formula_config_v2', JSON.stringify(formulaConfig));
    setSavedBanner('📐 Formüle göre tüm mağaza altın fiyatları başarıyla güncellendi!');
    setTimeout(() => setSavedBanner(null), 3000);
  };

  // Reset to default multipliers from screenshot
  const handleResetToScreenshotDefaults = () => {
    setFormulaConfig({
      ...defaultFormulaConfig,
      onsUsd: marketStats?.onsUsd || defaultFormulaConfig.onsUsd,
      usdTry: marketStats?.usdTry || defaultFormulaConfig.usdTry,
      eurTry: marketStats?.eurTry || defaultFormulaConfig.eurTry,
    });
    localStorage.removeItem('hatipoglu_formula_config_v2');
    setSavedBanner('Fotoğraftaki orijinal Kapalıçarşı formül çarpanları yüklendi!');
    setTimeout(() => setSavedBanner(null), 2500);
  };

  // Update Admin Username & Password
  const handleUpdateCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setCredError(null);
    setCredSuccess(null);

    const trimmedUser = newUsername.trim();
    if (!trimmedUser) {
      setCredError('Kullanıcı adı boş bırakılamaz.');
      return;
    }

    if (newPassword && newPassword.length < 4) {
      setCredError('Yeni şifre en az 4 karakter uzunluğunda olmalıdır.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setCredError('Yeni şifreler eşleşmiyor. Lütfen her iki alana da aynı şifreyi yazınız.');
      return;
    }

    const updated = {
      username: trimmedUser,
      password: newPassword ? newPassword.trim() : adminCreds.password,
    };

    saveAdminCredentials(updated);
    setAdminCreds(updated);
    setNewPassword('');
    setConfirmPassword('');
    setCredSuccess(`Yönetici giriş bilgileri başarıyla güncellendi! (Kullanıcı Adı: ${trimmedUser})`);
    setTimeout(() => setCredSuccess(null), 4000);
  };

  // Reset Admin Credentials to default (admin / 1234)
  const handleResetCredentials = () => {
    if (window.confirm('Yönetici kullanıcı adı ve şifresi varsayılana ("admin" / "1234") sıfırlansın mı?')) {
      resetAdminCredentials();
      const def = getAdminCredentials();
      setAdminCreds(def);
      setNewUsername(def.username);
      setNewPassword('');
      setConfirmPassword('');
      setCredSuccess('Giriş bilgileri varsayılana ("admin" / "1234") sıfırlandı.');
      setTimeout(() => setCredSuccess(null), 3000);
    }
  };

  return (
    <div
      className={`flex-1 flex flex-col overflow-y-auto no-scrollbar px-3.5 py-2.5 pb-20 transition-colors ${
        isDarkMode ? 'text-slate-100' : 'text-slate-800'
      }`}
    >
      {/* Top Header & Admin Status Bar */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-md ${
              isDarkMode
                ? 'bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/40 text-amber-400'
                : 'bg-blue-50 border border-blue-200 text-blue-600'
            }`}
          >
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-cinzel font-bold tracking-widest uppercase ${
                  isDarkMode ? 'text-amber-400' : 'text-blue-600'
                }`}
              >
                YÖNETİCİ KONTROL PANELİ
              </span>
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                admin aktif
              </span>
            </div>
            <h2
              className={`text-base font-black tracking-tight font-cinzel ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              Fiyat Formülleri ve Mağaza
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsGitHubModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 hover:from-slate-800 hover:to-slate-700 text-white font-bold rounded-xl text-xs shadow-md border border-slate-700 active:scale-95 transition-all"
            title="Dosyaları Doğrudan GitHub'a Gönder"
          >
            <Github className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">GitHub'a Gönder</span>
          </button>

          <button
            onClick={() => {
              const el = document.getElementById('mobile-export-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs shadow-md active:scale-95 transition-all"
            title="Apple iOS Codemagic İndirme Linki"
          >
            <Apple className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">iOS Codemagic İndir</span>
          </button>

          {onLogout && (
            <button
              onClick={onLogout}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all active:scale-95 ${
                isDarkMode
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
                  : 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100'
              }`}
              title="Yönetici Oturumunu Kapat"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Çıkış</span>
            </button>
          )}
        </div>
      </div>

      {savedBanner && (
        <div className="mt-2.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl p-2.5 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 shrink-0" />
          <span>{savedBanner}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. BASE HAS ALTIN REFERENCE BAR                           */}
      {/* ========================================================= */}
      <div
        className={`mt-2.5 rounded-2xl p-3 border shadow-lg transition-colors ${
          isDarkMode
            ? 'bg-[#080E1C] border-amber-500/25'
            : 'bg-white border-amber-200'
        }`}
      >
        <div className="flex items-center justify-between pb-2 border-b border-amber-500/20">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 text-sm font-black">●</span>
            <span
              className={`text-xs font-bold uppercase tracking-wider font-cinzel ${
                isDarkMode ? 'text-amber-300' : 'text-amber-900'
              }`}
            >
              Has Altın (24 Ayar) Baz Değerleri
            </span>
          </div>

          <span
            className={`text-[11px] font-mono-num font-bold px-2 py-0.5 rounded-lg border ${
              isDarkMode
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                : 'bg-amber-50 border-amber-300 text-amber-800'
            }`}
          >
            Spot: {formatTurkishLira(formulaResult.spotHasPrice)} ₺/gr
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-2">
          <div
            className={`rounded-xl p-2 border ${
              isDarkMode ? 'bg-[#040711] border-[#18263D]' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <span className="text-[10px] font-bold text-emerald-400 block mb-0.5">
              Has Altın Alış (₺/gr)
            </span>
            <input
              type="number"
              step="0.1"
              value={formulaConfig.hasBuyPrice}
              onChange={(e) =>
                setFormulaConfig({
                  ...formulaConfig,
                  hasBuyPrice: parseFloat(e.target.value) || 0,
                })
              }
              className={`w-full rounded-lg px-2 py-1 text-sm font-black font-mono-num focus:outline-none ${
                isDarkMode
                  ? 'bg-[#060A16] border border-[#1C2C4A] text-emerald-400'
                  : 'bg-white border border-slate-300 text-emerald-700'
              }`}
            />
          </div>

          <div
            className={`rounded-xl p-2 border ${
              isDarkMode ? 'bg-[#040711] border-[#18263D]' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <span className="text-[10px] font-bold text-amber-400 block mb-0.5">
              Has Altın Satış (₺/gr)
            </span>
            <input
              type="number"
              step="0.1"
              value={formulaConfig.hasSellPrice}
              onChange={(e) =>
                setFormulaConfig({
                  ...formulaConfig,
                  hasSellPrice: parseFloat(e.target.value) || 0,
                })
              }
              className={`w-full rounded-lg px-2 py-1 text-sm font-black font-mono-num focus:outline-none ${
                isDarkMode
                  ? 'bg-[#060A16] border border-[#1C2C4A] text-amber-400'
                  : 'bg-white border border-slate-300 text-amber-700'
              }`}
            />
          </div>
        </div>

        {/* Master Apply & Reset Actions */}
        <div className="flex gap-2 mt-2.5">
          <button
            onClick={handleApplyFormulaToStore}
            className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Formülleri Uygula & Tüm Fiyatları Güncelle</span>
          </button>

          <button
            onClick={handleResetToScreenshotDefaults}
            className={`px-3 py-2 rounded-xl text-xs font-bold border active:scale-95 transition-all flex items-center justify-center gap-1 ${
              isDarkMode
                ? 'bg-[#0A1224] border-[#1C2945] text-slate-300 hover:text-white'
                : 'bg-slate-100 border-slate-300 text-slate-700 hover:text-slate-900'
            }`}
            title="Orijinal Çarpanlara Sıfırla"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. FORMULA MULTIPLIER CARDS (EXACT MATCH TO IMG_0568.jpeg) */}
      {/* ========================================================= */}
      <div className="mt-3 space-y-3">
        {formulaConfig.cards.map((card) => {
          // Computed prices for this card
          const isGram = card.buyMultiplier < 1.0;
          const buyPrice = isGram
            ? Math.round(formulaResult.effectiveHasBuy * card.buyMultiplier * 100) / 100
            : Math.round(formulaResult.effectiveHasBuy * card.buyMultiplier);
          const sellPrice = isGram
            ? Math.round(formulaResult.effectiveHasSell * card.sellMultiplier * 100) / 100
            : Math.round(formulaResult.effectiveHasSell * card.sellMultiplier);

          return (
            <div
              key={card.id}
              className={`rounded-2xl p-3.5 border shadow-xl transition-all ${
                isDarkMode
                  ? 'bg-[#080D1A] border-amber-500/25 hover:border-amber-500/40'
                  : 'bg-white border-slate-200 hover:border-amber-400'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between pb-2 border-b border-amber-500/15">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 text-sm font-black">●</span>
                  <h3
                    className={`text-xs font-extrabold uppercase tracking-wide font-cinzel ${
                      isDarkMode ? 'text-amber-300' : 'text-slate-900'
                    }`}
                  >
                    {card.title}
                  </h3>
                </div>

                {/* Right Badge: [ A: ×6,47 | S: ×6,53 ] */}
                <div
                  className={`px-2.5 py-0.5 rounded-lg border font-mono-num text-[11px] font-extrabold tracking-tight ${
                    isDarkMode
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                      : 'bg-amber-50 border-amber-300 text-amber-900'
                  }`}
                >
                  {card.badge}
                </div>
              </div>

              {/* Two Column Layout for Alış and Satış */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                {/* ----------------- LEFT: ALIŞ COLUMN ----------------- */}
                <div
                  className={`rounded-xl p-3 border ${
                    isDarkMode ? 'bg-[#050914] border-[#18263D]' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <label className="text-[11px] font-bold text-teal-400 block mb-1.5">
                    {card.buyLabel}
                  </label>

                  {/* Multiplier Input Box */}
                  <input
                    type="number"
                    step="0.001"
                    value={card.buyMultiplier}
                    onChange={(e) =>
                      handleUpdateCardMultiplier(
                        card.id,
                        'buyMultiplier',
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className={`w-full rounded-xl px-3 py-2 text-sm font-mono-num font-black focus:outline-none transition-all ${
                      isDarkMode
                        ? 'bg-[#040710] border border-[#1E3250] text-white focus:border-teal-400'
                        : 'bg-white border border-slate-300 text-slate-900 focus:border-teal-600'
                    }`}
                  />

                  {/* Presets Chips: [6,47 ★] [6,50] [6,53] */}
                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    {card.buyPresets.map((preset, idx) => {
                      const isSelected =
                        Math.abs(card.buyMultiplier - preset.value) < 0.0001;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() =>
                            handleUpdateCardMultiplier(
                              card.id,
                              'buyMultiplier',
                              preset.value
                            )
                          }
                          className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all active:scale-95 flex items-center gap-1 ${
                            isSelected
                              ? 'bg-emerald-500/25 border border-emerald-500/60 text-emerald-300 shadow-sm'
                              : isDarkMode
                              ? 'bg-[#0B1222] border border-[#1B2945] text-slate-300 hover:text-white'
                              : 'bg-white border border-slate-200 text-slate-700 hover:text-slate-900'
                          }`}
                        >
                          <span>{preset.value.toString().replace('.', ',')}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Calculation Result Preview */}
                  <div className="mt-3 pt-2 border-t border-slate-700/20">
                    <span className="text-[10px] text-slate-400 block font-medium">
                      {card.buyFormulaText}
                    </span>
                    <div className="text-sm sm:text-base font-black font-mono-num text-emerald-400 mt-0.5">
                      Alış: {formatTurkishLira(buyPrice)} ₺
                    </div>
                  </div>
                </div>

                {/* ----------------- RIGHT: SATIŞ COLUMN ----------------- */}
                <div
                  className={`rounded-xl p-3 border ${
                    isDarkMode ? 'bg-[#050914] border-[#18263D]' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <label className="text-[11px] font-bold text-amber-400 block mb-1.5">
                    {card.sellLabel}
                  </label>

                  {/* Multiplier Input Box */}
                  <input
                    type="number"
                    step="0.001"
                    value={card.sellMultiplier}
                    onChange={(e) =>
                      handleUpdateCardMultiplier(
                        card.id,
                        'sellMultiplier',
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className={`w-full rounded-xl px-3 py-2 text-sm font-mono-num font-black focus:outline-none transition-all ${
                      isDarkMode
                        ? 'bg-[#040710] border border-[#1E3250] text-white focus:border-amber-400'
                        : 'bg-white border border-slate-300 text-slate-900 focus:border-amber-600'
                    }`}
                  />

                  {/* Presets Chips: [6,53 ★] [6,55] [6,68] */}
                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    {card.sellPresets.map((preset, idx) => {
                      const isSelected =
                        Math.abs(card.sellMultiplier - preset.value) < 0.0001;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() =>
                            handleUpdateCardMultiplier(
                              card.id,
                              'sellMultiplier',
                              preset.value
                            )
                          }
                          className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all active:scale-95 flex items-center gap-1 ${
                            isSelected
                              ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                              : isDarkMode
                              ? 'bg-[#0B1222] border border-[#1B2945] text-slate-300 hover:text-white'
                              : 'bg-white border border-slate-200 text-slate-700 hover:text-slate-900'
                          }`}
                        >
                          <span>{preset.value.toString().replace('.', ',')}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Calculation Result Preview */}
                  <div className="mt-3 pt-2 border-t border-slate-700/20">
                    <span className="text-[10px] text-slate-400 block font-medium">
                      {card.sellFormulaText}
                    </span>
                    <div className="text-sm sm:text-base font-black font-mono-num text-amber-400 mt-0.5">
                      Satış: {formatTurkishLira(sellPrice)} ₺
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* 4. MANUAL SINGLE ITEM PRICE OVERRIDE                      */}
      {/* ========================================================= */}
      <div
        className={`rounded-2xl p-3.5 mt-3 shadow-xl space-y-3 transition-colors ${
          isDarkMode
            ? 'bg-[#090F1E] border border-amber-500/20'
            : 'bg-white border border-slate-200'
        }`}
      >
        <h3
          className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-amber-500" /> Tekil Ürün Fiyatını Elle Düzenle
        </h3>

        <div>
          <select
            value={selectedItemId}
            onChange={(e) => handleItemSelect(e.target.value)}
            className={`w-full rounded-xl px-3 py-2 text-xs font-bold focus:outline-none ${
              isDarkMode
                ? 'bg-[#060A14] border border-[#1E2C4A] text-white'
                : 'bg-slate-50 border border-slate-300 text-slate-900'
            }`}
          >
            {items.map((it) => (
              <option key={it.id} value={it.id}>
                {it.name} ({formatTurkishLira(it.sellPrice)} ₺)
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
              Alış Fiyatı (₺)
            </label>
            <input
              type="number"
              step="0.01"
              value={editBuy}
              onChange={(e) => setEditBuy(parseFloat(e.target.value) || 0)}
              className={`w-full rounded-xl px-2.5 py-1.5 text-xs font-bold font-mono-num focus:outline-none text-emerald-600 dark:text-emerald-400 ${
                isDarkMode ? 'bg-[#060A14] border border-[#1E2C4A]' : 'bg-slate-50 border border-slate-300'
              }`}
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-amber-600 dark:text-amber-400 block mb-1">
              Satış Fiyatı (₺)
            </label>
            <input
              type="number"
              step="0.01"
              value={editSell}
              onChange={(e) => setEditSell(parseFloat(e.target.value) || 0)}
              className={`w-full rounded-xl px-2.5 py-1.5 text-xs font-bold font-mono-num focus:outline-none text-amber-700 dark:text-amber-300 ${
                isDarkMode ? 'bg-[#060A14] border border-[#1E2C4A]' : 'bg-slate-50 border border-slate-300'
              }`}
            />
          </div>
        </div>

        <button
          onClick={handleSaveManualPrice}
          className="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-xl text-xs shadow-md active:scale-95 transition-all"
        >
          {activeItem?.name} Fiyatını Kaydet
        </button>
      </div>

      {/* ========================================================= */}
      {/* 5. STORE IDENTITY & CONTACT CONFIG                        */}
      {/* ========================================================= */}
      <form
        onSubmit={handleSaveConfig}
        className={`rounded-2xl p-3.5 mt-3 shadow-xl space-y-2.5 transition-colors ${
          isDarkMode
            ? 'bg-[#090F1E] border border-amber-500/20'
            : 'bg-white border border-slate-200'
        }`}
      >
        <h3
          className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}
        >
          <Phone className="w-3.5 h-3.5 text-amber-500" /> Mağaza İletişim & Başlık Bilgileri
        </h3>

        {/* Live Logo Preview matching reference */}
        <div className={`p-3 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-3 ${
          isDarkMode ? 'bg-[#040711] border-[#1C2A47]' : 'bg-slate-50 border-slate-200'
        }`}>
          <div>
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block mb-1">
              ✨ Aktif Kurumsal 3D Altın Logo
            </span>
            <p className="text-[11px] text-slate-400">
              Yüklenen HK monogramlı 3D altın amblem ve kaligrafik Kuyumculuk logosu sistemde aktiftir.
            </p>
          </div>
          <div className={`p-2 rounded-lg border shrink-0 ${
            isDarkMode ? 'bg-black/50 border-amber-500/20' : 'bg-white border-blue-200'
          }`}>
            <BrandLogo size="md" isDarkMode={isDarkMode} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className={`text-[10px] block mb-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Mağaza Adı
            </label>
            <input
              type="text"
              value={configForm.brandName}
              onChange={(e) => setConfigForm({ ...configForm, brandName: e.target.value })}
              className={`w-full rounded-xl px-2.5 py-1.5 text-xs font-bold focus:outline-none ${
                isDarkMode
                  ? 'bg-[#060A14] border border-[#1E2C4A] text-white'
                  : 'bg-slate-50 border border-slate-300 text-slate-900'
              }`}
            />
          </div>
          <div>
            <label className={`text-[10px] block mb-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Alt Başlık
            </label>
            <input
              type="text"
              value={configForm.subtitle}
              onChange={(e) => setConfigForm({ ...configForm, subtitle: e.target.value })}
              className={`w-full rounded-xl px-2.5 py-1.5 text-xs font-bold focus:outline-none ${
                isDarkMode
                  ? 'bg-[#060A14] border border-[#1E2C4A] text-white'
                  : 'bg-slate-50 border border-slate-300 text-slate-900'
              }`}
            />
          </div>
        </div>

        <div>
          <label className={`text-[10px] block mb-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Slogan / Tagline
          </label>
          <input
            type="text"
            value={configForm.tagline}
            onChange={(e) => setConfigForm({ ...configForm, tagline: e.target.value })}
            className={`w-full rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-none ${
              isDarkMode
                ? 'bg-[#060A14] border border-[#1E2C4A] text-white'
                : 'bg-slate-50 border border-slate-300 text-slate-900'
            }`}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className={`text-[10px] block mb-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Telefon
            </label>
            <input
              type="text"
              value={configForm.phone}
              onChange={(e) => setConfigForm({ ...configForm, phone: e.target.value })}
              className={`w-full rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-none ${
                isDarkMode
                  ? 'bg-[#060A14] border border-[#1E2C4A] text-white'
                  : 'bg-slate-50 border border-slate-300 text-slate-900'
              }`}
            />
          </div>
          <div>
            <label className={`text-[10px] block mb-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              WhatsApp
            </label>
            <input
              type="text"
              value={configForm.whatsapp}
              onChange={(e) => setConfigForm({ ...configForm, whatsapp: e.target.value })}
              className={`w-full rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-none ${
                isDarkMode
                  ? 'bg-[#060A14] border border-[#1E2C4A] text-white'
                  : 'bg-slate-50 border border-slate-300 text-slate-900'
              }`}
            />
          </div>
        </div>

        <div>
          <label className={`text-[10px] block mb-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Adres
          </label>
          <input
            type="text"
            value={configForm.address}
            onChange={(e) => setConfigForm({ ...configForm, address: e.target.value })}
            className={`w-full rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-none ${
              isDarkMode
                ? 'bg-[#060A14] border border-[#1E2C4A] text-white'
                : 'bg-slate-50 border border-slate-300 text-slate-900'
            }`}
          />
        </div>

        {/* En Alt Kayan Yazı Düzenleme Alanı */}
        <div className="pt-2 border-t border-amber-500/20 space-y-1.5">
          <div className="flex items-center justify-between">
            <label className={`text-[11px] font-black flex items-center gap-1.5 ${
              isDarkMode ? 'text-amber-400' : 'text-amber-800'
            }`}>
              <Megaphone className="w-3.5 h-3.5" />
              <span>En Alt Kayan Yazı (Canlı Bilgi / Duyuru Bandı)</span>
            </label>
            <span className="text-[10px] text-slate-400">
              Ekranda en altta kesintisiz kayar
            </span>
          </div>

          <textarea
            rows={2}
            value={configForm.marqueeText || ''}
            onChange={(e) => setConfigForm({ ...configForm, marqueeText: e.target.value })}
            placeholder="Kayan yazı metnini giriniz..."
            className={`w-full rounded-xl p-2.5 text-xs font-medium focus:outline-none transition-colors leading-relaxed ${
              isDarkMode
                ? 'bg-[#060A14] border border-amber-500/40 text-white focus:border-amber-400'
                : 'bg-slate-50 border border-slate-300 text-slate-900 focus:border-amber-600'
            }`}
          />

          {/* Quick preset templates */}
          <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] pt-0.5">
            <span className="text-slate-400 font-semibold">Hızlı Şablonlar:</span>
            <div className="flex flex-wrap gap-1">
              <button
                type="button"
                onClick={() =>
                  setConfigForm({
                    ...configForm,
                    marqueeText:
                      '⚜️ HATİPOĞLU KUYUMCULUK • Canlı Serbest Piyasa Fiyatları • Has Altın, Ziynet ve Sarrafiye Alım-Satımında Güvenin Adresi • Tel: 05448166660 • EYYÜP peygamber caddesi no:122-b Şanlıurfa Eyyübiye ⚜️',
                  })
                }
                className="px-2 py-0.5 rounded bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 font-bold border border-amber-500/30 transition-colors"
              >
                Standart Mağaza
              </button>
              <button
                type="button"
                onClick={() =>
                  setConfigForm({
                    ...configForm,
                    marqueeText:
                      '📢 ÖZEL DUYURU: Toptan has altın ve sarrafiye alımlarında özel piyasa iskontosu uygulanmaktadır. Ayrıntılı bilgi ve siparişleriniz için mağazamıza bekleriz. Tel: 05448166660 📢',
                  })
                }
                className="px-2 py-0.5 rounded bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 font-bold border border-emerald-500/30 transition-colors"
              >
                Kampanya & İskonto
              </button>
              <button
                type="button"
                onClick={() =>
                  setConfigForm({
                    ...configForm,
                    marqueeText:
                      '⚠️ PİYASA BİLGİLENDİRMESİ: Fiyatlarımız anlık Kapalıçarşı serbest piyasa kurları ve ONS parametrelerine göre canlı olarak güncellenmektedir.',
                  })
                }
                className="px-2 py-0.5 rounded bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 font-bold border border-blue-500/30 transition-colors"
              >
                Piyasa Bilgisi
              </button>
            </div>
          </div>

          {/* Live Preview Bar inside admin */}
          <div className="p-2 rounded-xl bg-black/40 border border-slate-800 text-[11px] text-amber-300 flex items-center gap-2 overflow-hidden">
            <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
              Canlı Önizleme
            </span>
            <span className="truncate italic">
              {configForm.marqueeText || 'Henüz bir metin girilmedi.'}
            </span>
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <button
            type="submit"
            className="flex-1 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-xl text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-1"
          >
            <Save className="w-3.5 h-3.5" /> Bilgileri Kaydet
          </button>

          <button
            type="button"
            onClick={onResetDefaults}
            className={`px-3 py-2 rounded-xl text-xs font-semibold active:scale-95 transition-all flex items-center justify-center gap-1 ${
              isDarkMode
                ? 'bg-[#121B30] border border-[#1C2945] text-slate-300 hover:text-white'
                : 'bg-slate-100 border border-slate-300 text-slate-700 hover:text-slate-900'
            }`}
            title="Orijinal Mağaza Ayarlarına Dön"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Sıfırla
          </button>
        </div>
      </form>

      {/* ========================================================= */}
      {/* 6. YÖNETİCİ GİRİŞ BİLGİLERİ (KULLANICI ADI & ŞİFRE DEĞİŞTİRME) */}
      {/* ========================================================= */}
      <form
        onSubmit={handleUpdateCredentials}
        className={`p-4 rounded-2xl border space-y-3 shadow-lg transition-colors ${
          isDarkMode
            ? 'bg-[#080E1C] border-amber-500/25'
            : 'bg-white border border-slate-200'
        }`}
      >
        <div className="flex items-center justify-between">
          <h3
            className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            <Key className="w-3.5 h-3.5 text-amber-500" /> Yönetici Giriş Bilgileri & Güvenlik
          </h3>
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
              isDarkMode
                ? 'bg-[#040813] border-amber-500/30 text-amber-300'
                : 'bg-slate-100 border-slate-300 text-slate-700'
            }`}
          >
            Mevcut: <strong className="font-bold">{adminCreds.username}</strong>
          </span>
        </div>

        <p className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          Yönetici paneline girişte kullanılan kullanıcı adı ve şifreyi buradan istediğiniz zaman değiştirebilirsiniz.
        </p>

        {credError && (
          <div className="bg-rose-500/15 border border-rose-500/40 rounded-xl p-2.5 text-rose-400 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <Info className="w-4 h-4 shrink-0" />
            <span>{credError}</span>
          </div>
        )}

        {credSuccess && (
          <div className="bg-emerald-500/20 border border-emerald-500/40 rounded-xl p-2.5 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{credSuccess}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Kullanıcı Adı */}
          <div>
            <label className={`text-[10px] font-bold block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Kullanıcı Adı
            </label>
            <div className="relative">
              <User className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Örn: hatipoglu veya admin"
                className={`w-full rounded-xl pl-8 pr-2.5 py-1.5 text-xs font-semibold focus:outline-none ${
                  isDarkMode
                    ? 'bg-[#040813] border border-[#1E2C4A] text-white focus:border-amber-400'
                    : 'bg-slate-50 border border-slate-300 text-slate-900 focus:border-amber-600'
                }`}
              />
            </div>
          </div>

          {/* Yeni Şifre */}
          <div>
            <label className={`text-[10px] font-bold block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Yeni Şifre {newPassword ? '' : '(Değişmeyecekse boş)'}
            </label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Yeni şifre belirleyin..."
                className={`w-full rounded-xl pl-8 pr-8 py-1.5 text-xs font-semibold focus:outline-none ${
                  isDarkMode
                    ? 'bg-[#040813] border border-[#1E2C4A] text-white focus:border-amber-400'
                    : 'bg-slate-50 border border-slate-300 text-slate-900 focus:border-amber-600'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Yeni Şifre Tekrar */}
          <div>
            <label className={`text-[10px] font-bold block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Yeni Şifre Tekrarı
            </label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Şifreyi tekrar onaylayın..."
                className={`w-full rounded-xl pl-8 pr-2.5 py-1.5 text-xs font-semibold focus:outline-none ${
                  isDarkMode
                    ? 'bg-[#040813] border border-[#1E2C4A] text-white focus:border-amber-400'
                    : 'bg-slate-50 border border-slate-300 text-slate-900 focus:border-amber-600'
                }`}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <button
            type="submit"
            className="flex-1 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-xl text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" /> Şifre & Kullanıcı Adını Kaydet
          </button>

          <button
            type="button"
            onClick={handleResetCredentials}
            className={`px-3 py-2 rounded-xl text-xs font-semibold active:scale-95 transition-all flex items-center justify-center gap-1 ${
              isDarkMode
                ? 'bg-[#121B30] border border-[#1C2945] text-slate-300 hover:text-white'
                : 'bg-slate-100 border border-slate-300 text-slate-700 hover:text-slate-900'
            }`}
            title="Varsayılan 'admin' / '1234' bilgilerine döndür"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Sıfırla (admin / 1234)
          </button>
        </div>
      </form>

      {/* ========================================================= */}
      {/* 6. GITHUB'A DOĞRUDAN GÖNDERME & ENTEGRASYON ALANI          */}
      {/* ========================================================= */}
      <div
        className={`p-4 rounded-2xl border transition-all ${
          isDarkMode
            ? 'bg-gradient-to-r from-[#070D1F] via-[#0B1530] to-[#070D1F] border-slate-700/60 shadow-xl'
            : 'bg-slate-50 border-slate-200'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-slate-950 flex items-center justify-center shrink-0 shadow-md">
              <Github className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-black tracking-tight text-white flex items-center gap-1.5 font-cinzel">
                <span>GitHub & Codemagic.io ile Dağıt</span>
                <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Canlı Entegrasyon
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Tüm kaynak kodları ve Codemagic.yaml iOS mobil yapılandırmasını GitHub deponuza aktarın.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsGitHubModalOpen(true)}
            className="py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs shadow-lg active:scale-95 transition-all flex items-center justify-center gap-1.5 shrink-0"
          >
            <UploadCloud className="w-4 h-4" />
            <span>GitHub'a Gönder</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 7. APPLE iOS EXPO MOBİL UYGULAMA İNDİRME MERKEZİ           */}
      {/* ========================================================= */}
      <div id="mobile-export-section">
        <MobileExportSection
          storeConfig={storeConfig}
          items={items}
          isDarkMode={isDarkMode}
          onOpenAppStoreAssets={onOpenAppStoreAssets}
        />
      </div>

      {/* GitHub Gönderme Modalı */}
      <GitHubSyncModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
        storeConfig={storeConfig}
        items={items}
        onUpdateStoreConfig={onUpdateStoreConfig}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};
