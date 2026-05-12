# Saloniva Security Review

Tarih: 2026-05-11

Bu rapor Saloniva uygulamasinin mevcut demo/pilot satis surumu icin yapilan guvenlik taramasini ozetler. Inceleme kod, dokuman, bagimlilik, veri saklama, auth/tenant plani, WhatsApp cikislari ve magaza/hukuk hazirligi uzerinden yapildi.

## Genel Sonuc

Saloniva su an demo ve pilot gorusme icin kullanilabilir. Supabase veritabani, RLS politikalari ve gercek salon hesabi olusturma akisi baslatildi. Ancak gercek musteri verisiyle canli kullanima acilmadan once cloud veri yazma/okuma, odeme/lisans kontrolu, veri silme/disari aktarma ve gercek cihaz testleri tamamlanmalidir.

## 2026-05-11 Ek Tarama

Yapilan kontroller:

- `npm run typecheck`: basarili.
- `npm audit --json`: 8 uyarı, 6 high ve 2 moderate, critical yok.
- `.env` dosyasi `.gitignore` icinde korunuyor.
- Yerel `.env` icinde `sb_publishable_` anahtar tipi kullaniliyor.
- Kaynak kodda `sb_secret_` canli gizli anahtar bulunmadi.
- `service_role` kelimesi sadece uyarici metinlerde geciyor; uygulama anahtari olarak kullanilmiyor.
- Supabase semasinda RLS aktif.
- Auth RPC fonksiyonlari sadece authenticated role icin grant edildi.

## 2026-05-12 Ek Tarama

Yapilan kontroller:

- `npm.cmd run typecheck`: basarili.
- `schema.sql` ve `phase2-auth.sql` Supabase SQL Editor uzerinde calisti.
- Gercek Supabase kullanicisiyle hesap olusturma, cikis ve tekrar giris akisi test edildi.
- Musteri, randevu ve odeme cloud yazma akisi test edildi.
- Iki farkli test salonu ile tenant izolasyonu kontrol edildi; salonlar birbirinin verisini okuyamadi veya diger salona yazamadi.
- `.env` haric GitHub'a gidecek dosyalarda `sb_secret_` veya canli Supabase publishable key bulunmadi.
- `service_role` sadece uyari/dokuman metinlerinde geciyor, istemci kodunda anahtar olarak kullanilmiyor.
- Demo veri yukleme akisi cloud modda bos salonu dolduracak sekilde genisletildi; mevcut verisi olan salonda otomatik ustune yazmaz.

## Kritik Riskler

### 1. Gercek Auth ve Tenant Izolasyonu Tamamlanma Asamasinda

Durum: Supabase semasi, RLS politikalari ve auth RPC temeli eklendi; uygulama giris ekrani Supabase Auth'a baglanmaya basladi.

Ilgili dosyalar:

- `src/services/supabaseAuthGateway.ts`
- `src/services/supabaseRestClient.ts`
- `supabase/schema.sql`
- `supabase/phase2-auth.sql`

Risk:

- Canli urunde her salon kendi verisini gormeli.
- RLS temeli var, fakat tum formlar henuz cloud insert/update akisini kullanmiyor.
- Auth RPC fonksiyonlari canliya alinmadan once Supabase uzerinde gercek kullaniciyle test edilmeli.

Oneri:

- `supabase/phase2-auth.sql` Supabase SQL Editor'da calistirilsin.
- Authentication email confirmation ayari test ve canli icin bilincli secilsin.
- Musteri, randevu, odeme ve paket formlari tek tek cloud yazma akisine tasinsin.
- Public booking icin rate limit / spam korumasi eklensin.

### 2. Hassas Veri AsyncStorage'da Saklaniyor

Durum: Demo icin kabul edilebilir, canli urun icin yetersiz.

Ilgili dosya:

- `src/state/storage.ts`

Risk:

- Musteri adi, telefon, not, odeme, borc ve paket bilgileri cihazda JSON olarak saklaniyor.
- Gercek musteri verisinde bu model tek basina guvenli kabul edilmemeli.

Oneri:

- Canli urunde veri bulutta saklanmali.
- Mobilde gerekirse sadece kisa sureli cache tutulmali.
- Hassas veriler icin encryption ve oturum temizleme stratejisi eklenmeli.

### 3. Odeme ve Abonelik Gercek Degil

Durum: Plan ve ekran var, gercek tahsilat yok.

Ilgili dosyalar:

- `src/services/subscriptionGateway.ts`
- `src/screens/BillingScreen.tsx`

Risk:

- Canli satis icin lisans kontrolu, odeme basarisizligi ve plan limitleri backend'e baglanmali.
- Mobil abonelikte App Store / Google Play politikalari dikkate alinmali.

Oneri:

