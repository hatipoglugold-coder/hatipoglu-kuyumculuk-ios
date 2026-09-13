# ⚜️ HATİPOĞLU KUYUMCULUK
> Canlı Altın, Ziynet ve Döviz Fiyat Takip & Codemagic.io Tabanlı iOS Mobil Uygulaması

Bu proje **Hatipoğlu Kuyumculuk** için tasarlanmış modern web panosu ve **Codemagic.io CI/CD (Apple App Store / TestFlight)** destekli iOS mobil uygulamasını içerir.

## 🚀 Web Kurulumu ve Çalıştırma
```bash
# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

## 📱 Codemagic.io ile Apple TestFlight / App Store Dağıtımı
Proje kök dizininde **`codemagic.yaml`** dosyası hazırdır:
1. **https://codemagic.io** adresine GitHub hesabınızla giriş yapın.
2. Bu depoyu ekleyin (Add application).
3. Codemagic `codemagic.yaml` dosyasını otomatik algılar.
4. App Store Connect API anahtarınızı tanımlayın ve **"Start new build"** butonuna basın.
5. Buluttaki Mac Mini M2 sunucularında derlenip otomatik olarak **TestFlight** ve **App Store Connect**'e gönderilir.

## 💻 Mac'te Yerel Test
```bash
npm install
npx expo prebuild --platform ios
cd ios && pod install && cd ..
npx react-native run-ios
```

## 🛠️ Yönetici Paneli
Yönetici paneli üzerinden Kapalıçarşı çarpan formülleri, alarm seviyeleri ve WhatsApp bültenleri anlık olarak yönetilebilir.
