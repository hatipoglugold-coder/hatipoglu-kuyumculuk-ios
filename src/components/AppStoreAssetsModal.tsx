import React, { useState } from 'react';
import {
  Download,
  Check,
  Film,
  Image as ImageIcon,
  FileArchive,
  Copy,
  X,
  Smartphone,
  Play,
  FileText,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface AppStoreAssetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

export const AppStoreAssetsModal: React.FC<AppStoreAssetsModalProps> = ({
  isOpen,
  onClose,
  isDarkMode,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'screenshots' | 'videos' | 'guide'>('all');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const screenshots = [
    {
      id: '01',
      title: 'Canlı Kapalıçarşı Fiyatları',
      subtitle: 'Has altın, ziynet, çeyrek ve döviz kurlarını anlık takip edin.',
      tag: 'CANLI PİYASA',
      file: 'screenshot_01_canli_piyasa.png',
    },
    {
      id: '02',
      title: 'Eski & Yeni Ziynet Altınlar',
      subtitle: 'Tam, Yarım ve Çeyrek altın alış-satış farklarını anında izleyin.',
      tag: 'ZİYNET & SİKKE',
      file: 'screenshot_02_ziynet_altinlar.png',
    },
    {
      id: '03',
      title: 'Gelişmiş Kuyumcu Hesap Makinesi',
      subtitle: 'Milyem, hurda fire düşümü ve 22 ayar bilezik hesaplamaları.',
      tag: 'HASSAS HESAPLAMA',
      file: 'screenshot_03_kuyumcu_hesaplayici.png',
    },
    {
      id: '04',
      title: 'İnteraktif Fiyat & Grafik Analizi',
      subtitle: 'Günlük, haftalık ve aylık Kapalıçarşı dalgalanma grafikleri.',
      tag: 'TREND ANALİZİ',
      file: 'screenshot_04_fiyat_grafikleri.png',
    },
    {
      id: '05',
      title: 'Akıllı Fiyat ve Hedef Alarmları',
      subtitle: 'Piyasa belirlediğiniz seviyeye ulaştığında anında sesli bildirim.',
      tag: 'HEDEF BİLDİRİMLERİ',
      file: 'screenshot_05_fiyat_alarmlari.png',
    },
    {
      id: '06',
      title: 'Kapalıçarşı Formül Motoru',
      subtitle: 'Has altın üzerinden otomatik türetilen geleneksel makas oranları.',
      tag: 'ÖZEL ÇARPANLAR',
      file: 'screenshot_06_formul_motoru.png',
    },
    {
      id: '07',
      title: 'Göz Alıcı Aydınlık ve Koyu Mod',
      subtitle: 'Safir mavi kurumsal aydınlık mod ve 24K altın gece teması.',
      tag: 'SAFİR MAVİ TEMA',
      file: 'screenshot_07_safir_aydinlik_mod.png',
    },
    {
      id: '08',
      title: 'Doğrudan Mağaza İletişimi',
      subtitle: 'Tek dokunuşla WhatsApp siparişi, telefon ve harita yol tarifi.',
      tag: 'HIZLI ERİŞİM',
      file: 'screenshot_08_magaza_iletisim.png',
    },
    {
      id: '09',
      title: 'Müşteri Adisyonu ve Hesap Fişi',
      subtitle: 'Müşterinize sunacağınız toplam alım-satım dökümünü anında paylaşın.',
      tag: 'SEPET & PORTFÖY',
      file: 'screenshot_09_musteri_adisyonu.png',
    },
    {
      id: '10',
      title: 'Güvenilir Kuyumculuk Deneyimi',
      subtitle: 'Şeffaf fiyatlandırma, 7/24 kesintisiz canlı akış ve uzman güvencesi.',
      tag: '35 YILLIK TECRÜBE',
      file: 'screenshot_10_kurumsal_guven.png',
    },
  ];

  const videos = [
    {
      id: 'v1',
      title: '1. Canlı Piyasa & Fiyat Takibi',
      subtitle: 'Anlık fiyat dalgalanmaları, yeşil/kırmızı tikleme ve ziynet kurları.',
      duration: '15 Saniye (886x1920 MP4)',
      file: 'video_01_canli_piyasa.mp4',
    },
    {
      id: 'v2',
      title: '2. Kuyumcu Hesap Makinesi & Sepet',
      subtitle: 'Çoklu ürün ekleme, milyem/hurda fire düşümü ve anlık sepet toplamı.',
      duration: '15 Saniye (886x1920 MP4)',
      file: 'video_02_hesap_makinesi.mp4',
    },
    {
      id: 'v3',
      title: '3. Çarpan Motoru & Fiyat Alarmları',
      subtitle: 'Has altın çarpan formülleri, sesli hedef bildirimleri ve mağaza hattı.',
      duration: '15 Saniye (886x1920 MP4)',
      file: 'video_03_formuller_ve_alarmlar.mp4',
    },
  ];

  const metadataFields = [
    { label: 'Uygulama Adı (App Name)', value: 'Hatipoğlu Kuyumculuk', key: 'name' },
    { label: 'Alt Başlık (Subtitle - maks 30 karakter)', value: 'Canlı Altın & Hesap Makinesi', key: 'sub' },
    { label: 'Kategori (Category)', value: 'Finance (Finans)', key: 'cat' },
    {
      label: 'Anahtar Kelimeler (Keywords)',
      value: 'altın,kapalıçarşı,çeyrek altın,has altın,bilezik,döviz,kuyumcu hesap makinesi,ziynet,canlı borsa,hatipoğlu',
      key: 'kw',
    },
    {
      label: 'Promosyon Metni (Promotional Text)',
      value: 'Kapalıçarşı serbest piyasa canlı altın, döviz ve ziynet fiyatlarını anlık takip edin, profesyonel kuyumcu hesap makinesiyle hatasız hesaplama yapın.',
      key: 'promo',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden ${
          isDarkMode ? 'bg-[#091122] border-[#1E2E4E] text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div
          className={`px-6 py-5 border-b flex items-center justify-between ${
            isDarkMode ? 'border-[#1E2E4E] bg-[#0C172E]' : 'border-slate-200 bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-black text-xl">
              
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                Apple App Store Varlık Paketi
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Hazır & İndirilebilir
                </span>
              </h2>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                10 Adet 1284x2778 & 1242x2688 Ekran Görüntüsü + 3 Adet Önizleme Videosu (886x1920 MP4)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-all ${
              isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-200 text-slate-600'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Banner: Single Click Master ZIP Download */}
        <div
          className={`px-6 py-4 border-b flex flex-col sm:flex-row items-center justify-between gap-4 ${
            isDarkMode ? 'bg-gradient-to-r from-amber-500/10 via-[#0B1528] to-amber-500/5 border-[#1E2E4E]' : 'bg-amber-50/70 border-amber-200'
          }`}
        >
          <div className="flex items-center gap-3 text-left">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400">
              <FileArchive className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-400">Tek Tıkla Tüm Apple Store Paketini İndirin</h3>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                1284x2778 & 1242x2688 PNG resimleri + 3 adet 886x1920 MP4 video + App Store Connect yükleme kılavuzu.
              </p>
            </div>
          </div>
          <a
            href="/app-store-assets/hatipoglu-apple-store-paketi.zip"
            download="hatipoglu-apple-store-paketi.zip"
            className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 active:scale-95 transition-all"
          >
            <Download className="w-4 h-4" />
            Tüm Paketi İndir (.ZIP)
          </a>
        </div>

        {/* Tab Filters */}
        <div className={`px-6 py-3 border-b flex items-center gap-2 overflow-x-auto no-scrollbar ${isDarkMode ? 'border-[#1E2E4E]' : 'border-slate-200'}`}>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'all'
                ? isDarkMode
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-blue-600 text-white'
                : isDarkMode
                ? 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Tüm Varlıklar (13)
          </button>
          <button
            onClick={() => setActiveTab('screenshots')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'screenshots'
                ? isDarkMode
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-blue-600 text-white'
                : isDarkMode
                ? 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Ekran Görüntüleri (10)
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'videos'
                ? isDarkMode
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-blue-600 text-white'
                : isDarkMode
                ? 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            Önizleme Videoları (3)
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'guide'
                ? isDarkMode
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-blue-600 text-white'
                : isDarkMode
                ? 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            App Store Connect Rehberi
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {/* Section: Videos */}
          {(activeTab === 'all' || activeTab === 'videos') && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold flex items-center gap-2 text-amber-400">
                    <Film className="w-4 h-4" />
                    App Store Önizleme Videoları (3 Adet MP4)
                  </h3>
                  <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    886x1920 piksel • 30 FPS • H.264 • Apple App Preview video spesifikasyonuna tam uyumlu
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {videos.map((vid) => (
                  <div
                    key={vid.id}
                    className={`p-4 rounded-2xl border flex flex-col justify-between ${
                      isDarkMode ? 'bg-[#0E1A33] border-[#1F2F52]' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="relative aspect-[9/16] max-h-72 w-full rounded-xl overflow-hidden bg-black flex items-center justify-center border border-slate-800">
                        <video
                          src={`/app-store-assets/videos/${vid.file}`}
                          controls
                          playsInline
                          preload="metadata"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{vid.title}</h4>
                        <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          {vid.subtitle}
                        </p>
                        <span className="inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          {vid.duration}
                        </span>
                      </div>
                    </div>

                    <a
                      href={`/app-store-assets/videos/${vid.file}`}
                      download={vid.file}
                      className={`mt-4 w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        isDarkMode
                          ? 'bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700'
                          : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200'
                      }`}
                    >
                      <Download className="w-3.5 h-3.5" />
                      Videoyu İndir (.MP4)
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Screenshots */}
          {(activeTab === 'all' || activeTab === 'screenshots') && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold flex items-center gap-2 text-amber-400">
                    <ImageIcon className="w-4 h-4" />
                    Apple App Store Ekran Görüntüleri (10 Adet)
                  </h3>
                  <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    1284 x 2778 px & 1242 x 2688 px • Apple 6.7" Super Retina XDR & 6.5" Super Retina • Türkçe Başlık & Cihaz Çerçeveli
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
                {screenshots.map((s) => (
                  <div
                    key={s.id}
                    className={`p-2.5 rounded-2xl border flex flex-col justify-between group transition-all hover:border-amber-400/50 ${
                      isDarkMode ? 'bg-[#0E1A33] border-[#1F2F52]' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="space-y-2">
                      <div
                        onClick={() => setSelectedImage(`/app-store-assets/screenshots/${s.file}`)}
                        className="relative aspect-[9/19.5] rounded-xl overflow-hidden bg-slate-950 cursor-pointer shadow-md group-hover:scale-[1.02] transition-transform"
                      >
                        <img
                          src={`/app-store-assets/thumbs/${s.file}`}
                          alt={s.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-[10px] font-bold text-amber-400">
                          #{s.id}
                        </div>
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <span className="text-[11px] font-bold text-white bg-black/80 px-2 py-1 rounded-lg">
                            Büyüt
                          </span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[9px] font-bold tracking-wider text-amber-400 uppercase">
                          {s.tag}
                        </span>
                        <h4 className="font-bold text-xs line-clamp-1 leading-tight">{s.title}</h4>
                        <p className={`text-[10px] mt-0.5 line-clamp-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          {s.subtitle}
                        </p>
                      </div>
                    </div>

                    <a
                      href={`/app-store-assets/screenshots/${s.file}`}
                      download={s.file}
                      className={`mt-2.5 w-full py-1.5 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-all ${
                        isDarkMode
                          ? 'bg-slate-800/80 hover:bg-slate-700 text-white'
                          : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-200'
                      }`}
                    >
                      <Download className="w-3 h-3 text-amber-400" />
                      İndir
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Guide & Metadata */}
          {(activeTab === 'all' || activeTab === 'guide') && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2 text-amber-400">
                  <FileText className="w-4 h-4" />
                  App Store Connect Yükleme Bilgileri & Metinleri
                </h3>
                <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Apple App Store Connect paneline kopyalayıp yapıştırabileceğiniz hazır mağaza metinleri.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {metadataFields.map((field) => (
                  <div
                    key={field.key}
                    className={`p-3.5 rounded-2xl border flex flex-col justify-between ${
                      isDarkMode ? 'bg-[#0E1A33] border-[#1F2F52]' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div>
                      <span className={`text-[11px] font-semibold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        {field.label}
                      </span>
                      <p className="font-semibold text-xs sm:text-sm mt-1 select-all">{field.value}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(field.value, field.key)}
                      className={`mt-3 self-end px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                        copiedKey === field.key
                          ? 'bg-emerald-500 text-white'
                          : isDarkMode
                          ? 'bg-slate-800 hover:bg-slate-700 text-amber-400'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {copiedKey === field.key ? (
                        <>
                          <Check className="w-3 h-3" /> Kopyalandı
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Kopyala
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>

              {/* Guide text preview download */}
              <div
                className={`p-4 rounded-2xl border flex items-center justify-between ${
                  isDarkMode ? 'bg-[#0B1529] border-[#1F2E50]' : 'bg-blue-50/50 border-blue-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h4 className="text-xs font-bold">App Store Connect Yükleme Kılavuzu (TXT)</h4>
                    <p className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Kategori seçimi, yaş derecelendirmesi ve gizlilik etiketi bilgileri dahil.
                    </p>
                  </div>
                </div>
                <a
                  href="/app-store-assets/APP_STORE_YUKLEME_KILAVUZU.txt"
                  download="APP_STORE_YUKLEME_KILAVUZU.txt"
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                    isDarkMode ? 'bg-slate-800 text-amber-400 hover:bg-slate-700' : 'bg-white text-blue-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Download className="w-3.5 h-3.5" />
                  Kılavuzu İndir
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={`px-6 py-3.5 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${
            isDarkMode ? 'border-[#1E2E4E] bg-[#0C172E] text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-500'
          }`}
        >
          <span>✦ 10 Ekran Görüntüsü + 3 Önizleme Videosu + ZIP Paketi Hazır</span>
          <button
            onClick={onClose}
            className={`px-4 py-1.5 rounded-xl font-bold ${
              isDarkMode ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
            }`}
          >
            Kapat
          </button>
        </div>
      </div>

      {/* Lightbox / Image Zoom Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 p-3 rounded-full bg-slate-800/80 text-white hover:bg-slate-700"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={selectedImage}
            alt="App Store Preview"
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};