- Web icin Iyzico/Stripe benzeri saglayici belirle.
- Mobil icin magaza abonelik kurallari incelensin.
- Lisans kontrolu backend'den donsun.

## Yuksek Riskler

### 4. npm audit Uyarilari

Durum: `npm audit --json` sonucu 8 uyaridir.

Ozet:

- 6 high
- 2 moderate
- 0 critical

Ana kaynak:

- Expo CLI zinciri
- `tar`
- `@xmldom/xmldom`
- `postcss`

Risk:

- Uyarilarin buyuk bolumu build/CLI zincirinde.
- `npm audit fix --force` Expo surumunu bozabilir.

Oneri:

- Korlemesine `npm audit fix --force` calistirma.
- Expo SDK planli sekilde guncellensin.
- Once `npx expo install --check` ve Expo SDK uyum matrisiyle ilerle.

### 5. Demo Bilgileri Public Dokumanlarda Yer Aliyor

Durum: Bilerek eklendi, demo hesabi icin kullaniliyor.

Ilgili dosyalar:

- `README.md`
- `docs/pilot-sales-kit.md`
- `docs/store-readiness.md`
- `src/config/pilotSalesKit.ts`
- `src/screens/AuthScreen.tsx`

Risk:

- Demo hesabi gercek veri tasimadigi surece kabul edilebilir.
- Gercek auth baglaninca demo hesabi sinirli yetkili ve izole olmalidir.

Oneri:

- Demo hesabi sadece demo tenant'a baglansin.
- Demo hesapta gercek musteri verisi bulunmasin.
- Demo sifresi canli ortamda rate limit ve izleme altinda olsun.

### 6. WhatsApp Linkleri Dis Uygulamaya Veri Tasiyor

Durum: Kullanici aksiyonu ile WhatsApp linki aciliyor.

Ilgili dosya:

- `src/utils/whatsapp.ts`

Risk:

- Musteri adi, randevu ve odeme bilgisi WhatsApp mesaj metnine giriyor.
- Bu veri uygulama disina cikar.

Oneri:

- Canli urunde WhatsApp gondermeden once kullanici onayi net gosterilmeli.
- Odeme hatirlatmalarinda tutar ve kisisel veri minimum tutulmali.
- Mesaj sablonlari gizlilik politikasinda aciklanmali.

## Orta Riskler

### 7. External Image URL Kullanimi

Durum: Pexels gorselleri remote URL ile yukleniyor.

Ilgili dosya:

- `src/config/visualAssets.ts`

Risk:

- Ucuncu taraf gorsel servisi kapanirsa veya yavaslarsa gorunum etkilenir.
- App Store/Google Play icin lisans ve sabit asset kullanimi daha sagliklidir.

Oneri:

- Yayina cikmadan once gorseller lisansli sekilde projeye asset olarak eklenmeli.
- Remote image yerine paketlenen yerel gorseller tercih edilmeli.

### 8. Hesap Silme ve Veri Disari Aktarma Sadece Plan Seviyesinde

Durum: Uygulama icinde metin ve plan var.

Ilgili dosyalar:

- `src/config/storeLaunchAssets.ts`
- `src/components/LegalContent.tsx`
- `docs/store-readiness.md`

Risk:

- Magaza yayininda hesap silme linki ve gercek islem sureci gerekir.

Oneri:

- `https://saloniva.app/hesap-silme` gercek sayfa olmali.
- Hesap silme backend'de audit log ve bekleme/onay sureciyle calismali.

## Dusuk Riskler / Iyi Durumlar

- `.gitignore` icinde `node_modules`, `.env`, `.expo`, build klasorleri ignore ediliyor.
- Repo icinde gercek API key, GitHub token veya JWT bulunmadi.
- App permissions minimal tutulmus.
- Rol/yetki modeli ve hassas veri katalogu planlanmis.
- Canli urun hazirlik ekrani uretim eksiklerini gorunur yapiyor.

## Oncelikli Duzeltme Sirasi

1. Supabase/Firebase/ozel API secimi yap.
2. Gercek auth ve salon tenant izolasyonunu uygula.
3. AsyncStorage'daki hassas demo veriyi canli backend'e tasi.
4. Role permission kontrolunu server-side zorunlu yap.
5. Odeme ve lisans kontrolunu backend'e bagla.
6. Hesap silme, veri disari aktarma ve audit log surecini ekle.
7. Expo SDK ve bagimlilik guvenligini planli guncelle.
8. App Store / Google Play icin hukuki linkleri ve testleri tamamla.

## Canli Kullanim Karari

- Demo / pilot gorusme: Uygun.
- Gercek musteri verisiyle pilot: Backend ve tenant izolasyonu baglandiktan sonra uygun.
- Abonelikli genel satis: Odeme, lisans, hukuki linkler ve testler tamamlandiktan sonra uygun.
