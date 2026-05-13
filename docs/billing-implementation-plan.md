# Saloniva Billing Implementation Plan

Saloniva abonelik sistemi su anda urun icinde sozlesme, plan ve lisans kurali seviyesinde hazirdir. Canli odeme icin siradaki teknik kurulum asagidaki gibidir.

## Onerilen Saglayici

- Turkiye odakli satis icin: iyzico veya PayTR
- Global/white-label satis icin: Stripe

## Gerekli Backend Parcalari

1. Checkout endpoint
   - `/api/billing/checkout/starter`
   - `/api/billing/checkout/pro`
   - `/api/billing/checkout/premium`

2. Webhook endpoint
   - `checkout.completed`: salon aboneligini `active` yapar.
   - `invoice.payment_failed`: aboneligi `past_due` yapar.
   - `subscription.canceled`: aboneligi `canceled` yapar.

3. Lisans kontrolu
   - `trialing`: deneme bitis tarihine kadar tam erisim.
   - `active`: tam erisim.
   - `past_due`: uyarili erisim, kritik satis ekranlari acik kalir.
   - `canceled`: salt okunur mod.

## Supabase Tablolari

- `salons.plan_id`
- `salons.subscription_status`
- `salons.trial_ends_at`
- `audit_logs` icinde abonelik olay kayitlari

## Uygulama Durumu

- `src/services/subscriptionGateway.ts` plan, checkout sozlesmesi, redirect ve webhook olaylarini tanimlar.
- `src/screens/BillingScreen.tsx` abonelik operasyon ekranini gosterir.
- Canli odeme icin server-side API gereklidir; gizli odeme anahtarlari Expo istemcisine konulmamalidir.
