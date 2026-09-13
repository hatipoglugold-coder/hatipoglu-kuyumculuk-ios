export type CategoryType = 'all' | 'gold' | 'ziynet' | 'currency';

export interface GoldItem {
  id: string;
  name: string;
  shortName?: string;
  category: 'gold' | 'ziynet' | 'currency';
  buyPrice: number;
  sellPrice: number;
  prevBuyPrice?: number;
  prevSellPrice?: number;
  unit: string;
  changeRate: number; // e.g. +0.15%
  isUp: boolean;
  isFavorite?: boolean;
  history: number[];
}

export interface MarketStats {
  onsUsd: number;
  onsChange: number;
  usdTry: number;
  usdChange: number;
  eurTry: number;
  eurChange: number;
}

export interface PriceAlert {
  id: string;
  itemId: string;
  itemName: string;
  targetType: 'buy' | 'sell';
  direction: 'above' | 'below';
  targetPrice: number;
  currentPrice: number;
  isActive: boolean;
  triggered: boolean;
  createdAt: string;
}

export interface CalculationItem {
  itemId: string;
  quantity: number;
  customGrams?: number;
}

export interface StoreConfig {
  brandName: string;
  subtitle: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  address: string;
  manualMode: boolean;
  spreadAdjustmentPercent: number; // e.g. 0% or +0.5%
  marqueeText?: string; // Ticker text at bottom of screen
  marqueeSpeed?: number; // Speed in seconds
  easProjectId?: string; // Optional legacy ID
  codemagicWorkflowId?: string; // Codemagic.io Workflow ID (e.g. ios-release)
  bundleIdentifier?: string; // Apple Bundle ID (e.g. com.hatipoglu.kuyumculuk.ios)
}

export type TabType = 'prices' | 'chart' | 'alerts' | 'calc' | 'contact' | 'admin';

export type { JewelryFormulaConfig } from './utils/jewelryFormula';

