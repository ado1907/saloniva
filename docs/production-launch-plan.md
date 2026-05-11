# Saloniva Satisa Cikis Plani

Saloniva artik pazarlanabilir MVP demosu seviyesindedir. Gercek satisa cikis icin siradaki hedef, demo veriden guvenli bulut urunune gecistir.

## 1. Urun Degeri

- Salon sahibine gelir, randevu, paket, odeme, stok ve personel akisini tek panelde gosteren isletme urunu.
- Gelir danismani ve karar ozeti, uygulamanin sadece kayit tutmadigini; para kazandiran aksiyon urettigini anlatir.
- Mobil musteri uygulamasi onizlemesi, salonun musterisine de premium deneyim sundugunu gosterir.

## 2. Satis Icin Kritik Eksikler

1. Gercek kullanici hesabi ve salon tenant yapisi
2. Bulut veritabani ve yedekleme
3. Abonelik, odeme ve lisans kontrolu
4. Otomatik bildirim ve WhatsApp entegrasyon kurallari
5. App Store ve Google Play build, ikon, splash ve ekran goruntuleri
6. Gizlilik politikasi, kullanim kosullari ve hesap silme web linkleri

## 3. Kodlama Sirasi

1. Backend gateway katmanini genislet
2. Auth ve rol bazli yetki yapisini ekle
3. Bulut veri semasini tasarla
4. Abonelik ve lisans ekranini ekle
5. Bildirim motorunu planla
6. Store varliklarini ve ekran goruntulerini hazirla

API endpoint sozlesmeleri `src/services/apiContracts.ts` icinde baslatildi. Bu sozlesmeler auth, salon snapshot, operasyonlar, public booking, billing ve hesap silme akisini kapsar.

Sistematik gelistirme sirasi `docs/agent-workflow.md` icinde tanimlandi. Uygulama icindeki Ajan Calisma Merkezi, Business App Planner, Saloniva App Builder, Premium UI Designer, Expo Troubleshooter, Security and Data, Store Readiness ve QA ajanlarini tek ekranda takip eder.

## 6. Uygulamada Hazirlanan Uretim Katmanlari

- Salon hesabi artik `salonId`, plan, abonelik durumu, deneme bitisi ve yetki listesi tasir.
- Ayarlar ekraninda aktif plan, lisans durumu, plan limiti ve yetkiler gorunur.
- Satisa Cikis Merkezi demo hesap ve lisans durumunu urun icinde gosterir.
- Abonelik ve Odeme ekrani Baslangic, Profesyonel ve Premium planlarini urun icinde sunar.

## 4. Satis Paketi

- Baslangic: tek sube, temel randevu ve musteri takibi
- Profesyonel: paket, odeme, personel, rapor ve kampanya
- Premium: cok sube, gelismis rapor, oncelikli destek ve musteri uygulamasi

## 5. Demo Sunum Akisi

1. Panel: salon sahibi karar ozeti
2. Takvim: gunluk randevu akisi
3. Musteri: borc, paket ve notlar
4. Paketler: seans ve odeme takibi
5. Raporlar: gelir danismani
6. Salon vitrini: hizmetler, paketler, yorum guveni ve sube CTA'lari
7. Mobil musteri uygulamasi: premium musteri deneyimi
8. Satis ve kalite merkezi: urunun ciddi hazirlandigini goster

## 7. Profesyonel Salon Vitrini

Salon Vitrini ekrani, profesyonel salon sitelerindeki hizmet kategorileri, paket tanitimi, yorum/puan sinyali, sube bilgisi ve hizli WhatsApp/randevu CTA mantigini Saloniva icine tasir. Bu ekran salonlarin sadece operasyonu degil, musteriye gorunen satis yuzunu de yonetebilecegini anlatir.

Vitrin ekranindaki CTA ve talep formu, `bookingRequests` akisi uzerinden Online Randevu Linki ekranina baglanir. Boylece musteri hizmeti gorup talep olusturur, salon da talebi onaylayip randevuya donusturebilir.

## 8. Satis Firsati Hatti

Vitrin ve online randevu talepleri `SalesOpportunitiesScreen` icinde gelir potansiyeli, kaynak, oncelik ve siradaki aksiyon olarak listelenir. Bu ekran salon sahibine hangi talebe once donmesi gerektigini ve yaklasik gelir firsatini gosterir.

## 9. Kurulum Sihirbazi

Kurulum Sihirbazi, yeni salon sahibine uygulamanin hangi adimlarla satisa hazir hale gelecegini gosterir: salon profili, hizmet/fiyat listesi, personel, musteri vitrini, odeme/abonelik ve magaza hazirligi. Bu ekran gercek urunde ilk giris deneyiminin temelini olusturur.

## 10. Ajan Calisma Merkezi

Ajan Calisma Merkezi, urunun bundan sonraki gelistirme turlarini siraya baglar. Once ticari deger, sonra Saloniva uygulama standardi, premium arayuz, Expo saglamligi, guvenlik/veri, magaza hazirligi ve QA kontrolu izlenir. Boylece her yeni adim satisa cikacak urun hedefinden kopmadan ilerler.

## 11. Guvenlik ve Yetki Merkezi

Guvenlik ve Yetki Merkezi, Salon Sahibi, Yonetici ve Personel rollerini urun icinde ayrilan yetkilerle gosterir. Musteri verisi, odeme bilgisi, randevu/personel takvimi ve abonelik/lisans bilgisi hassasiyet seviyesine gore siniflandirildi. Gercek satisa cikarken bu kurallar sadece uygulama ekraninda kalmamali; backend API katmaninda salon tenant ve rol kontrolu olarak zorunlu hale getirilmelidir.

## 12. Canli Urun Hazirligi

Canli Urun Hazirligi ekrani, gercek kullanici girisi, bulut veritabani, salon tenant ayrimi, abonelik/odeme sistemi, App Store/Google Play varliklari, gizlilik-destek-hesap silme linkleri ve gercek test senaryolarini tek yerde toplar. Bu ekran artik satisa acilmadan once takip edilecek ana kontrol panelidir.

## 13. Pilot Satis Paketi

Pilot Satis Paketi, Saloniva'yi gercek salonlara gostermek icin hazir demo akisi, pilot teklif, gorusme sorulari ve takip listesini icerir. Bu paket canli urun tamamlanmadan once pilot musteri bulmak ve urun geri bildirimi toplamak icin kullanilir.

## 14. Guvenlik Taramasi

Guvenlik taramasi `docs/security-review.md` icinde tutulur. Mevcut sonuc: demo ve pilot gorusme icin uygun; gercek musteri verisiyle canli kullanim icin auth, tenant izolasyonu, backend veri saklama, odeme/lisans, hesap silme ve audit log tamamlanmalidir.
