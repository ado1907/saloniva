# Real Device Test Checklist

## Android

1. Expo Go veya development build ile uygulamayi ac.
2. Giris, salon olusturma ve cikis akisini test et.
3. Randevu ekle, Supabase `appointments` tablosunda kaydin dustugunu dogrula.
4. Odeme ekle, Supabase `payments` tablosunda kaydin dustugunu dogrula.
5. Telefon klavyesi, sayisal klavye ve modal kaydirma davranisini kontrol et.

## iOS

1. SDK uyumlulugunu kontrol et. Expo Go en yeni SDK istiyorsa development build tercih edilir.
2. Safari ve uygulama icinde giris ekranini test et.
3. Sifre sifirlama e-postasindaki redirect URL'nin `https://saloniva.app/auth/callback` adresine gittigini dogrula.
4. Koyu mod ve dil degisiminin uygulama yeniden acilinca korundugunu kontrol et.

## Kabul

- Ayni kullanici cikis yapip tekrar girdiginde kendi salonunu gorur.
- Ikinci salon kullanicisi birinci salonun verisini goremez.
- App Store / Google Play icin ekran goruntusu alinacak tum ekranlar dolu veriyle acilir.
