import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

// iOS Kuyumcu Canlı Verileri
const INITIAL_STORE = {
  "brandName": "HATİPOĞLU",
  "subtitle": "KUYUMCULUK",
  "tagline": "2010'dan Beri Güven ve Zarafetin Adresi",
  "phone": "05448166660",
  "whatsapp": "+90 544 816 66 60",
  "address": "EYYÜP peygamber caddesi no:122-b Şanlıurfa Eyyübiye",
  "manualMode": false,
  "spreadAdjustmentPercent": 0,
  "bundleIdentifier": "com.hatipoglu.gold",
  "marqueeText": "⚜️ HATİPOĞLU KUYUMCULUK • Canlı Serbest Piyasa Fiyatları • Has Altın, Ziynet ve Sarrafiye Alım-Satımında Güvenin Adresi • Tel: 05448166660 • EYYÜP peygamber caddesi no:122-b Şanlıurfa Eyyübiye ⚜️",
  "marqueeSpeed": 25
};
const INITIAL_ITEMS = [
  {
    "id": "has-altin",
    "name": "Has Altın",
    "shortName": "Has Altın",
    "category": "gold",
    "buyPrice": 6817.11,
    "sellPrice": 6843.36,
    "unit": "Gram",
    "changeRate": 0.24,
    "isUp": true,
    "isFavorite": true,
    "history": [
      6780,
      6795,
      6802,
      6815,
      6808,
      6825,
      6835.64
    ],
    "prevSellPrice": 6841.22,
    "prevBuyPrice": 6814.97
  },
  {
    "id": "22-ayar-bilezik",
    "name": "22 Ayar Bilezik",
    "shortName": "22 Ayar Bil.",
    "category": "gold",
    "buyPrice": 6195.3,
    "sellPrice": 6342.41,
    "unit": "Gram",
    "changeRate": 0.18,
    "isUp": false,
    "isFavorite": true,
    "history": [
      6250,
      6265,
      6280,
      6290,
      6285,
      6300,
      6302.46
    ],
    "prevSellPrice": 6346.2,
    "prevBuyPrice": 6199.09
  },
  {
    "id": "22-ayar-hurda",
    "name": "22 Ayar Hurda",
    "shortName": "22 Ayar Hurda",
    "category": "gold",
    "buyPrice": 6210.24,
    "sellPrice": 6275.18,
    "unit": "Gram",
    "changeRate": 0.15,
    "isUp": true,
    "history": [
      6210,
      6220,
      6235,
      6230,
      6238,
      6240.94
    ],
    "prevBuyPrice": 6206.12,
    "prevSellPrice": 6271.06
  },
  {
    "id": "eski-tam",
    "name": "Eski Tam Altın (Ziynet)",
    "shortName": "E. Tam Ziynet",
    "category": "ziynet",
    "buyPrice": 43968.48,
    "sellPrice": 44548.48,
    "unit": "Adet",
    "changeRate": 0.38,
    "isUp": false,
    "history": [
      44100,
      44180,
      44250,
      44350,
      44400,
      44432
    ],
    "prevSellPrice": 44562.85,
    "prevBuyPrice": 43982.85
  },
  {
    "id": "yeni-tam",
    "name": "Yeni Tam Altın (Ziynet)",
    "shortName": "Y. Tam Ziynet",
    "category": "ziynet",
    "buyPrice": 44216.3,
    "sellPrice": 44796.3,
    "unit": "Adet",
    "changeRate": 0.4,
    "isUp": true,
    "history": [
      44300,
      44380,
      44450,
      44550,
      44600,
      44637
    ],
    "prevSellPrice": 44760.73,
    "prevBuyPrice": 44180.73
  },
  {
    "id": "yeni-yarim",
    "name": "Yeni Yarım Altın",
    "shortName": "Y. Yarım",
    "category": "ziynet",
    "buyPrice": 22134.44,
    "sellPrice": 22424.44,
    "unit": "Adet",
    "changeRate": 0.28,
    "isUp": true,
    "history": [
      22150,
      22180,
      22220,
      22280,
      22300,
      22318
    ],
    "prevSellPrice": 22415.5,
    "prevBuyPrice": 22125.5
  },
  {
    "id": "eski-yarim",
    "name": "Eski Yarım Altın",
    "shortName": "E. Yarım",
    "category": "ziynet",
    "buyPrice": 21890.58,
    "sellPrice": 22179.58,
    "unit": "Adet",
    "changeRate": 0.25,
    "isUp": true,
    "history": [
      22080,
      22110,
      22150,
      22190,
      22200,
      22216
    ],
    "prevSellPrice": 22167.78,
    "prevBuyPrice": 21878.78
  },
  {
    "id": "eski-ceyrek",
    "name": "Eski Çeyrek Altın",
    "shortName": "E. Çeyrek",
    "category": "ziynet",
    "buyPrice": 10963.53,
    "sellPrice": 11108.53,
    "unit": "Adet",
    "changeRate": 0.32,
    "isUp": false,
    "history": [
      11040,
      11060,
      11080,
      11095,
      11100,
      11108
    ],
    "prevSellPrice": 11117.29,
    "prevBuyPrice": 10972.29
  },
  {
    "id": "yeni-ceyrek",
    "name": "Yeni Çeyrek Altın",
    "shortName": "Y. Çeyrek",
    "category": "ziynet",
    "buyPrice": 11015.87,
    "sellPrice": 11160.87,
    "unit": "Adet",
    "changeRate": 0.35,
    "isUp": true,
    "isFavorite": true,
    "history": [
      11080,
      11095,
      11120,
      11140,
      11150,
      11159
    ],
    "prevSellPrice": 11151.96,
    "prevBuyPrice": 11006.96
  },
  {
    "id": "gumus-gram",
    "name": "Gümüş (Gram)",
    "shortName": "Gümüş",
    "category": "gold",
    "buyPrice": 96.95,
    "sellPrice": 104.51,
    "unit": "Gram",
    "changeRate": -0.12,
    "isUp": true,
    "history": [
      105.2,
      105,
      104.8,
      104.5,
      104.7,
      104.64
    ],
    "prevSellPrice": 104.45,
    "prevBuyPrice": 96.89
  },
  {
    "id": "usd-try",
    "name": "ABD Doları",
    "shortName": "USD",
    "category": "currency",
    "buyPrice": 48.49,
    "sellPrice": 48.55,
    "unit": "Döviz",
    "changeRate": 0.05,
    "isUp": false,
    "isFavorite": true,
    "history": [
      48.35,
      48.4,
      48.45,
      48.5,
      48.52,
      48.54
    ],
    "prevSellPrice": 48.58,
    "prevBuyPrice": 48.52
  },
  {
    "id": "eur-try",
    "name": "Euro",
    "shortName": "EUR",
    "category": "currency",
    "buyPrice": 56.28,
    "sellPrice": 56.36,
    "unit": "Döviz",
    "changeRate": 0.09,
    "isUp": true,
    "history": [
      56.1,
      56.18,
      56.25,
      56.32,
      56.35,
      56.38
    ],
    "prevSellPrice": 56.35,
    "prevBuyPrice": 56.27
  }
];

