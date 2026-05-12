# Saloniva Hukuki Sayfa Hazirligi

Bu dosya App Store / Google Play ve B2B satis sureci icin yayinlanmasi gereken temel web sayfalarini netlestirir.

## Zorunlu Linkler

- Gizlilik politikasi: `https://saloniva.app/gizlilik`
- Kullanim kosullari: `https://saloniva.app/kullanim-kosullari`
- Destek sayfasi: `https://saloniva.app/destek`
- Hesap silme: `https://saloniva.app/hesap-silme`

## Gizlilik Politikasi Sayfasi

Anlatilacak ana basliklar:

- Hangi veriler toplanir: salon bilgisi, kullanici e-postasi, musteri adi, telefon, randevu, paket, seans, odeme ve notlar.
- Veri neden islenir: salon operasyonunu, randevu akislarini, tahsilat ve musteri takibini yurutmek.
- Veri nerede tutulur: demo modda yerel cihaz, canli modda Supabase/veritabani.
- Veri paylasimi: reklam veya satis amaciyla ucuncu taraflara paylasilmaz.
- WhatsApp cikislari: kullanici onayiyla dis uygulamaya mesaj hazirlanabilir.
- Kullanici haklari: erisim, duzeltme, silme ve destek talebi.

## Hesap Silme Sayfasi

Sayfada bulunacak alanlar:

- Salon adi
- Yetkili adi
- E-posta
- Silme nedeni
- Verilerin silinecegine dair onay kutusu
- Destek ekibine talep gonder butonu

Canli backend geldiginde bu form bir destek kaydi veya audit log olusturmalidir.

## Destek Sayfasi

Minimum icerik:

- Destek e-postasi: `destek@saloniva.app`
- Kurulum, hesap erisimi, veri yonetimi, magaza surumu ve hata bildirimi kapsam bilgisi
- Demo hesap ve test hesabi bilgileri icin yonlendirme

## Durum

- Uygulama icinde gizlilik, kullanim kosullari, destek ve hesap silme metinleri gorunur.
- Web linkleri `src/config/productConfig.ts` icinde merkezi olarak tanimlandi.
- Gercek web sayfalari yayinlanmadan App Store / Google Play basvurusu tamamlanmamalidir.

