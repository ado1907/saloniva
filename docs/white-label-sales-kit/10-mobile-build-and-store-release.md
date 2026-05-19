# Mobil Build ve Mağaza Yayını

## Genel Yaklaşım

Saloniva Expo tabanlıdır. Web, Android ve iOS için tek kod tabanıyla geliştirilir; ancak mağaza yayını için Android ve iOS süreçleri farklıdır.

## Android

Android tarafında demo için APK build alınabilir.

Önerilen demo komutu:

```bash
eas build -p android --profile preview
```

Google Play yayını için AAB build gerekir.

```bash
eas build -p android --profile production
```

## iOS

iOS için Apple Developer hesabı gerekir. iPhone'a doğrudan APK gibi kurulum yapılmaz.

Kurulum seçenekleri:

- TestFlight
- App Store yayını
- Apple Developer hesabı ile development/ad hoc build

## Alıcıdan Alınacak Mağaza Bilgileri

- Apple Developer hesabı var mı?
- Google Play Console hesabı var mı?
- Uygulama adı
- Kısa açıklama
- Uzun açıklama
- Kategori
- Destek e-postası
- Gizlilik politikası linki
- Hesap silme linki
- İkon, splash ve ekran görüntüsü tercihleri

## Sorumluluk Matrisi

- Teknik build hazırlığı: sağlayıcı
- Mağaza hesabı sahipliği: alıcı veya sözleşmede belirtilen taraf
- Mağaza onay süresi: Apple/Google sürecine bağlıdır
- Ret durumunda düzeltme: teklif kapsamına göre değerlendirilir
- Nihai yasal metinler: alıcı sorumluluğundadır

## Teslim Öncesi Mobil Test

- iPhone küçük ekran
- iPhone büyük ekran
- Android küçük ekran
- Android büyük ekran
- Randevu formu
- Ödeme formu
- Müşteri detayı
- Alt navigasyon
- Koyu mod
- Dil seçenekleri