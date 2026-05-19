# Kurulum ve Teslim Süreci

## Amaç

Bu dosya Saloniva'nın alıcıya nasıl kurulacağını, hangi bilgilerin alınacağını ve teslim toplantısında nelerin kontrol edileceğini açıklar.

## Teslim Öncesi Alınacak Bilgiler

- Marka adı
- Logo dosyası
- Ana renk ve yardımcı renk tercihi
- Salon adı ve şube bilgileri
- Yönetici kullanıcı e-postası
- Hizmet listesi ve fiyatlar
- Personel listesi
- Paket/seans türleri
- Demo veri mi gerçek veri mi kullanılacağı
- Web alan adı ve mağaza hesaplarının kime ait olacağı

## Marka Uyarlama Kapsamı

- Uygulama adı
- Logo ve splash görseli
- Ana renk sistemi
- Demo ekranlarında marka dili
- Satış PDF'i ve demo video metninde marka adı

## Teknik Kurulum Adımları

1. Proje bağımlılıkları kurulur.
2. Supabase projesi hazırlanır.
3. `supabase/schema.sql` çalıştırılır.
4. `supabase/phase2-auth.sql` çalıştırılır.
5. `.env` alanları doldurulur.
6. İlk yönetici hesabı oluşturulur.
7. Demo veriler yüklenir veya gerçek veri girişi yapılır.
8. Web ve mobil önizleme test edilir.

## Teslim Toplantısı Akışı

1. Yönetici hesabıyla giriş yapılır.
2. Panel, takvim, müşteri, paket ve ödeme ekranları gösterilir.
3. Online randevu talebi oluşturulur.
4. Ödeme ve borç hatırlatma akışı test edilir.
5. Supabase veri ayrımı ve kullanıcı rolü anlatılır.
6. Lisans kapsamı ve destek sınırı tekrar edilir.
7. Teslim kabul listesi birlikte kontrol edilir.

## Canlıya Geçmeden Önce

- Gerçek domain yönlendirmeleri tamamlanmalı.
- Şifre sıfırlama redirect URL doğrulanmalı.
- Gizlilik politikası ve destek sayfası yayına alınmalı.
- Mobil build gerçek cihazda test edilmeli.
- App Store / Google Play hesap sorumluluğu netleşmeli.