# Saloniva Mobile QA Checklist

Bu kontrol listesi mobil tasma, bozuk gorunum ve temel akis testleri icindir.

## Ekran Boyutlari

- 360 x 740 Android kucuk ekran
- 390 x 844 iPhone standart ekran
- 430 x 932 buyuk iPhone ekran
- 768 x 1024 tablet dikey
- 1024 x 768 tablet yatay

## Kontrol Edilecek Akislar

1. Tanitim ve giris ekrani
   - Baslik iki satiri asarsa kart disina cikmiyor.
   - Salon olustur formu ekrana sigiyor.
   - Hata ve basari mesajlari butonlari iterek tasma yapmiyor.

2. Panel
   - Karar kartlari tek sutuna duzgun dusuyor.
   - Gorsel alanlar ve metinler ust uste binmiyor.
   - Alt navigasyon sabit kaliyor.

3. Randevu
   - Yeni randevu modalinda saat, ucret ve durum alanlari dar ekranda kiriliyor.
   - Kaydet butonu gorunur kaliyor.
   - Hata mesaji kullaniciya net gorunuyor.

4. Musteri, paket ve odeme
   - Kartlar yatay tasma yapmiyor.
   - Telefon, fiyat ve paket metinleri satir kirabiliyor.
   - Bos durum, filtre ve arama alanlari okunakli.

5. Ayarlar
   - Dil ve koyu mod secimleri dar ekranda tasma yapmiyor.
   - Guvenlik, destek, gizlilik ve hesap silme linkleri gorunur.

## Son Kabul Kriteri

- Yatay scroll sadece tablo iceren admin/test gorunumlerinde kabul edilir.
- Ana kullanici ekranlarinda metin, buton veya modal kesilmemeli.
- Kayit, giris, cikis, randevu ekleme, odeme ekleme ve demo veri sifirlama akislari mobilde tamamlanmali.
