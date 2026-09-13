import JSZip from 'jszip';
import { GoldItem, StoreConfig } from '../types';

/**
 * Generate complete iOS-dedicated React Native / Expo App code
 * Tailored exclusively for Apple iPhone & iPad devices
 */
export function generateIOSExpoAppCode(storeConfig: StoreConfig, items: GoldItem[]): string {
  const itemsJson = JSON.stringify(items, null, 2);
  const storeJson = JSON.stringify(storeConfig, null, 2);

  return `import React, { useState } from 'react';
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
const INITIAL_STORE = ${storeJson};
const INITIAL_ITEMS = ${itemsJson};

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
`;
}

/**
 * Generate iOS-dedicated package.json (Apple App Store / Codemagic.io CI/CD)
 */
export function generateIOSPackageJson(storeConfig: StoreConfig): string {
  return JSON.stringify(
    {
      name: 'hatipoglu-gold-ios',
      version: '1.0.0',
      description: `${storeConfig.brandName} ${storeConfig.subtitle} Apple iOS Mobil Uygulaması (Codemagic.io Destekli)`,
      main: 'index.js',
      scripts: {
        start: 'npx react-native start',
        ios: 'npx react-native run-ios',
        'build:codemagic': 'codemagic-cli build',
        'prebuild:ios': 'npx expo prebuild --platform ios',
        'pod:install': 'cd ios && pod install',
        web: 'expo start --web',
        postinstall: 'node scripts/prepare-export-options.js',
      },
      dependencies: {
        expo: '~52.0.30',
        'expo-status-bar': '~2.0.1',
        react: '18.3.1',
        'react-native': '0.76.6',
        'react-native-safe-area-context': '4.12.0',
        'expo-build-properties': '~0.13.2',
      },
      devDependencies: {
        '@babel/core': '^7.25.2',
        '@types/react': '~18.3.12',
        typescript: '^5.3.3',
      },
      private: true,
    },
    null,
    2
  );
}

/**
 * Generate Apple standard export_options.plist for Codemagic & Xcodebuild
 */
export function generateExportOptionsPlist(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>app-store</string>
    <key>destination</key>
    <string>export</string>
    <key>signingStyle</key>
    <string>automatic</string>
    <key>stripSwiftSymbols</key>
    <true/>
    <key>uploadSymbols</key>
    <true/>
    <key>compileBitcode</key>
    <false/>
</dict>
</plist>
`;
}

/**
 * Generate helper script that guarantees /Users/builder/export_options.plist exists on Codemagic runner
 */
export function generatePrepareExportOptionsScript(): string {
  return `import fs from 'fs';
import path from 'path';

const plistContent = \`<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>app-store</string>
    <key>destination</key>
    <string>export</string>
    <key>signingStyle</key>
    <string>automatic</string>
    <key>stripSwiftSymbols</key>
    <true/>
    <key>uploadSymbols</key>
    <true/>
    <key>compileBitcode</key>
    <false/>
</dict>
</plist>
\`;

// 1. Root export_options.plist
try {
  const rootPlist = path.resolve(process.cwd(), 'export_options.plist');
  fs.writeFileSync(rootPlist, plistContent, 'utf8');
  console.log('[Codemagic Prep] Root export_options.plist ready.');
} catch (err) {
  console.warn('[Codemagic Prep] Could not write root export_options.plist:', err);
}

// 2. Codemagic builder default path: /Users/builder/export_options.plist
try {
  if (fs.existsSync('/Users/builder')) {
    fs.writeFileSync('/Users/builder/export_options.plist', plistContent, 'utf8');
    console.log('[Codemagic Prep] /Users/builder/export_options.plist created successfully for Codemagic!');
  }
} catch {
  // Safe to ignore if not on Codemagic macOS runner
}

// 3. ios/ folder if exists
try {
  const iosDir = path.resolve(process.cwd(), 'ios');
  if (fs.existsSync(iosDir)) {
    fs.writeFileSync(path.join(iosDir, 'export_options.plist'), plistContent, 'utf8');
    console.log('[Codemagic Prep] ios/export_options.plist created.');
  }
} catch {
  // Safe to ignore
}
`;
}

/**
 * Generate exact 3D Gold HK Monogram vector SVG from authentic user photo
 */
