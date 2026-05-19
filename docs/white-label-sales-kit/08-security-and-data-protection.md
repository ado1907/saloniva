# Güvenlik ve Veri Koruma

## Güvenlik Yaklaşımı

Saloniva, salon bazlı veri ayrımı ve rol temelli erişim modeliyle tasarlanmıştır. Her salonun verisi kendi salon hesabı altında tutulur.

## Temel Güvenlik İlkeleri

- Her salon kendi verisini görmelidir.
- Supabase RLS politikaları veri ayrımının ana katmanıdır.
- `service_role` anahtarı istemci uygulamaya konmaz.
- Gizli anahtarlar GitHub'a veya satış dosyalarına eklenmez.
- Kullanıcı rolleri yetki kapsamına göre sınırlandırılır.
- Gerçek müşteri verileri demo ortamında paylaşılmamalıdır.

## Rol Modeli

- Salon Sahibi: salon ayarları, müşteri, ödeme, personel ve rapor yetkisi
- Yönetici: günlük operasyon ve müşteri akışı
- Personel: kendi randevuları ve sınırlı müşteri bilgisi

## Alıcı Sorumlulukları

- Kendi kullanıcı hesaplarını güvenli yönetmek
- Güçlü şifre kullanmak
- KVKK/GDPR metinlerini hukuk danışmanına onaylatmak
- Müşteri verisini yalnızca yasal amaçlarla işlemek
- Alan adı, mağaza hesabı ve e-posta hesaplarını korumak

## Sağlayıcı Sorumlulukları

- Teslim kapsamındaki teknik güvenlik ayarlarını yapmak
- Gizli anahtarları istemciye koymamak
- Supabase RLS modelini kurmak
- Güvenlik kontrol listesini teslimde paylaşmak

## Hukuki Not

Bu doküman teknik güvenlik yaklaşımını açıklar. Nihai KVKK/GDPR, gizlilik politikası ve veri işleme metinleri alıcının hukuk danışmanı tarafından hazırlanmalı veya onaylanmalıdır.