export default function App() {
  const [items] = useState(INITIAL_ITEMS);
  const [activeTab, setActiveTab] = useState<'prices' | 'calc'>('prices');
  const [calcQty, setCalcQty] = useState('1');
  const [selectedItem, setSelectedItem] = useState(INITIAL_ITEMS[0] || null);

  const formatTL = (val: number) => {
    return new Intl.NumberFormat('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);
  };

  const qty = parseFloat(calcQty.replace(',', '.')) || 0;
  const sellTotal = (selectedItem?.sellPrice || 0) * qty;
  const buyTotal = (selectedItem?.buyPrice || 0) * qty;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* iOS Header */}
        <View style={styles.header}>
          <View style={styles.headerPill}>
            <Text style={styles.headerPillText}> iOS PREMİUM CANLI EKRAN</Text>
          </View>
          <View style={styles.logoRow}>
            <View style={styles.monogramBox}>
              <Text style={styles.monogramText}>HK</Text>
            </View>
            <View>
              <Text style={styles.brandTitle}>{INITIAL_STORE.brandName}</Text>
              <Text style={styles.brandSubtitle}>Kuyumculuk</Text>
            </View>
          </View>
          <Text style={styles.brandTagline}>{INITIAL_STORE.tagline}</Text>
        </View>

        {/* Live Ticker Bar */}
        <View style={styles.tickerBar}>
          <Text style={styles.tickerText}>
            CANLI KAPALIÇARŞI FİYAT LİSTESİ • İLETİŞİM: {INITIAL_STORE.phone}
          </Text>
        </View>

        {/* iOS Segmented Navigation Control */}
        <View style={styles.segmentedControl}>
          <TouchableOpacity
            style={[styles.segmentBtn, activeTab === 'prices' && styles.segmentBtnActive]}
            onPress={() => setActiveTab('prices')}
            activeOpacity={0.8}
          >
            <Text style={[styles.segmentText, activeTab === 'prices' && styles.segmentTextActive]}>
              CANLI FİYATLAR
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segmentBtn, activeTab === 'calc' && styles.segmentBtnActive]}
            onPress={() => setActiveTab('calc')}
            activeOpacity={0.8}
          >
            <Text style={[styles.segmentText, activeTab === 'calc' && styles.segmentTextActive]}>
              HESAPLAMA
            </Text>
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        {activeTab === 'prices' ? (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {items.map((it) => (
              <View key={it.id} style={styles.priceCard}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{it.name}</Text>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{it.unit}</Text>
                  </View>
                </View>

                <View style={styles.cardPrices}>
                  <View style={styles.priceColumn}>
                    <Text style={styles.priceLabel}>ALIŞ (TL)</Text>
                    <Text style={styles.buyValue}>{formatTL(it.buyPrice)} ₺</Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.priceColumnRight}>
                    <Text style={styles.priceLabel}>SATIŞ (TL)</Text>
                    <Text style={styles.sellValue}>{formatTL(it.sellPrice)} ₺</Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.calcContent}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.calcHeading}>Hızlı Altın ve Ziynet Hesaplama</Text>

            {/* Ürün Seçici iOS Listesi */}
            <Text style={styles.fieldLabel}>Altın Türü Seçin:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
              {items.map((it) => (
                <TouchableOpacity
                  key={it.id}
                  style={[styles.chip, selectedItem?.id === it.id && styles.chipActive]}
                  onPress={() => setSelectedItem(it)}
                >
                  <Text style={[styles.chipText, selectedItem?.id === it.id && styles.chipTextActive]}>
                    {it.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.fieldLabel}>Adet veya Gram Miktarı:</Text>
            <TextInput
              style={styles.iosInput}
              keyboardType="decimal-pad"
              value={calcQty}
              onChangeText={setCalcQty}
              placeholder="1"
              placeholderTextColor="#6B7280"
              clearButtonMode="while-editing"
            />

            {/* Sonuç Kartı */}
            <View style={styles.calcResultCard}>
              <View style={styles.calcRow}>
                <Text style={styles.calcResultTitle}>Müşteriye Satış Tutarı</Text>
                <Text style={styles.sellBigTotal}>{formatTL(sellTotal)} ₺</Text>
              </View>
              <View style={styles.cardSeparator} />
              <View style={styles.calcRow}>
                <Text style={styles.calcResultTitle}>Müşteriden Alış Tutarı</Text>
                <Text style={styles.buyBigTotal}>{formatTL(buyTotal)} ₺</Text>
              </View>
            </View>
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#040711',
  },
  container: {
    flex: 1,
    backgroundColor: '#040711',
  },
  header: {
    paddingTop: 10,
    paddingBottom: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1A2438',
  },
  headerPill: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  headerPillText: {
    color: '#FBBF24',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  monogramBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#1E1502',
    borderWidth: 1.5,
    borderColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monogramText: {
    color: '#FCD34D',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#F59E0B',
    letterSpacing: 1.5,
  },
  brandSubtitle: {
    fontSize: 13,
    fontStyle: 'italic',
    fontWeight: '600',
    color: '#FDE68A',
    letterSpacing: 1,
    marginTop: -1,
  },
  brandTagline: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 4,
  },
  tickerBar: {
    backgroundColor: '#0A1224',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#17233B',
  },
  tickerText: {
    color: '#FBBF24',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  segmentedControl: {
    flexDirection: 'row',
    marginHorizontal: 14,
    marginVertical: 10,
    padding: 3,
    backgroundColor: '#0C162D',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1C2945',
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 9,
  },
  segmentBtnActive: {
    backgroundColor: '#F59E0B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  segmentText: {
    color: '#9CA3AF',
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 1,
  },
  segmentTextActive: {
    color: '#040711',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingBottom: 24,
  },
  calcContent: {
    padding: 16,
    paddingBottom: 30,
  },
  priceCard: {
    backgroundColor: '#0B1326',
    borderRadius: 14,
    padding: 14,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#192848',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  badge: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  badgeText: {
    color: '#FBBF24',
    fontSize: 11,
    fontWeight: '700',
  },
  cardPrices: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceColumn: {
    flex: 1,
  },
  priceColumnRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: '#1E2D4D',
    marginHorizontal: 10,
  },
  priceLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.5,
  },
  buyValue: {
    fontSize: 17,
    fontWeight: '900',
    color: '#34D399',
    marginTop: 2,
  },
  sellValue: {
    fontSize: 17,
    fontWeight: '900',
    color: '#F59E0B',
    marginTop: 2,
  },
  calcHeading: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D1D5DB',
    marginTop: 10,
    marginBottom: 6,
  },
  chipScroll: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  chip: {
    backgroundColor: '#0B1326',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#1E2D4D',
  },
  chipActive: {
    backgroundColor: '#F59E0B',
    borderColor: '#F59E0B',
  },
  chipText: {
    color: '#D1D5DB',
    fontSize: 12,
    fontWeight: '700',
  },
  chipTextActive: {
    color: '#040711',
  },
  iosInput: {
    backgroundColor: '#0B1326',
    borderWidth: 1,
    borderColor: '#1E2D4D',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 17,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  calcResultCard: {
    backgroundColor: '#0C162D',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(245, 158, 11, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  calcRow: {
    paddingVertical: 6,
  },
  calcResultTitle: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  sellBigTotal: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FBBF24',
    marginTop: 4,
  },
  buyBigTotal: {
    fontSize: 22,
    fontWeight: '900',
    color: '#34D399',
    marginTop: 4,
  },
  cardSeparator: {
    height: 1,
    backgroundColor: '#1E2D4D',
    marginVertical: 10,
  },
});