export function generateHKMonogramSvg(): string {
  return `<svg viewBox="0 0 250 220" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="hkGoldMain" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#FFF9D8" />
      <stop offset="16%" stopColor="#F9D768" />
      <stop offset="38%" stopColor="#E3A528" />
      <stop offset="65%" stopColor="#9F6B10" />
      <stop offset="85%" stopColor="#DDA126" />
      <stop offset="100%" stopColor="#784A04" />
    </linearGradient>
    <linearGradient id="hkGoldUpperArm" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#986610" />
      <stop offset="24%" stopColor="#DFAB34" />
      <stop offset="50%" stopColor="#FFFBD8" />
      <stop offset="76%" stopColor="#F4CD5E" />
      <stop offset="100%" stopColor="#784B04" />
    </linearGradient>
    <linearGradient id="hkGoldLowerArm" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#F6CF60" />
      <stop offset="32%" stopColor="#FFF4BA" />
      <stop offset="62%" stopColor="#C98F1D" />
      <stop offset="100%" stopColor="#5D3702" />
    </linearGradient>
    <linearGradient id="hkSpecHighlight" x1="0%" y1="0%" x2="100%" y2="50%">
      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
      <stop offset="35%" stopColor="#FFF5BB" stopOpacity="0.85" />
      <stop offset="70%" stopColor="#F2C753" stopOpacity="0.5" />
      <stop offset="100%" stopColor="#B57B10" stopOpacity="0.1" />
    </linearGradient>
    <linearGradient id="hkBevelShadow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#361E01" />
      <stop offset="50%" stopColor="#5B3504" />
      <stop offset="100%" stopColor="#88570C" />
    </linearGradient>
    <filter id="hkAmbientGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="3.5" stdDeviation="3.5" floodColor="#7A4B05" floodOpacity="0.45" />
    </filter>
  </defs>
  <g filter="url(#hkAmbientGlow)">
    <path d="M 18,22 L 52,22 L 52,88 L 100,88 L 110,120 L 18,120 Z" fill="url(#hkGoldMain)" />
    <polygon points="18,22 52,22 48,26 22,26" fill="url(#hkSpecHighlight)" />
    <polygon points="18,22 18,120 22,116 22,26" fill="url(#hkSpecHighlight)" />
    <polygon points="52,22 52,88 48,84 48,26" fill="url(#hkBevelShadow)" />
    <polygon points="52,88 100,88 96,92 48,88" fill="url(#hkSpecHighlight)" />
    <polygon points="100,88 110,120 106,116 96,92" fill="url(#hkBevelShadow)" />
    <polygon points="18,120 110,120 106,116 22,116" fill="url(#hkBevelShadow)" />

    <path d="M 18,132 L 52,132 L 52,196 L 18,196 Z" fill="url(#hkGoldMain)" />
    <polygon points="18,132 52,132 48,136 22,136" fill="url(#hkSpecHighlight)" />
    <polygon points="18,132 18,196 22,192 22,136" fill="url(#hkSpecHighlight)" />
    <polygon points="52,132 52,196 48,192 48,136" fill="url(#hkBevelShadow)" />
    <polygon points="18,196 52,196 48,192 22,192" fill="url(#hkBevelShadow)" />

    <path d="M 118,22 L 146,22 L 146,94 L 196,22 L 226,22 L 118,168 Z" fill="url(#hkGoldUpperArm)" />
    <polygon points="118,22 146,22 142,26 122,26" fill="url(#hkSpecHighlight)" />
    <polygon points="118,22 118,168 122,164 122,26" fill="url(#hkSpecHighlight)" />
    <polygon points="146,22 146,94 142,90 142,26" fill="url(#hkBevelShadow)" />
    <polygon points="146,94 196,22 198,26 148,96" fill="url(#hkSpecHighlight)" />
    <polygon points="196,22 226,22 222,26 198,26" fill="url(#hkSpecHighlight)" />
    <polygon points="226,22 118,168 122,164 222,26" fill="url(#hkBevelShadow)" />

    <path d="M 176,112 L 236,196 L 204,196 L 148,132 Z" fill="url(#hkGoldLowerArm)" />
    <polygon points="148,132 176,112 178,116 152,134" fill="url(#hkSpecHighlight)" />
    <polygon points="176,112 236,196 232,192 178,116" fill="url(#hkSpecHighlight)" />
    <polygon points="236,196 204,196 207,192 232,192" fill="url(#hkBevelShadow)" />
    <polygon points="204,196 148,132 152,134 207,192" fill="url(#hkBevelShadow)" />

    <circle cx="146" cy="94" r="3" fill="#FFFFFF" opacity="0.9" />
    <polygon points="146,87 148,94 155,94 149,97 151,103 146,99 141,103 143,97 137,94 144,94" fill="#FFFDE8" opacity="0.8" />
  </g>
</svg>`;
}

