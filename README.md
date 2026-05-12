# Saloniva

Saloniva, guzellik salonlari icin Web, Android ve iOS uyumlu premium salon yonetim uygulamasidir.

Uygulama; randevu, musteri, paket, seans, odeme, rapor, vitrin ve satis firsatlarini tek panelde toplar. Su an **pazarlanabilir demo / pilot satis** seviyesindedir. Gercek canli satis icin backend, bulut veritabani, abonelik/odeme, magaza varliklari ve gercek test surecleri siradaki adimlardir.

## Durum

- Demo ve pilot gorusme icin hazir.
- Web onizleme calisiyor.
- Android/iOS hedefi Expo uzerinden planlandi.
- Supabase veritabani ve gercek salon hesabi olusturma akisi baslatildi.
- Gercek musteri kullanimi icin cloud veri yazma, odeme ve canli testler tamamlanmali.

## Demo Hesap

```text
E-posta: demo@saloniva.app
Sifre: demo1234
```

## One Cikan Ozellikler

- Premium ana panel ve salon sahibi karar ekrani
- Randevu takvimi ve randevu durum yonetimi
- Musteri kartlari, notlar ve musteri hafizasi
- Paket, seans ve paket odeme takibi
- Odeme, borc ve makbuz onizlemesi
- Hizmet/fiyat listesi ve personel yonetimi
- Raporlar, gelir danismani ve trend grafikler
- Online randevu linki ve talep onay akisi
- Salon vitrini ve satis firsatlari
- Stok, sube, kampanya ve mobil musteri uygulamasi onizlemesi
- Dil secenekleri ve koyu mod
- Guvenlik/yetki merkezi
- Canli urun hazirligi ekrani
- Pilot satis paketi

## Uygulama Ekranlari

- Giriş ve tanitim
- Panel
- Takvim
- Musteriler
- Paketler
- Odemeler
- Hizmetler
- Personel
- Raporlar
- Ayarlar
- Salon Vitrini
- Online Randevu Linki
- Satis Firsatlari
- Kalite Merkezi
- Guvenlik ve Yetki Merkezi
- Canli Urun Hazirligi
- Pilot Satis Paketi
- Ajan Calisma Merkezi

## Teknoloji

- Expo
- React Native
- React Native Web
- TypeScript
- AsyncStorage

## Proje Yapisi

Hızlı dosya haritası için:

[PROJECT_MAP.md](./PROJECT_MAP.md)

```text
src/
  components/  Ortak UI parcalari
  config/      Urun, lansman, satis ve gorsel ayarlar
  data/        Demo veriler
  navigation/  Web sidebar ve mobil alt menu
  qa/          Test senaryolari
  screens/     Uygulama ekranlari
  security/    Rol ve yetki modeli
  services/    Backend, auth, abonelik ve API planlari
  state/       Uygulama veri yonetimi
  theme/       Renkler, tipografi ve tasarim olculeri
  types/       Ortak tipler
  utils/       Yardimci fonksiyonlar

docs/
  backend-architecture.md
  production-launch-plan.md
  store-readiness.md
  pilot-sales-kit.md
  agent-workflow.md
```

## Calistirma

Bagimliliklari kur:

```bash
npm install
```

Web onizleme:

```bash
npm run web
```

Tarayicida ac:

```bash
http://localhost:8081
```

Android ve iOS:

```bash
npm run android
npm run ios
```

## GitHub'a Yukleme

GitHub yukleme adimlari icin:

[GITHUB_UPLOAD.md](./GITHUB_UPLOAD.md)

## Satis Durumu

Saloniva su an salon sahiplerine demo olarak gosterilebilir ve pilot musteri gorusmeleri icin kullanilabilir.

Canli satis icin tamamlanacak ana basliklar:

- Gercek kullanici girisi
- Bulut veritabani
- Salon tenant ayrimi
- Abonelik ve odeme sistemi
- App Store / Google Play ikon, splash ve ekran goruntuleri
- Gizlilik, destek ve hesap silme web linkleri
- Gercek cihaz ve tarayici testleri

## Dokumanlar

- [Pilot Satis Paketi](./docs/pilot-sales-kit.md)
- [Canli Urun Plani](./docs/production-launch-plan.md)
- [Backend Mimari Notlari](./docs/backend-architecture.md)
- [Supabase Backend Kurulumu](./docs/supabase-backend-setup.md)
- [Magaza Hazirligi](./docs/store-readiness.md)
- [Ajan Calisma Sirasi](./docs/agent-workflow.md)
- [Guvenlik Taramasi](./docs/security-review.md)
- [White-Label Satis Paketi](./docs/white-label-sales-kit/README.md)

## Not

Bu proje demo/pilot seviyesindedir. Gercek musteri verisiyle kullanmadan once backend, guvenlik, odeme, hukuki linkler ve test surecleri tamamlanmalidir.
