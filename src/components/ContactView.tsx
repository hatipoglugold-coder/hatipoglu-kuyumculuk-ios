import React, { useState } from 'react';
import {
  Phone,
  MessageSquare,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Copy,
  ExternalLink,
  ShieldCheck,
  Building2,
  Sparkles,
  PhoneCall,
  Check,
} from 'lucide-react';
import { StoreConfig } from '../types';
import { BrandLogo } from './BrandLogo';

interface ContactViewProps {
  storeConfig: StoreConfig;
  isDarkMode?: boolean;
}

export const ContactView: React.FC<ContactViewProps> = ({
  storeConfig,
  isDarkMode = true,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    subject: 'Ziynet & Sarrafiye Alım-Satım',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Check if store is currently open (Istanbul working hours: Weekdays 09:00 - 18:30, Sat 09:30 - 17:00)
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 6 = Saturday
  const hour = now.getHours();
  const minute = now.getMinutes();
  const currentTime = hour + minute / 60;

  const isOpen =
    day >= 1 && day <= 5
      ? currentTime >= 9 && currentTime <= 18.5
      : day === 6
      ? currentTime >= 9.5 && currentTime <= 17
      : false;

  const cleanPhone = storeConfig.phone.replace(/[^0-9+]/g, '');
  const cleanWhatsapp = storeConfig.whatsapp.replace(/[^0-9+]/g, '').replace(/^0/, '90');

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.message.trim()) return;

    // Format WhatsApp inquiry text
    const text = encodeURIComponent(
      `*${storeConfig.brandName} ${storeConfig.subtitle} - İletişim Talebi*\n\n` +
      `👤 *İsim:* ${formData.name}\n` +
      `📞 *Telefon:* ${formData.phone || 'Belirtilmedi'}\n` +
      `🏷️ *Konu:* ${formData.subject}\n` +
      `📝 *Mesaj:* ${formData.message}`
    );

    // Open WhatsApp
    window.open(`https://wa.me/${cleanWhatsapp}?text=${text}`, '_blank');
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 4000);
  };

  return (
    <div className="flex-1 overflow-y-auto px-3.5 py-4 pb-16 space-y-4 max-w-lg mx-auto">
      {/* Top Luxury Store Banner */}
      <div
        className={`rounded-2xl p-4 sm:p-5 border transition-all ${
          isDarkMode
            ? 'bg-gradient-to-b from-[#141A28] to-[#0A0F1A] border-[#C59B27]/30 shadow-xl shadow-black/40'
            : 'bg-white border-slate-200 shadow-md'
        }`}
      >
        <div className="flex flex-col items-center text-center">
          <BrandLogo
            isDarkMode={isDarkMode}
            size="md"
            align="center"
          />

          <p
            className={`text-xs mt-2.5 font-medium max-w-xs ${
              isDarkMode ? 'text-amber-200/80' : 'text-slate-600'
            }`}
          >
            {storeConfig.tagline}
          </p>

          {/* Working Status Badge */}
          <div className="mt-3 flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide border ${
                isOpen
                  ? isDarkMode
                    ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-400'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : isDarkMode
                  ? 'bg-amber-950/70 border-amber-500/40 text-amber-400'
                  : 'bg-amber-50 border-amber-200 text-amber-700'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              {isOpen ? 'Şu Anda Hizmetinizdeyiz' : 'Mesai Dışı (Yarın 09:00)'}
            </span>

            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                isDarkMode
                  ? 'bg-[#1D170A] border-[#C59B27]/30 text-[#F5C044]'
                  : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              İKO Tescilli
            </span>
          </div>
        </div>
      </div>

      {/* Quick Action Channels (Call & WhatsApp) */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Call Button */}
        <a
          href={`tel:${cleanPhone}`}
          id="contact-call-btn"
          className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all text-center group select-none ${
            isDarkMode
              ? 'bg-gradient-to-b from-[#172033] to-[#0E1524] border-slate-700/60 hover:border-amber-500/50 text-white shadow-lg'
              : 'bg-white border-slate-200 hover:border-blue-400 text-slate-800 shadow-sm'
          }`}
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-transform group-hover:scale-110 ${
              isDarkMode
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-blue-50 text-blue-600 border border-blue-200'
            }`}
          >
            <PhoneCall className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold">Hemen Ara</span>
          <span
            className={`text-[10px] mt-0.5 font-mono ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            {storeConfig.phone}
          </span>
        </a>

        {/* WhatsApp Direct Chat */}
        <a
          href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
            `Merhaba ${storeConfig.brandName} ${storeConfig.subtitle}, canlı altın fiyatları ve sipariş hakkında danışmak istiyorum.`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          id="contact-whatsapp-btn"
          className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all text-center group select-none ${
            isDarkMode
              ? 'bg-gradient-to-b from-[#0F2417] to-[#09170E] border-emerald-600/40 hover:border-emerald-400 text-white shadow-lg'
              : 'bg-emerald-50/70 border-emerald-200 hover:border-emerald-400 text-slate-800 shadow-sm'
          }`}
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2 bg-emerald-500 text-white shadow-md shadow-emerald-600/30 group-hover:scale-110 transition-transform">
            <MessageSquare className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-emerald-400 dark:text-emerald-300">
            WhatsApp Hattı
          </span>
          <span
            className={`text-[10px] mt-0.5 font-mono ${
              isDarkMode ? 'text-emerald-200/70' : 'text-emerald-700'
            }`}
          >
            Canlı Mesajlaşma
          </span>
        </a>
      </div>

      {/* Address & Working Hours Card */}
      <div
        className={`rounded-2xl p-4 border space-y-3.5 ${
          isDarkMode
            ? 'bg-[#0E1524] border-slate-800 text-slate-200'
            : 'bg-white border-slate-200 text-slate-800 shadow-sm'
        }`}
      >
        {/* Physical Address */}
        <div className="flex items-start gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
              isDarkMode
                ? 'bg-[#1C160F] text-[#F5C044] border border-[#C59B27]/30'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}
          >
            <MapPin className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Mağaza Adresi
              </span>
              <button
                type="button"
                onClick={() => handleCopy(storeConfig.address, 'address')}
                className={`text-[10px] font-semibold flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors ${
                  isDarkMode
                    ? 'hover:bg-slate-800 text-amber-400'
                    : 'hover:bg-slate-100 text-blue-600'
                }`}
                title="Adresi Kopyala"
              >
                {copiedField === 'address' ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    Kopyalandı
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    Kopyala
                  </>
                )}
              </button>
            </div>
            <p className="text-xs font-medium mt-0.5 leading-relaxed">
              {storeConfig.address}
            </p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${storeConfig.brandName} ${storeConfig.address}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 text-[11px] font-semibold mt-1.5 underline-offset-2 hover:underline ${
                isDarkMode ? 'text-amber-400' : 'text-blue-600'
              }`}
            >
              <ExternalLink className="w-3 h-3" />
              Haritada Yol Tarifi Al
            </a>
          </div>
        </div>

        <div
          className={`h-px w-full ${
            isDarkMode ? 'bg-slate-800/80' : 'bg-slate-100'
          }`}
        />

        {/* Operating Hours */}
        <div className="flex items-start gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
              isDarkMode
                ? 'bg-slate-800/60 text-slate-300 border border-slate-700'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            <Clock className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Mağaza Çalışma Saatleri
            </span>
            <div className="mt-1 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Pazartesi – Cuma:</span>
                <span className="font-semibold font-mono">09:00 – 18:30</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Cumartesi:</span>
                <span className="font-semibold font-mono">09:30 – 17:00</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Pazar:</span>
                <span className="text-red-400/90 font-medium">Kapalı (Piyasa Tatili)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Quick Message Box (İletişim & Fiyat Teklifi Formu) */}
      <div
        className={`rounded-2xl p-4 sm:p-5 border transition-all ${
          isDarkMode
            ? 'bg-gradient-to-b from-[#11192A] to-[#0A0F1B] border-[#C59B27]/25 shadow-xl'
            : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex items-center gap-2 mb-3">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center ${
              isDarkMode ? 'bg-[#221A0B] text-[#F5C044]' : 'bg-amber-50 text-amber-700'
            }`}
          >
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3
              className={`text-xs font-bold uppercase tracking-wider ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              Hızlı İletişim & Fiyat Teklifi
            </h3>
            <p className="text-[10px] text-slate-400">
              Talebinizi iletin, sarrafiye uzmanlarımız anında dönüş yapsın
            </p>
          </div>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-2.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label
                className={`block text-[10px] font-semibold uppercase tracking-wider mb-1 ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                Adınız Soyadınız
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Örn: Ahmet Yılmaz"
                className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none transition-all ${
                  isDarkMode
                    ? 'bg-[#070B13] border-slate-700 text-white focus:border-amber-500'
                    : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500'
                }`}
              />
            </div>

            <div>
              <label
                className={`block text-[10px] font-semibold uppercase tracking-wider mb-1 ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                Telefon Numaranız
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="0 (5XX) XXX XX XX"
                className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none transition-all ${
                  isDarkMode
                    ? 'bg-[#070B13] border-slate-700 text-white focus:border-amber-500'
                    : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500'
                }`}
              />
            </div>
          </div>

          <div>
            <label
              className={`block text-[10px] font-semibold uppercase tracking-wider mb-1 ${
                isDarkMode ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              Talep Konusu
            </label>
            <select
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none transition-all ${
                isDarkMode
                  ? 'bg-[#070B13] border-slate-700 text-white focus:border-amber-500'
                  : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500'
              }`}
            >
              <option value="Ziynet & Sarrafiye Alım-Satım">Ziynet & Sarrafiye Alım-Satım</option>
              <option value="Has Altın & Toptan Gram Alımı">Has Altın & Toptan Gram Alımı</option>
              <option value="Döviz & Arbitraj İşlemleri">Döviz & Arbitraj İşlemleri</option>
              <option value="Özel Bilezik / Kolye Tasarımı">Özel Bilezik / Kolye Siparişi</option>
              <option value="Genel Bilgi & Randevu">Genel Bilgi & Randevu</option>
            </select>
          </div>

          <div>
            <label
              className={`block text-[10px] font-semibold uppercase tracking-wider mb-1 ${
                isDarkMode ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              Mesajınız / İşlem Detayı
            </label>
            <textarea
              rows={2}
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Örn: 5 adet Ata Lira veya 100 gram 24 ayar külçe altın için özel kur teklifi almak istiyorum..."
              className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none transition-all resize-none ${
                isDarkMode
                  ? 'bg-[#070B13] border-slate-700 text-white focus:border-amber-500'
                  : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500'
              }`}
            />
          </div>

          <button
            type="submit"
            id="contact-form-submit-btn"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-[#D4AF37] via-[#F5C044] to-[#B38728] text-slate-950 hover:brightness-110 active:scale-[0.99] transition-all shadow-md shadow-amber-500/20"
          >
            {isSubmitted ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-950" />
                WhatsApp'a Yönlendirildi
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                WhatsApp ile Mesajı İlet
              </>
            )}
          </button>
        </form>
      </div>

      {/* Trust & Guarantee Notes */}
      <div
        className={`rounded-2xl p-3.5 border flex items-center gap-3 ${
          isDarkMode
            ? 'bg-[#0A0E18] border-slate-800 text-slate-400'
            : 'bg-slate-50 border-slate-200 text-slate-600'
        }`}
      >
        <Building2 className="w-5 h-5 text-amber-500 shrink-0" />
        <p className="text-[10px] leading-relaxed">
          Tüm kıymetli maden ve ziynet işlemleriniz Hatipoğlu Kuyumculuk güvencesiyle,
          yetkili faturalı ve fiziki teslimat garantisi ile gerçekleştirilmektedir.
        </p>
      </div>
    </div>
  );
};