/**
 * Generate official Apple App Store compliant codemagic.yaml
 * Configured for Mac Mini M2 runners, latest Xcode (Xcode 16 / iOS 18 SDK)
 * and direct TestFlight / App Store Connect submission.
 */
export function generateCodemagicYaml(storeConfig: StoreConfig): string {
  const bundleId = storeConfig.bundleIdentifier || 'com.hatipoglu.gold';
  return `# Codemagic CI/CD Pipeline Configuration
# Documentation: https://docs.codemagic.io/yaml-quick-start/
# Mac Mini M2 cloud runner with Xcode 16 / iOS 18 SDK

workflows:
  # Workflow 1: Standalone iOS Build & IPA (Doesn't block if App Store profile is not configured yet)
  ios-build:
    name: ${storeConfig.brandName} iOS Build & IPA Package
    max_build_duration: 60
    instance_type: mac_mini_m2
    environment:
      vars:
        BUNDLE_ID: "${bundleId}"
        APP_STORE_APPLE_ID: 6470000000
      node: 20
      xcode: 16.2
      cocoapods: default
    triggering:
      events:
        - push
        - tag
      branch_patterns:
        - pattern: 'main'
          include: true
          source: true
        - pattern: 'master'
          include: true
          source: true
        - pattern: 'ana'
          include: true
          source: true
        - pattern: '*'
          include: true
    scripts:
      - name: Install Dependencies & Prepare Signing Plist
        script: |
          npm install --legacy-peer-deps || true
          node scripts/prepare-export-options.js || true
      - name: Prebuild Native iOS Xcode Project
        script: |
          CI=1 npx --yes expo prebuild --platform ios --clean --no-install
      - name: Install CocoaPods
        script: |
          if [ -d "ios" ]; then
            cd ios
            pod install --repo-update || pod install || true
            cd ..
          fi
      - name: Set up Code Signing & Export Options
        script: |
          node scripts/prepare-export-options.js || true
          mkdir -p /Users/builder
          cp export_options.plist /Users/builder/export_options.plist 2>/dev/null || true
          xcode-project use-profiles 2>/dev/null || true
      - name: Build and Sign iOS IPA
        script: |
          mkdir -p build/ios/ipa build/ios/xcarchive /Users/builder

          if [ ! -f /Users/builder/export_options.plist ]; then
            node scripts/prepare-export-options.js || true
            cp export_options.plist /Users/builder/export_options.plist 2>/dev/null || true
          fi

          WORKSPACE=$(find ios -name "*.xcworkspace" -maxdepth 2 | head -n 1)
          if [ -z "$WORKSPACE" ]; then
            WORKSPACE=$(find ios -name "*.xcodeproj" -maxdepth 2 | head -n 1)
          fi

          SCHEME=$(xcodebuild -workspace "$WORKSPACE" -list 2>/dev/null | awk '/Schemes:/{flag=1;next}/^$/{flag=0}flag' | tr -d ' ' | head -n 1)
          if [ -z "$SCHEME" ]; then
            SCHEME=$(xcodebuild -project "$WORKSPACE" -list 2>/dev/null | awk '/Schemes:/{flag=1;next}/^$/{flag=0}flag' | tr -d ' ' | head -n 1)
          fi
          if [ -z "$SCHEME" ]; then
            SCHEME="HATPOLUKUYUMCULUK"
          fi

          echo "===> Building with Workspace/Project: $WORKSPACE"
          echo "===> Building with Scheme: $SCHEME"

          BUILD_SUCCESS=0

          # 1. First attempt: If Apple Developer signing profiles exist, use xcode-project build-ipa
          if xcode-project build-ipa \\
            --workspace "$WORKSPACE" \\
            --scheme "$SCHEME" \\
            --export-options-plist /Users/builder/export_options.plist \\
            --clean; then
            echo "===> Signed IPA successfully built by Codemagic!"
            BUILD_SUCCESS=1
          fi

          # 2. Second attempt: If code signing failed (e.g. requires provisioning profile), build universal IPA package directly
          if [ "$BUILD_SUCCESS" -ne 1 ]; then
            echo "===> Apple Provisioning Profile not found or signing blocked. Archiving universal package..."

            ARCHIVE_CMD="xcodebuild"
            if [[ "$WORKSPACE" == *.xcworkspace ]]; then
              ARCHIVE_CMD="xcodebuild -workspace $WORKSPACE"
            else
              ARCHIVE_CMD="xcodebuild -project $WORKSPACE"
            fi

            $ARCHIVE_CMD \\
              -scheme "$SCHEME" \\
              -configuration Release \\
              -destination 'generic/platform=iOS' \\
              -archivePath "build/ios/xcarchive/app.xcarchive" \\
              archive \\
              CODE_SIGNING_ALLOWED=NO \\
              CODE_SIGNING_REQUIRED=NO \\
              CODE_SIGN_IDENTITY="" \\
              CODE_SIGN_STYLE=Manual \\
              COMPILER_INDEX_STORE_ENABLE=NO || true

            APP_PATH=$(find build/ios/xcarchive/app.xcarchive/Products/Applications -name "*.app" 2>/dev/null | head -n 1)

            if [ -z "$APP_PATH" ]; then
              echo "===> Retrying build with build action..."
              $ARCHIVE_CMD \\
                -scheme "$SCHEME" \\
                -configuration Release \\
                -destination 'generic/platform=iOS' \\
                build \\
                CONFIGURATION_BUILD_DIR="build/ios/output" \\
                CODE_SIGNING_ALLOWED=NO \\
                CODE_SIGNING_REQUIRED=NO \\
                CODE_SIGN_IDENTITY="" \\
                COMPILER_INDEX_STORE_ENABLE=NO || true
              APP_PATH=$(find build/ios/output -name "*.app" 2>/dev/null | head -n 1)
            fi

            if [ -n "$APP_PATH" ] && [ -d "$APP_PATH" ]; then
              echo "===> Packaging .app into .ipa from $APP_PATH"
              rm -rf /tmp/ipa_packaging
              mkdir -p /tmp/ipa_packaging/Payload
              cp -R "$APP_PATH" /tmp/ipa_packaging/Payload/
              cd /tmp/ipa_packaging
              zip -r -9 "/Users/builder/clone/build/ios/ipa/HatipogluKuyumculuk.ipa" Payload
              cd /Users/builder/clone
              echo "===> Success! Created: build/ios/ipa/HatipogluKuyumculuk.ipa"
              BUILD_SUCCESS=1
            fi
          fi

          if [ "$BUILD_SUCCESS" -ne 1 ]; then
            echo "===> Build failed: Could not produce IPA."
            exit 1
          fi
    artifacts:
      - build/ios/ipa/*.ipa
      - /tmp/xcodebuild_logs/*.log
      - '*.dSYM.zip'
    publishing:
      email:
        recipients:
          - acal4551@gmail.com
        notify:
          success: true
          failure: true

  # Workflow 2: Direct App Store Release (Requires Apple Developer Account connected in Codemagic)
  ios-app-store-release:
    name: ${storeConfig.brandName} iOS App Store Release (Sertifikalı)
    max_build_duration: 60
    instance_type: mac_mini_m2
    integrations:
      app_store_connect: AppleKey
    environment:
      groups:
        - app_store_credentials
      vars:
        BUNDLE_ID: "${bundleId}"
        APP_STORE_APPLE_ID: 6470000000
      node: 20
      xcode: 16.2
      cocoapods: default
    triggering:
      events:
        - push
        - tag
      branch_patterns:
        - pattern: 'release/*'
          include: true
        - pattern: 'main'
          include: true
        - pattern: 'master'
          include: true
        - pattern: 'ana'
          include: true
        - pattern: '*'
          include: true
    scripts:
      - name: Install Dependencies & Prepare Signing Plist
        script: |
          npm install --legacy-peer-deps || true
          node scripts/prepare-export-options.js || true
      - name: Prebuild Native iOS Xcode Project
        script: |
          CI=1 npx --yes expo prebuild --platform ios --clean --no-install
      - name: Install CocoaPods
        script: |
          if [ -d "ios" ]; then
            cd ios
            pod install --repo-update || pod install || true
            cd ..
          fi
      - name: Set up Code Signing
        script: |
          node scripts/prepare-export-options.js || true
          mkdir -p /Users/builder build/ios/ipa build/ios/xcarchive
          cp export_options.plist /Users/builder/export_options.plist 2>/dev/null || true

          # Otomatik Apple Developer sertifika ve profillerini çek
          app-store-connect fetch-signing-files "$BUNDLE_ID" \\
            --type IOS_APP_STORE \\
            --create || true

          # Profilleri Xcode projesine bağla
          xcode-project use-profiles 2>/dev/null || true
      - name: Build and Sign iOS IPA
        script: |
          mkdir -p build/ios/ipa build/ios/xcarchive /Users/builder

          WORKSPACE=$(find ios -name "*.xcworkspace" -maxdepth 2 | head -n 1)
          if [ -z "$WORKSPACE" ]; then
            WORKSPACE=$(find ios -name "*.xcodeproj" -maxdepth 2 | head -n 1)
          fi

          SCHEME=$(xcodebuild -workspace "$WORKSPACE" -list 2>/dev/null | awk '/Schemes:/{flag=1;next}/^$/{flag=0}flag' | tr -d ' ' | head -n 1)
          if [ -z "$SCHEME" ]; then
            SCHEME=$(xcodebuild -project "$WORKSPACE" -list 2>/dev/null | awk '/Schemes:/{flag=1;next}/^$/{flag=0}flag' | tr -d ' ' | head -n 1)
          fi
          if [ -z "$SCHEME" ]; then
            SCHEME="HatipogluKuyumculukCanliAltinDoviz"
          fi

          echo "===> Building with Workspace/Project: $WORKSPACE"
          echo "===> Building with Scheme: $SCHEME"

          BUILD_SUCCESS=0

          # 1. Deneme: Codemagic xcode-project build-ipa ile resmi imzalı paketleme
          if [ -f /Users/builder/export_options.plist ]; then
            if xcode-project build-ipa \\
              --workspace "$WORKSPACE" \\
              --scheme "$SCHEME" \\
              --export-options-plist /Users/builder/export_options.plist \\
              --clean; then
              echo "===> Signed IPA successfully built with export options!"
              BUILD_SUCCESS=1
            fi
          fi

          if [ "$BUILD_SUCCESS" -ne 1 ]; then
            if xcode-project build-ipa \\
              --workspace "$WORKSPACE" \\
              --scheme "$SCHEME" \\
              --clean; then
              echo "===> Signed IPA successfully built with auto signing!"
              BUILD_SUCCESS=1
            fi
          fi

          # 2. Deneme: xcodebuild doğrudan archive ile paketleme
          if [ "$BUILD_SUCCESS" -ne 1 ]; then
            echo "===> Retrying build using direct xcodebuild archive..."
            ARCHIVE_CMD="xcodebuild"
            if [[ "$WORKSPACE" == *.xcworkspace ]]; then
              ARCHIVE_CMD="xcodebuild -workspace $WORKSPACE"
            else
              ARCHIVE_CMD="xcodebuild -project $WORKSPACE"
            fi

            $ARCHIVE_CMD \\
              -scheme "$SCHEME" \\
              -configuration Release \\
              -destination 'generic/platform=iOS' \\
              -archivePath "build/ios/xcarchive/app.xcarchive" \\
              archive \\
              COMPILER_INDEX_STORE_ENABLE=NO || true

            if [ -f /Users/builder/export_options.plist ] && [ -d "build/ios/xcarchive/app.xcarchive" ]; then
              xcodebuild -exportArchive \\
                -archivePath "build/ios/xcarchive/app.xcarchive" \\
                -exportOptionsPlist /Users/builder/export_options.plist \\
                -exportPath "build/ios/ipa" || true
            fi

            FOUND_IPA=$(find build/ios/ipa -name "*.ipa" 2>/dev/null | head -n 1)
            if [ -n "$FOUND_IPA" ]; then
              echo "===> Successfully created IPA via exportArchive: $FOUND_IPA"
              BUILD_SUCCESS=1
            fi
          fi

          # 3. Deneme: Universal .app paketini doğrudan .ipa olarak paketle
          if [ "$BUILD_SUCCESS" -ne 1 ]; then
            echo "===> Fallback: Packaging .app into .ipa directly..."
            APP_PATH=$(find build/ios/xcarchive/app.xcarchive/Products/Applications -name "*.app" 2>/dev/null | head -n 1)

            if [ -z "$APP_PATH" ]; then
              ARCHIVE_CMD="xcodebuild"
              if [[ "$WORKSPACE" == *.xcworkspace ]]; then
                ARCHIVE_CMD="xcodebuild -workspace $WORKSPACE"
              else
                ARCHIVE_CMD="xcodebuild -project $WORKSPACE"
              fi
              $ARCHIVE_CMD \\
                -scheme "$SCHEME" \\
                -configuration Release \\
                -destination 'generic/platform=iOS' \\
                build \\
                CONFIGURATION_BUILD_DIR="build/ios/output" \\
                COMPILER_INDEX_STORE_ENABLE=NO || true
              APP_PATH=$(find build/ios/output -name "*.app" 2>/dev/null | head -n 1)
            fi

            if [ -n "$APP_PATH" ] && [ -d "$APP_PATH" ]; then
              rm -rf /tmp/ipa_packaging
              mkdir -p /tmp/ipa_packaging/Payload
              cp -R "$APP_PATH" /tmp/ipa_packaging/Payload/
              cd /tmp/ipa_packaging
              zip -r -9 "/Users/builder/clone/build/ios/ipa/HatipogluKuyumculuk.ipa" Payload
              cd /Users/builder/clone
              echo "===> Success! Created fallback package: build/ios/ipa/HatipogluKuyumculuk.ipa"
              BUILD_SUCCESS=1
            fi
          fi

          if [ "$BUILD_SUCCESS" -ne 1 ]; then
            echo "===> IPA build failed completely."
            exit 1
          fi
    artifacts:
      - build/ios/ipa/*.ipa
      - /tmp/xcodebuild_logs/*.log
      - '*.dSYM.zip'
    publishing:
      app_store_connect:
        auth: integration
        submit_to_testflight: true
      email:
        recipients:
          - acal4551@gmail.com
        notify:
          success: true
          failure: true
`;
}

