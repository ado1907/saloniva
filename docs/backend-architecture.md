# Saloniva Backend Mimari Notlari

Bu dosya, mevcut demo store yapisinin gercek satis urunune nasil tasinacagini tarif eder.

## Mevcut Durum

- Uygulama Expo React Native ile Web, Android ve iOS icin calisir.
- Veriler `AsyncStorage` ile cihazda saklanir.
- `src/services/backendGateway.ts` demo-local modunu standart bir backend arayuzu arkasina alir.

## Hedef Durum

- Her salon ayri tenant olarak tutulur.
- Her kullanici rol bazli yetkiye sahiptir.
- Randevu, musteri, paket, odeme, personel ve stok verileri bulutta saklanir.
- Hesap silme, veri disari aktarma ve yedekleme surecleri tanimlanir.

## Onerilen Veri Alanlari

- `salons`: salon profili, abonelik plani, durum
- `users`: kullanici, rol, salon baglantisi
- `subscriptions`: plan, deneme bitisi, odeme durumu, lisans durumu
- `customers`: musteri bilgileri, notlar, borc
- `appointments`: randevu, hizmet, personel, durum
- `packages`: paket, toplam seans, kullanilan seans, odeme
- `payments`: tutar, kalan bakiye, odeme yontemi
- `services`: hizmet, sure, fiyat, aktiflik
- `staff`: personel, yetkinlik, aktiflik
- `inventory`: stok, minimum miktar, tedarikci
- `audit_logs`: kritik veri degisiklikleri

## Guvenlik Ilkeleri

- Salonlar arasi veri erisimi kesin olarak engellenmeli.
- Yetki kontrolu sadece mobil/web istemcide degil, sunucuda yapilmali.
- Telefon ve odeme verileri hassas veri olarak ele alinmali.
- Hesap silme ve veri disari aktarma islemleri kayit altina alinmali.
- Uygulama icindeki rol matrisi `src/security/rolePermissions.ts` icinde baslatildi; backend ayni yetki mantigini zorunlu hale getirmeli.

## Rol Yetki Modeli

- Salon Sahibi: tum operasyon, rapor, ayar, abonelik, sube ve guvenlik alanlarina erisir.
- Yonetici: gunluk operasyon, musteri, paket, odeme, rapor, personel, stok ve vitrin alanlarini yonetir.
- Personel: kendi randevu, musteri notu ve paket/seans islemlerine sinirli erisir.

Gercek backend tarafinda her istek icin kullanicinin `salonId`, rol ve izinleri sunucu oturumundan okunmali; istemciden gelen rol veya salon bilgisine tek basina guvenilmemeli.

## Gecis Stratejisi

1. Demo veriyi bozmadan backend gateway arayuzunu genislet.
2. Bulut veri modelini demo veri tipleriyle uyumlu tut.
3. Once okuma/yazma senkronizasyonunu ekle.
4. Sonra rol, abonelik ve lisans kontrolunu devreye al.
5. En son otomatik bildirim ve odeme entegrasyonlarini ekle.

## Uygulamada Eklenen Uretim Hazirlik Dosyalari

- `src/services/authGateway.ts`: demo session, gercek auth ve salon kayit sozlesmesi.
- `src/services/cloudDatabasePlan.ts`: bulut tablo plani ve tenant izolasyon kurallari.
- `src/services/subscriptionGateway.ts`: abonelik, checkout ve lisans kontrol plani.
- `src/config/storeLaunchAssets.ts`: ikon, splash, ekran goruntusu ve hukuki link listesi.
- `src/qa/productionTestScenarios.ts`: gercek test senaryolari ve kabul kriterleri.
- `src/screens/ProductionReadinessScreen.tsx`: tum uretim adimlarini uygulama icinde takip eden ekran.

## API Sozlesmeleri

Kod tarafinda ilk API sozlesmeleri `src/services/apiContracts.ts` icinde tutulur. Bu liste henuz gercek sunucuya baglanmaz; ancak backend gelistirme sirasini ve guvenlik sinirlarini netlestirir.

### Ilk Endpoint Adaylari

- `POST /auth/login`: kullanici oturumu ve salon baglami
- `POST /auth/register-salon`: salon tenant, sahip kullanici ve deneme aboneligi
- `GET /salons/:salonId/snapshot`: panel icin tum ana veriler
- `POST /salons/:salonId/appointments`: randevu olusturma
- `POST /salons/:salonId/customers`: musteri olusturma
- `POST /salons/:salonId/payments`: odeme kaydetme
- `POST /public/salons/:slug/booking-requests`: vitrin veya randevu linkinden public talep
- `GET /salons/:salonId/subscription`: abonelik ve lisans durumu
- `POST /salons/:salonId/subscription/checkout`: odeme baslatma
- `DELETE /salons/:salonId/account`: hesap silme talebi

### API Guvenlik Kurallari

- Her salon endpointi `salonId` tenant kontrolu yapmali.
- Public booking endpoint rate limit ve spam korumasi almali.
- Yazma islemleri audit log uretmeli.
- Billing endpointleri sadece salon sahibi veya lisans yetkisiyle calismali.
- Client tarafindan gelen rol bilgisine guvenilmemeli; yetki sunucuda dogrulanmali.
