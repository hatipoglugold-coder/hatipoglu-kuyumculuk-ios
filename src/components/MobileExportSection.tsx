import React, { useState } from 'react';
import {
  Download,
  Terminal,
  Copy,
  Check,
  FileCode,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Apple,
  Smartphone,
  ShieldCheck,
  Cpu,
  Cloud,
} from 'lucide-react';
import { GoldItem, StoreConfig } from '../types';
import {
  downloadIOSCodemagicZip,
  generateIOSExpoAppCode,
  generateIOSPackageJson,
  generateIOSAppJson,
  generateCodemagicYaml,
} from '../utils/mobileExport';

interface MobileExportSectionProps {
  storeConfig: StoreConfig;
  items: GoldItem[];
  isDarkMode?: boolean;
  onOpenAppStoreAssets?: () => void;
}

export const MobileExportSection: React.FC<MobileExportSectionProps> = ({
  storeConfig,
  items,
  isDarkMode = true,
  onOpenAppStoreAssets,
}) => {
  const [downloading, setDownloading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showCodeGuide, setShowCodeGuide] = useState(false);

  const copyToClipboard = (text: string, key: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadIOSCodemagicZip(storeConfig, items);
    } finally {
      setDownloading(false);
    }
  };

  const localMacBashCommand = `# 1. Bağımlılıkları yükleyin\nnpm install\n\n# 2. iOS yerel Xcode projesini oluşturun\nnpx expo prebuild --platform ios\n\n# 3. CocoaPods kütüphanelerini kurun\ncd ios && pod install && cd ..\n\n# 4. Mac iOS Simülatöründe başlatın\nnpx react-native run-ios`;

  const codemagicPipelineSteps = `# Codemagic.io Mac Mini M2 Bulut CI/CD Adımları:\n1. GitHub deposundaki codemagic.yaml otomatik algılanır\n2. npm install\n3. npx expo prebuild --platform ios --clean\n4. cd ios && pod install\n5. xcode-project use-profiles\n6. xcode-project build-ipa --workspace "ios/*.xcworkspace" --scheme "hatipoglu-gold-ios"\n7. Doğrudan Apple TestFlight / App Store Connect'e yükleme`;

  return (
    <div
      className={`rounded-2xl p-5 mt-5 shadow-2xl border transition-all ${
        isDarkMode
          ? 'bg-gradient-to-b from-[#0B1328] via-[#080E1C] to-[#050912] border-amber-500/40'
          : 'bg-white border-slate-200'
      }`}
    >
      {/* iOS Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-amber-500/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-widest uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
              <Apple className="w-3 h-3" />
              SADECE iOS & CODEMAGIC
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 flex items-center gap-1">
              <Cpu className="w-3 h-3" />
              Mac Mini M2 Bulut CI/CD
            </span>
          </div>

          <h3
            className={`text-lg font-black tracking-tight font-cinzel mt-1.5 flex items-center gap-2 ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            <span>Apple iOS & Codemagic.io Bulut Derleme Merkezi</span>
          </h3>

          <p
            className={`text-xs mt-1 leading-relaxed max-w-2xl ${
              isDarkMode ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            Fiziksel Mac bilgisayara veya Expo dev aboneliğine ihtiyaç duymadan,{' '}
            <strong>Codemagic.io</strong> bulut sunucuları üzerinden Apple TestFlight ve App Store
            Connect için <strong>.IPA</strong> paketini tek tıkla derleyin.
          </p>
        </div>

        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
            isDarkMode
              ? 'bg-gradient-to-br from-amber-500/30 to-amber-500/10 border border-amber-500/40 text-amber-400'
              : 'bg-amber-100 border border-amber-300 text-amber-800'
          }`}
        >
          <Apple className="w-7 h-7" />
        </div>
      </div>

      {/* Main Single Action Card for iOS Codemagic */}
      <div className="mt-4 p-4 rounded-xl bg-[#040814] border border-[#192742]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-extrabold text-white">
                hatipoglu-ios-codemagic.zip Proje Paketi
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                100% Codemagic & Apple Uyumlu
              </span>
            </div>
            <p className="text-xs text-slate-400">
              İçindekiler: <strong className="text-slate-200">codemagic.yaml</strong> (Mac Mini M2 & Xcode 16 Pipeline),{' '}
              <strong className="text-slate-200">App.tsx</strong> (iOS Canlı Altın Arayüzü),{' '}
              <strong className="text-slate-200">app.json</strong> (iOS 18 SDK & Bundle ID:{' '}
              <code>{storeConfig.bundleIdentifier || 'com.hatipoglu.kuyumculuk.ios'}</code>),{' '}
              <strong className="text-slate-200">package.json</strong> ve Kurulum Rehberi.
            </p>
          </div>

          <button
            onClick={handleDownload}
            disabled={downloading}
            className="py-3 px-6 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black rounded-xl text-sm shadow-xl shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
          >
            {downloading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>iOS Paketi Hazırlanıyor...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <Apple className="w-4 h-4" />
                <span>iOS Codemagic Projesini İndir (.ZIP)</span>
              </>
            )}
          </button>
        </div>

        {/* Apple App Store Connect Assets Banner (10 Images + 3 Videos) */}
        <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-blue-950/40 via-[#060D1E] to-blue-950/30 border border-blue-500/30 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-amber-400 text-sm font-black flex items-center gap-1">
                 Apple App Store Yükleme Varlıkları
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                10 Görsel & 3 Video Hazır
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Apple 6.7" (1284x2778) & 6.5" (1242x2688) ekran görüntüleri + 3 adet 886x1920 MP4 önizleme videosu + Yükleme Rehberi.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {onOpenAppStoreAssets && (
              <button
                onClick={onOpenAppStoreAssets}
                className="py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all active:scale-95 flex items-center gap-1.5"
              >
                <span>Önizle & Seç</span>
              </button>
            )}
            <a
              href="/app-store-assets/hatipoglu-apple-store-paketi.zip"
              download="hatipoglu-apple-store-paketi.zip"
              className="py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-md shadow-amber-500/20 transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tüm Paketi İndir (.ZIP - 5.6 MB)</span>
            </a>
          </div>
        </div>

        {/* 3 Step Codemagic Cloud Setup Preview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-4 pt-4 border-t border-slate-800">
          <div className="p-3 rounded-lg bg-[#060C1C] border border-[#16233B]">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-1">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-[10px] font-black">
                1
              </span>
              <span>GitHub'a Gönderin</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Yönetici panelindeki <strong>"GitHub'a Gönder"</strong> butonuna basarak projeyi deponuza aktarın.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[#060C1C] border border-[#16233B]">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-1">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-[10px] font-black">
                2
              </span>
              <span>Codemagic'te Ekleyin</span>
            </div>
            <p className="text-[11px] text-slate-400">
              <strong>codemagic.io</strong>'da GitHub ile giriş yapıp deponuzu seçin; <code>codemagic.yaml</code> anında algılanır.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[#060C1C] border border-[#16233B]">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-1">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-[10px] font-black">
                3
              </span>
              <span>Bulutta .IPA Derleyin</span>
            </div>
            <p className="text-[11px] text-slate-400">
              <strong>"Start new build"</strong> butonuna basın; Mac Mini M2 makineleri TestFlight & App Store için derler.
            </p>
          </div>
        </div>
      </div>

      {/* Accordion for Quick Code Copy and Terminal Instructions */}
      <div className="mt-3.5 pt-2 border-t border-slate-800">
        <button
          type="button"
          onClick={() => setShowCodeGuide(!showCodeGuide)}
          className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
            isDarkMode
              ? 'bg-[#080E1C] hover:bg-[#0E172C] text-slate-200 border border-[#1A263D]'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-amber-400" />
            <span>Codemagic.yaml & Yerel Çalıştırma Komutlarını Görüntüle</span>
          </div>
          {showCodeGuide ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {showCodeGuide && (
          <div className="mt-3 space-y-3 animate-fadeIn">
            {/* Codemagic Cloud Pipeline Steps */}
            <div className="p-3.5 rounded-xl bg-[#03060E] border border-amber-500/30">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Apple className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-xs font-bold text-amber-400">
                    Codemagic.io Bulut CI/CD İş Akışı (Mac Mini M2 • Xcode 16)
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(codemagicPipelineSteps, 'codemagic-steps')}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 flex items-center gap-1.5 active:scale-95 transition-all border border-amber-500/30"
                >
                  {copiedKey === 'codemagic-steps' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" /> Kopyalandı!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> Akış Adımlarını Kopyala
                    </>
                  )}
                </button>
              </div>
              <p className="text-[11px] text-slate-300 mb-2 leading-relaxed">
                Codemagic, deponuzdaki <code>codemagic.yaml</code> talimatlarını sırayla çalıştırır:
              </p>
              <pre className="text-[11px] font-mono bg-black/60 p-2.5 rounded-lg text-emerald-400 overflow-x-auto leading-relaxed">
                {codemagicPipelineSteps}
              </pre>
            </div>

            {/* codemagic.yaml Code Copy Box */}
            <div className="p-3.5 rounded-xl bg-[#03060E] border border-[#18263D]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5" /> codemagic.yaml (Apple App Store / CI/CD Ayarı)
                </span>
                <button
                  onClick={() => copyToClipboard(generateCodemagicYaml(storeConfig), 'codemagic-yaml-code')}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#132038] hover:bg-[#1E3050] text-cyan-300 flex items-center gap-1.5 active:scale-95 transition-all"
                >
                  {copiedKey === 'codemagic-yaml-code' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" /> codemagic.yaml Kopyalandı!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> codemagic.yaml Kopyala
                    </>
                  )}
                </button>
              </div>
              <pre className="text-[10px] font-mono bg-black/60 p-2.5 rounded-lg text-cyan-300/90 overflow-x-auto max-h-48 leading-relaxed">
                {generateCodemagicYaml(storeConfig)}
              </pre>
            </div>

            {/* Local Mac Bash Command Box */}
            <div className="p-3.5 rounded-xl bg-[#03060E] border border-[#18263D]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" /> Mac & Xcode Simülatöründe Yerel Test
                </span>
                <button
                  onClick={() => copyToClipboard(localMacBashCommand, 'local-mac-bash')}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#132038] hover:bg-[#1E3050] text-amber-300 flex items-center gap-1.5 active:scale-95 transition-all"
                >
                  {copiedKey === 'local-mac-bash' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" /> Kopyalandı!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> Komutları Kopyala
                    </>
                  )}
                </button>
              </div>
              <pre className="text-[11px] font-mono bg-black/60 p-2.5 rounded-lg text-amber-300/90 overflow-x-auto">
                {localMacBashCommand}
              </pre>
            </div>

            {/* iOS App.tsx Code Copy Box */}
            <div className="p-3.5 rounded-xl bg-[#03060E] border border-[#18263D]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5 text-amber-400" /> iOS App.tsx Kaynak Kodu
                </span>
                <button
                  onClick={() =>
                    copyToClipboard(generateIOSExpoAppCode(storeConfig, items), 'ios-app-code')
                  }
                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#132038] hover:bg-[#1E3050] text-amber-300 flex items-center gap-1.5 active:scale-95 transition-all"
                >
                  {copiedKey === 'ios-app-code' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" /> Kod Kopyalandı!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> iOS App.tsx Kopyala
                    </>
                  )}
                </button>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Bu kodu doğrudan projenizdeki <code>App.tsx</code> dosyasına yapıştırabilir veya en
                üstteki <strong>iOS Codemagic Projesini İndir</strong> butonuna basarak <code>codemagic.yaml</code>,{' '}
                <code>app.json</code> ve tüm yapılandırmayı hazır ZIP olarak alabilirsiniz.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