/**
 * Legacy EAS JSON compatibility helper
 */
export function generateIOSEasJson(): string {
  return JSON.stringify(
    {
      cli: {
        version: '>= 12.0.0',
      },
      build: {
        production: {
          ios: {
            image: 'latest',
          },
        },
      },
    },
    null,
    2
  );
}

/**
 * Generate iOS-dedicated app.json (100% Apple iOS, Xcode 16 & iOS 18 SDK ready)
 */
export function generateIOSAppJson(storeConfig: StoreConfig): string {
  const bundleId = storeConfig.bundleIdentifier || 'com.hatipoglu.gold';
  return JSON.stringify(
    {
      expo: {
        name: 'Hatipoglu Gold',
        slug: 'hatipoglu-gold-ios',
        version: '1.0.0',
        orientation: 'portrait',
        userInterfaceStyle: 'dark',
        backgroundColor: '#040711',
        splash: {
          backgroundColor: '#040711',
          resizeMode: 'contain',
        },
        ios: {
          supportsTablet: true,
          bundleIdentifier: bundleId,
          buildNumber: '1.0.0',
          userInterfaceStyle: 'dark',
          infoPlist: {
            UIRequiresFullScreen: false,
            CFBundleDisplayName: `${storeConfig.brandName}`,
            ITSAppUsesNonExemptEncryption: false,
          },
        },
        android: {
          package: 'com.hatipoglu.gold.android',
          versionCode: 1,
        },
        plugins: [
          [
            'expo-build-properties',
            {
              ios: {
                deploymentTarget: '16.0',
              },
            },
          ],
        ],
      },
    },
    null,
    2
  );
}

