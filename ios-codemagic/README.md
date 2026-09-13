#  HATİPOĞLU - Codemagic iOS Paketi

Codemagic.io (Mac Mini M2 / Xcode 16 / iOS 18 SDK) uyumludur.

1. `https://codemagic.io` sitesinde GitHub deponuzu bağlayın.
2. `codemagic.yaml` otomatik algılanır ve TestFlight için derleme başlar.
3. Yerel çalıştırma: `npx expo prebuild --platform ios && cd ios && pod install && npx react-native run-ios`