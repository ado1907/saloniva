# Saloniva

Saloniva, guzellik salonlari ve premium beauty merkezleri icin Web, Android ve iOS uyumlu salon yonetim uygulamasidir. Randevu, musteri, paket, seans, odeme, stok, personel, rapor ve satis firsatlarini tek bir profesyonel panelde toplar.

Bu repo su anda **pazarlanabilir demo / pilot satis** seviyesindedir. Supabase auth ve salon bazli veri ayrimi kurulmustur; canli satis oncesi odeme aboneligi, sifre sifirlama, hesap silme linki, magaza ikon/splash ve gercek cihaz testleri tamamlanmalidir.

## Hizli Baslangic

```bash
npm install
npm run web
```

Tarayicida:

```text
http://localhost:8081
```

Android ve iOS icin:

```bash
npm run android
npm run ios
```

## Demo Giris

Demo-local modda hizli inceleme icin:

```text
E-posta: demo@saloniva.app
Sifre: demo1234
```

Supabase modda yeni salon hesabi olusturulduktan sonra `Ayarlar > Demo Veriye Sifirla` ile salon hesabi profesyonel demo verileriyle doldurulabilir. Bu islem bos cloud salonuna ornek musteri, randevu, odeme, paket, hizmet, personel ve stok kayitlari ekler.

## Supabase Kurulumu

1. Supabase projesi olustur.
2. `supabase/schema.sql` dosyasini SQL Editor icinde calistir.
3. `supabase/phase2-auth.sql` dosyasini SQL Editor icinde calistir.
4. Authentication > Sign In / Providers > Email etkin olsun.
5. Test icin gerekirse Confirm email kapatilabilir; canli kullanimda e-posta dogrulama acik kalmalidir.
6. `.env` dosyasina asagidaki alanlari ekle:

```env
EXPO_PUBLIC_BACKEND_MODE=supabase
EXPO_PUBLIC_SUPABASE_URL=https://PROJECT_ID.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xxx
EXPO_PUBLIC_DEMO_SALON_ID=demo-saloniva
```

Gizli `service_role` anahtari uygulamaya, GitHub'a veya README'ye konulmaz.

## One Cikan Ozellikler

- Premium salon sahibi karar paneli
- Randevu takvimi ve durum yonetimi
- Musteri kartlari, notlar ve musteri hafizasi
- Paket, seans ve tahsilat takibi
- Odeme, borc ve makbuz onizleme
- Hizmet/fiyat listesi ve personel yonetimi
- Stok, sube, kampanya ve vitrin ekranlari
- Online randevu linki ve talep onay akisi
- Gelir raporlari, trendler ve satis firsatlari
- Dil secenekleri, koyu mod ve App Store uyumlu ayar ekranlari
- Supabase auth, RLS ve salon bazli veri ayrimi

## Satis Materyalleri

- [1 dakikalik demo ekran akisi](./docs/sales-assets/demo-video-screen-flow.md)
- [E-posta ve WhatsApp satis metinleri](./docs/sales-assets/outreach-templates.md)
- [Gorsel HTML/PDF satis dosyasi](./docs/sales-assets/saloniva-one-pager.html)
- [Uretim eksigi listesi](./docs/sales-assets/production-gap-list.md)
- [White-label satis paketi](./docs/white-label-sales-kit/README.md)
- [Fiyat teklif sablonu](./docs/white-label-sales-kit/03-price-quote-template.md)

HTML satis dosyasi tarayicida acilip yazdirma ekranindan PDF olarak alinabilir.

## White-Label Teslim Modeli

Alıcıya verilecek paket:

- Saloniva markali veya alici markasina uyarlanmis uygulama arayuzu
- Web demo kurulumu ve Expo tabanli Android/iOS proje yapisi
- Supabase tablo kurulumu, auth akisi ve salon bazli RLS modeli
- Kurulum dokumani, satis notlari ve demo video akisi
- Lisans metni ve teklif sablonu

Varsayilan ticari model: **kaynak kod devri yok, kullanim lisansi var**. Kaynak kod devri istenirse ayri fiyat ve sozlesme konusu yapilmalidir.

## Proje Yapisi

```text
src/
  components/  Ortak UI parcalari
  config/      Urun, lansman, satis ve gorsel ayarlar
  data/        Demo veriler
  navigation/  Web sidebar ve mobil alt menu
  qa/          Test senaryolari
  screens/     Uygulama ekranlari
  security/    Rol ve yetki modeli
  services/    Auth, Supabase, backend ve abonelik katmani
  state/       Uygulama veri yonetimi
  theme/       Renkler, tipografi ve tasarim olculeri
  types/       Ortak tipler
  utils/       Yardimci fonksiyonlar

supabase/
  schema.sql
  phase2-auth.sql

docs/
  sales-assets/
  white-label-sales-kit/
```

## Kontrol Listesi

Tamamlananlar:

- Web demo calisiyor.
- Supabase proje kurulumu yapildi.
- `schema.sql` ve `phase2-auth.sql` calisti.
- Gercek kullanici kaydi, cikis ve tekrar giris test edildi.
- Randevu, musteri ve odeme cloud yazma testi yapildi.
- Iki farkli salon icin veri ayrimi/RLS testi gecti.
- GitHub push akisi tamamlandi.

Satis oncesi kalan kritik basliklar:

- Sifre sifirlama
- Hesap silme web linki
- Gizlilik politikasi ve destek sayfasi yayini
- Abonelik/odeme sistemi
- App Store / Google Play ikon, splash ve ekran goruntuleri
- Gercek cihazlarda mobil tasma ve form testi

