import { GoldItem, MarketStats } from '../types';

export interface MultiplierFormulaCard {
  id: string;
  targetItemId: string;
  title: string;
  badge: string;
  buyLabel: string;
  buyMultiplier: number;
  buyPresets: { value: number; isStar?: boolean }[];
  buyFormulaText: string;
  sellLabel: string;
  sellMultiplier: number;
  sellPresets: { value: number; isStar?: boolean }[];
  sellFormulaText: string;
}

export interface JewelryFormulaConfig {
  troyOunce: number; // 31.1034768 gr
  onsUsd: number; // ONS Dolar
  usdTry: number; // Dolar / TL
  eurTry: number; // Euro / TL
  hasBuyPrice: number; // Has Altın Alış (TL)
  hasSellPrice: number; // Has Altın Satış (TL)
  autoSyncWithLiveMarket: boolean;
  cards: MultiplierFormulaCard[];
}

export const defaultMultiplierCards: MultiplierFormulaCard[] = [
  {
    id: 'yeni-yarim',
    targetItemId: 'yeni-yarim',
    title: 'YENİ YARIM ALTIN FORMÜLÜ',
    badge: 'A: ×3.235 | S: ×3.265',
    buyLabel: 'Yeni Yarım Alış (Has Alış)',
    buyMultiplier: 3.235,
    buyPresets: [
      { value: 3.235, isStar: true },
      { value: 3.26 },
      { value: 3.27 },
    ],
    buyFormulaText: 'Alış × 3.235',
    sellLabel: 'Yeni Yarım Satış (Has Satış)',
    sellMultiplier: 3.265,
    sellPresets: [
      { value: 3.265, isStar: true },
      { value: 3.28 },
      { value: 3.34 },
    ],
    sellFormulaText: 'Satış Yaptı × 3.265',
  },
  {
    id: 'eski-tam',
    targetItemId: 'eski-tam',
    title: 'ESKİ TAM (ZİYNET) ALTIN FORMÜLÜ',
    badge: 'A: ×6.440 | S: ×6.500',
    buyLabel: 'Eski Tam Alış (Has Alış)',
    buyMultiplier: 6.440,
    buyPresets: [
      { value: 6.440, isStar: true },
      { value: 6.460 },
      { value: 6.480 },
    ],
    buyFormulaText: 'Alış × 6.440',
    sellLabel: 'Eski Tam Satış (Has Satış)',
    sellMultiplier: 6.500,
    sellPresets: [
      { value: 6.500, isStar: true },
      { value: 6.520 },
      { value: 6.540 },
    ],
    sellFormulaText: 'Satış × 6.500',
  },
  {
    id: 'yeni-tam',
    targetItemId: 'yeni-tam',
    title: 'YENİ TAM (ZİYNET) ALTIN FORMÜLÜ',
    badge: 'A: ×6.470 | S: ×6.530',
    buyLabel: 'Yeni Tam Alış (Has Alış)',
    buyMultiplier: 6.470,
    buyPresets: [
      { value: 6.470, isStar: true },
      { value: 6.490 },
      { value: 6.510 },
    ],
    buyFormulaText: 'Alış × 6.470',
    sellLabel: 'Yeni Tam Satış (Has Satış)',
    sellMultiplier: 6.530,
    sellPresets: [
      { value: 6.530, isStar: true },
      { value: 6.550 },
      { value: 6.570 },
    ],
    sellFormulaText: 'Satış × 6.530',
  },
  {
    id: 'eski-yarim',
    targetItemId: 'eski-yarim',
    title: 'ESKİ YARIM ALTIN FORMÜLÜ',
    badge: 'A: ×3.220 | S: ×3.250',
    buyLabel: 'Eski Yarım Alış (Has Alış)',
    buyMultiplier: 3.220,
    buyPresets: [
      { value: 3.220, isStar: true },
      { value: 3.230 },
      { value: 3.240 },
    ],
    buyFormulaText: 'Alış × 3.220',
    sellLabel: 'Eski Yarım Satış (Has Satış)',
    sellMultiplier: 3.250,
    sellPresets: [
      { value: 3.250, isStar: true },
      { value: 3.260 },
      { value: 3.270 },
    ],
    sellFormulaText: 'Satış × 3.250',
  },
  {
    id: 'eski-ceyrek',
    targetItemId: 'eski-ceyrek',
    title: 'ESKİ ÇEYREK ALTIN FORMÜLÜ',
    badge: 'A: ×1.610 | S: ×1.625',
    buyLabel: 'Eski Çeyrek Alış (Has Alış)',
    buyMultiplier: 1.610,
    buyPresets: [
      { value: 1.610, isStar: true },
      { value: 1.615 },
      { value: 1.620 },
    ],
    buyFormulaText: 'Alış × 1.610',
    sellLabel: 'Eski Çeyrek Satış (Has Satış)',
    sellMultiplier: 1.625,
    sellPresets: [
      { value: 1.625, isStar: true },
      { value: 1.630 },
      { value: 1.635 },
    ],
    sellFormulaText: 'Satış × 1.625',
  },
  {
    id: 'yeni-ceyrek',
    targetItemId: 'yeni-ceyrek',
    title: 'YENİ ÇEYREK ALTIN FORMÜLÜ',
    badge: 'A: ×1.6175 | S: ×1.6325',
    buyLabel: 'Yeni Çeyrek Alış (Has Alış)',
    buyMultiplier: 1.6175,
    buyPresets: [
      { value: 1.6175, isStar: true },
      { value: 1.62 },
      { value: 1.63 },
    ],
    buyFormulaText: 'Alış × 1.6175',
    sellLabel: 'Yeni Çeyrek Satış (Has Satış)',
    sellMultiplier: 1.6325,
    sellPresets: [
      { value: 1.6325, isStar: true },
      { value: 1.64 },
      { value: 1.65 },
    ],
    sellFormulaText: 'Satış × 1.6325',
  },
  {
    id: '22-ayar-bilezik',
    targetItemId: '22-ayar-bilezik',
    title: '22 AYAR BİLEZİK FORMÜLÜ',
    badge: 'A: ×0.912 | S: ×0.930',
    buyLabel: '22 Ayar Bilezik Alış (Has Alış)',
    buyMultiplier: 0.912,
    buyPresets: [
      { value: 0.912, isStar: true },
      { value: 0.914 },
      { value: 0.916 },
    ],
    buyFormulaText: 'Alış × 0.912 (0.916 - Makas)',
    sellLabel: '22 Ayar Bilezik Satış (Has Satış)',
    sellMultiplier: 0.930,
    sellPresets: [
      { value: 0.925 },
      { value: 0.930, isStar: true },
      { value: 0.935 },
    ],
    sellFormulaText: 'Satış × 0.930 (Milyem + İşçilik)',
  },
  {
    id: '22-ayar-hurda',
    targetItemId: '22-ayar-hurda',
    title: '22 AYAR HURDA FORMÜLÜ',
    badge: 'A: ×0.910 | S: ×0.916',
    buyLabel: '22 Ayar Hurda Alış (Has Alış)',
    buyMultiplier: 0.910,
    buyPresets: [
      { value: 0.908 },
      { value: 0.910, isStar: true },
      { value: 0.912 },
    ],
    buyFormulaText: 'Alış × 0.910 (Hurda Fire Düşülmüş)',
    sellLabel: '22 Ayar Hurda Satış (Has Satış)',
    sellMultiplier: 0.916,
    sellPresets: [
      { value: 0.914 },
      { value: 0.916, isStar: true },
      { value: 0.918 },
    ],
    sellFormulaText: 'Satış × 0.916 (22 Ayar Saf Karşılığı)',
  },
];

