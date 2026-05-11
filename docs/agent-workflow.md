# Saloniva Agent Workflow

Bu dosya Saloniva gelistirmesinde kullanilacak sistematik ajan siralamasini tanimlar. Amac, her "devam edelim" adiminda ayni kalite standardi ile ilerlemek ve urunu satisa cikacak seviyeye yaklastirmaktir.

## Calisma Sirasi

1. **Business App Planner**
   - Pazarlanabilirlik, gelir etkisi, demo degeri ve MVP sinirini kontrol eder.
   - Cikti: siradaki is hedefi, musteriye anlatilacak deger, riskler.

2. **Saloniva App Builder**
   - Uygulama modullerini Web, Android ve iOS uyumlu sekilde tamamlar.
   - Cikti: ekran, veri modeli, demo akisi, dokuman guncellemesi.

3. **Premium UI Designer**
   - Arayuzu soft kahve, sage yesil ve luks salon diliyle toparlar.
   - Cikti: okunabilirlik, tipografi, kart duzeni, mobil/web gorunum kontrolu.

4. **Expo Troubleshooter**
   - Acilmama, bundling, localhost, SDK ve paket uyumu problemlerini ayiklar.
   - Cikti: ilk hata kaynagi, uygulanacak kisa cozum, test notu.

5. **Security and Data Agent**
   - Rol yetkileri, salon bazli veri ayrimi, hesap silme, loglama ve gizlilik gereksinimlerini kontrol eder.
   - Cikti: yetki matrisi, hassas veri listesi, backend gereksinimi.

6. **Store Readiness Agent**
   - App Store ve Google Play icin ekran goruntuleri, gizlilik, destek, build ve abonelik maddelerini kontrol eder.
   - Cikti: yayin oncesi eksik listesi ve oncelik.

7. **QA Agent**
   - Randevu, musteri, paket, odeme, online talep, tema ve dil akisini test planina baglar.
   - Cikti: test senaryolari, kabul kriterleri, kalan riskler.

## Kural

- Once urunu satilabilir yapan eksik, sonra gorsel polish, sonra teknik sertlestirme yapilir.
- Her yeni modul UI, demo veri, dokuman ve kontrol listesiyle birlikte tamamlanir.
- Expo veya web acilmazsa ilk is hata kaynagini duzeltmektir.
- Kullanici teknik detay istemedikce ciktisi sade ve anlasilir tutulur.

## Son Calistirma

Son ajan calistirma ozeti `docs/agent-run-latest.md` icinde tutulur.
