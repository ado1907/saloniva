# Saloniva Tenant Isolation Test

Bu test, her salonun sadece kendi verisini gördüğünü doğrulamak için yapılır.

## Ön Koşullar

- Supabase `schema.sql` ve `phase2-auth.sql` çalıştırılmış olmalı.
- Test sırasında Supabase Email Confirm kapalı olmalı veya test e-postaları doğrulanmış olmalı.
- Uygulama `.env` içinde `EXPO_PUBLIC_BACKEND_MODE=supabase` ile çalışmalı.
- Uygulama üst başlığında `Bulut aktif` yazmalı.

## Test Akışı

1. Salon A hesabı oluştur.
   - Örnek: `salon-a-test@example.com`
   - Salon adı: `Salon A Test`

2. Salon A ile giriş yap.
   - 1 müşteri ekle.
   - 1 randevu ekle.
   - 1 ödeme ekle.

3. Supabase Table Editor içinde kontrol et.
   - `customers`, `appointments`, `payments` tablolarında Salon A kayıtları görünmeli.
   - Kayıtlarda aynı `salon_id` değeri bulunmalı.

4. Uygulamadan çıkış yap.

5. Salon B hesabı oluştur.
   - Örnek: `salon-b-test@example.com`
   - Salon adı: `Salon B Test`

6. Salon B ile giriş yap.
   - Salon A müşterisi, randevusu ve ödemesi uygulamada görünmemeli.
   - Salon B için ayrı bir müşteri, randevu ve ödeme ekle.

7. Supabase Table Editor içinde tekrar kontrol et.
   - Salon B kayıtları farklı bir `salon_id` ile oluşmalı.
   - Salon A kayıtları silinmeden durmalı.

8. Salon A ile tekrar giriş yap.
   - Salon A sadece kendi verilerini görmeli.
   - Salon B kayıtları görünmemeli.

## Başarı Kriteri

- Salon A ve Salon B kayıtları farklı `salon_id` değerleriyle tutulur.
- Uygulamada Salon A, Salon B verilerini görmez.
- Uygulamada Salon B, Salon A verilerini görmez.
- Supabase RLS politikaları açık kalır.
- Client tarafında `sb_secret_` veya service role key kullanılmaz.

## Not

Uygulama listeleri hem kullanıcı access token'ı hem de `salon_id` filtresi ile çağırır. Güvenlik kararı yine Supabase RLS politikalarında kalır.

## 2026-05-12 Otomatik API Test Sonucu

Codex tarafından Supabase public API üzerinden iki geçici test salonu oluşturuldu:

- Salon A kendi randevusunu gördü.
- Salon B kendi randevusunu gördü.
- Salon B, Salon A `salon_id` filtresiyle veri çekmeye çalışınca sonuç boş döndü.
- Salon B, Salon A `salon_id` ile randevu eklemeye çalışınca Supabase RLS isteği reddetti.

Sonuç: `passed: true`