export const defaultFormulaConfig: JewelryFormulaConfig = {
  troyOunce: 31.1034768,
  onsUsd: 3345.5,
  usdTry: 63.02,
  eurTry: 68.45,
  hasBuyPrice: 6772.50,
  hasSellPrice: 6785.00,
  autoSyncWithLiveMarket: true,
  cards: defaultMultiplierCards,
};

export interface CalculatedItemPrice {
  targetItemId: string;
  name: string;
  buyPrice: number;
  sellPrice: number;
  buyMultiplier: number;
  sellMultiplier: number;
  formulaLabel: string;
}

export interface FormulaResultSummary {
  spotHasPrice: number;
  effectiveHasBuy: number;
  effectiveHasSell: number;
  ons: number;
  usd: number;
  eur: number;
  calculatedItems: CalculatedItemPrice[];
}

/**
 * Calculates current market and item prices using the Grand Bazaar has-multiplier formulas
 * as configured in the Admin panel.
 */
export function calculatePricesFromFormula(
  config: JewelryFormulaConfig,
  currentMarketStats?: MarketStats,
  currentItems?: GoldItem[]
): FormulaResultSummary {
  const ons = config.autoSyncWithLiveMarket && currentMarketStats ? currentMarketStats.onsUsd : config.onsUsd;
  const usd = config.autoSyncWithLiveMarket && currentMarketStats ? currentMarketStats.usdTry : config.usdTry;
  const eur = config.autoSyncWithLiveMarket && currentMarketStats ? currentMarketStats.eurTry : config.eurTry;
  const troy = config.troyOunce || 31.1034768;

  // Has Altın Spot Gram (TL) = (ONS * USD) / 31.1034768
  const spotHasPrice = Math.round(((ons * usd) / troy) * 100) / 100;

  // Has Altın Baz Fiyatı: Kullanıcının girdiği/ayarladığı Has fiyatı önceliklidir
  const existingHas = currentItems?.find((i) => i.id === 'has-altin');
  const effectiveHasBuy = (config.hasBuyPrice && config.hasBuyPrice > 0)
    ? config.hasBuyPrice
    : (existingHas?.buyPrice || Math.round(spotHasPrice * 0.994 * 100) / 100);
  const effectiveHasSell = (config.hasSellPrice && config.hasSellPrice > 0)
    ? config.hasSellPrice
    : (existingHas?.sellPrice || Math.round(spotHasPrice * 1.000 * 100) / 100);

  const calculatedItems: CalculatedItemPrice[] = config.cards.map((card) => {
    const storeItem = currentItems?.find((i) => i.id === card.targetItemId);
    const isGram = storeItem?.unit === 'Gram' || card.buyMultiplier < 1.0;

    // Alış = Has Alış * buyMultiplier
    const buyPrice = isGram
      ? Math.round(effectiveHasBuy * card.buyMultiplier * 100) / 100
      : Math.round(effectiveHasBuy * card.buyMultiplier);
    // Satış = Has Satış * sellMultiplier
    const sellPrice = isGram
      ? Math.round(effectiveHasSell * card.sellMultiplier * 100) / 100
      : Math.round(effectiveHasSell * card.sellMultiplier);

    return {
      targetItemId: card.targetItemId,
      name: storeItem?.name || card.title,
      buyPrice,
      sellPrice,
      buyMultiplier: card.buyMultiplier,
      sellMultiplier: card.sellMultiplier,
      formulaLabel: card.badge,
    };
  });

  return {
    spotHasPrice,
    effectiveHasBuy,
    effectiveHasSell,
    ons,
    usd,
    eur,
    calculatedItems,
  };
}