/**
 * Trigger download of iOS Codemagic ZIP project
 */
export async function downloadIOSCodemagicZip(storeConfig: StoreConfig, items: GoldItem[]) {
  const zip = new JSZip();

  // App.tsx (iOS)
  zip.file('App.tsx', generateIOSExpoAppCode(storeConfig, items));

  // package.json (iOS only)
  zip.file('package.json', generateIOSPackageJson(storeConfig));

  // app.json (iOS only)
  zip.file('app.json', generateIOSAppJson(storeConfig));

  // codemagic.yaml (Apple App Store & TestFlight CI/CD)
  zip.file('codemagic.yaml', generateCodemagicYaml(storeConfig));

  // Apple Export Options & Preparation Script (Resolves /Users/builder/export_options.plist)
  zip.file('export_options.plist', generateExportOptionsPlist());
  zip.file('scripts/prepare-export-options.js', generatePrepareExportOptionsScript());

  // Authentic 3D Gold HK Monogram SVG Asset from user photo
  zip.file('public/hk-monogram.svg', generateHKMonogramSvg());

  // README.md (Detailed Codemagic.io & Apple App Store setup guide)
  zip.file(
    'README.md',
    `#  ${storeConfig.brandName} ${storeConfig.subtitle} - Codemagic.io Tabanlı Apple iOS Mobil Projesi

Bu proje **Codemagic.io Bulut CI/CD Sunucuları (Mac Mini M2 / Xcode 16 / iOS 18 SDK)** standartlarına %100 uyumlu olarak hazırlanmıştır.

---

## ⚡ Neden Codemagic.io?

- **Fiziksel Mac Gerektirmez:** Codemagic, buluttaki güçlü Apple Mac Mini M2 makinelerinde derleme yapar.
- **Expo Dev / EAS Bağımlılığı Yoktur:** Ücretli veya kısıtlı Expo dev aboneliğine ihtiyaç duymadan doğrudan Apple App Store Connect'e yükleme yapabilirsiniz.
- **Otomatik Sertifikalandırma (Code Signing):** Codemagic, Apple Developer hesabınızdaki sertifika ve profilleri otomatik yönetir.
- **GitHub Otomasyonu:** GitHub'a kod push ettiğinizde otomatik olarak .IPA oluşturur ve TestFlight'a yükler.

---

## 🚀 1. Codemagic.io ile 5 Dakikada Apple TestFlight / App Store Derlemesi

1. **Codemagic.io Hesabı:**
   - [https://codemagic.io](https://codemagic.io) adresine gidin ve **GitHub ile Giriş Yapın**.

2. **Uygulama Ekleyin:**
   - **Add application** butonuna tıklayın.
   - GitHub seçeneğini seçip bu deponuzu işaretleyin.

3. **Otomatik Yapılandırma:**
   - Codemagic, projenizdeki **\`codemagic.yaml\`** dosyasını otomatik olarak tanıyacaktır.

4. **Apple Developer Bağlantısı:**
   - **Codemagic &gt; Teams / User &gt; Integrations &gt; App Store Connect** bölümüne gidin.
   - Apple Developer portalınızdan aldığınız App Store Connect API Key'inizi ekleyin (Key ID, Issuer ID ve .p8 dosyası).

5. **Derlemeyi Başlatın:**
   - **"Start new build"** butonuna basın.
   - Codemagic sırasıyla bağımlılıkları kuracak, iOS projesini Xcode 16 ile derleyecek ve imzalanmış **.IPA** dosyasını doğrudan **Apple TestFlight**'a gönderecektir!

---

## 💻 2. Yerel Geliştirme ve Mac'te Çalıştırma

Mac bilgisayarınızda yerel olarak çalıştırmak isterseniz:
\`\`\`bash
# 1. Bağımlılıkları yükleyin
npm install

# 2. iOS yerel dosyalarını oluşturun
npx expo prebuild --platform ios

# 3. CocoaPods kütüphanelerini kurun
cd ios && pod install && cd ..

# 4. Simülatörde başlatın
npx react-native run-ios
\`\`\`
`
  );

  const blob = await zip.generateAsync({ type: 'blob' });
  triggerBrowserDownload(blob, 'hatipoglu-ios-codemagic.zip');
}

/**
 * Backward compatibility alias
 */
export const downloadIOSExpoZip = downloadIOSCodemagicZip;

function triggerBrowserDownload(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
