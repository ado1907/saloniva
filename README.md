# Saloniva

Saloniva, güzellik salonları için web, Android ve iOS uyumlu profesyonel yönetim uygulamasıdır.

## Durum

Saloniva şu anda pazarlanabilir MVP demo seviyesindedir. Gerçek satışa çıkış için backend, abonelik, ödeme, mağaza varlıkları ve yayın süreçleri sıradaki üretim adımlarıdır.

## İlk MVP

- Ana panel
- Giriş, demo hesap ve salon oluşturma
- Randevu takvimi
- Müşteri kartları
- Paket ve seans takibi
- Ödeme ve borç takibi
- Hizmet ve fiyat listesi
- Personel yönetimi
- Raporlar
- Ayarlar, gizlilik ve hesap silme talebi
- Dil seçenekleri ve koyu mod
- WhatsApp hızlı mesaj akışı
- Web, tablet ve mobil uyumlu tek arayüz

## Proje Yapısı

```text
src/
  components/  Ortak kartlar, butonlar ve ekran parçaları
  data/        Demo veriler
  navigation/  Web yan menü ve mobil alt menü
  screens/     Ana uygulama ekranları
  theme/       Renkler ve tasarım ölçüleri
  types/       Ortak veri tipleri
  utils/       Para formatlama ve WhatsApp yardımcıları
  state/       Uygulama içi ortak veri ve işlem yönetimi
docs/
  agent-workflow.md  Saloniva için ajan çalışma sırası
  agent-run-latest.md  Son ajan çalıştırma özeti
```

## Demo Akışı

Uygulama açıldığında giriş ekranı gelir. Demo hesapla giriş yapılabilir veya yeni salon hesabı oluşturulabilir. İlk sürümde roller `Salon Sahibi`, `Yönetici` ve `Personel` olarak planlandı.

## Kodlanan Ana Ekranlar

- Giriş ve salon oluşturma
- Ana panel
- Randevu takvimi
- Müşteriler
- Paket ve seanslar
- Ödemeler ve borçlar
- Hizmet ve fiyat listesi
- Personel yönetimi
- Raporlar
- Ayarlar
- Daha fazla yönetim modülleri

## Uygulama İçi Veri Yönetimi

Randevu, müşteri, paket, ödeme, hizmet ve personel verileri `SalonStoreProvider` üzerinden ortak yönetilir. İlk gerçek işlemler olarak randevuyu tamamlandı yapma ve paket seansı kullanma akışları store'a bağlandı.

## Etkileşimli Formlar

- Yeni randevu oluşturma
- Yeni müşteri ekleme
- Ödeme alma
- Randevuyu tamamlandı yapma
- Paket seansı kullanma
- Hizmet seçimine göre randevu ücret/süre önerisi
- Ödeme alınca müşteri borcunu güncelleme
- Web, Android ve iOS uyumlu kalıcı veri saklama
- Ayarlardan demo veriye sıfırlama
- Mobilde sade alt menü ve Daha Fazla üzerinden yönetim modüllerine erişim
- İşlem sonrası başarı bildirimi
- Çalışan arama/filtreler ve boş sonuç ekranları
- Yeni randevu, müşteri ve ödeme formlarında doğrulama
- Randevu saat çakışması kontrolü
- Randevu durumunu geldi, gelmedi, iptal veya tamamlandı olarak güncelleme
- WhatsApp mesaj şablonları
- Ödeme makbuz önizlemesi
- Raporlarda akıllı içgörü kartları
- Raporlarda gelir danışmanı ve büyüme planı
- Online randevu linki demo ekranı
- Online randevu talep formu
- Online randevu talebini onaylayıp randevuya dönüştürme
- Kampanya segmentleri ve hazır WhatsApp mesajları
- Stok takibi ve düşük stok uyarıları
- Stok artırma ve kullanım kaydı
- Çok şube yönetim demosu
- Mobil müşteri uygulaması demo önizlemesi
- Kalite merkezi, güvenlik ve mağaza hazırlığı görünümü
- Satışa çıkış merkezi
- Abonelik, lisans ve demo plan görünümü
- Abonelik ve ödeme plan seçimi ekranı
- Salon vitrini ve profesyonel hizmet tanıtım arayüzü
- Satış fırsatları ve gelir potansiyeli takip ekranı
- Yeni salon kurulum sihirbazı
- Genel arama modalı
- Ana panel uyarı merkezi
- Salon sahibi karar özeti
- Ortak özet kartı bileşeni
- Premium Salon renk paleti
- Merkezi tipografi ve arayüz yoğunluğu ayarları
- Premium salon hero görsel bileşeni
- Hareketli yazı ve sayarak artan rakam bileşenleri
- Lüks ürün/salon görsel dili ve koyu sidebar
- Sinematik salon hero görseli
- Gerçek fotoğraf tabanlı vitrin görseli
- Premium bar grafik ve trend kartları
- Ana panel için görsel moodboard alanı
- Tanıtım ve fiyatlandırma giriş ekranı
- Ayarlar içinde gizlilik, kullanım koşulları, destek ve hesap silme modalları
- Ayarlardan Türkçe, İngilizce ve Arapça dil seçimi
- Ayarlardan açık, koyu ve sistem görünüm modu
- Müşteri kartı detay modalı
- Müşteri notu ekleme
- Randevu detay modalı
- Paket ve seans detay modalı
- Paket detayından ön doldurulmuş ödeme alma
- Paket ödemesi alınca paket ödenen tutarını güncelleme
- Paket ekleme formu
- Ödeme detay modalı
- Hizmet detay modalı
- Hizmet ekleme ve aktif/pasif durumu değiştirme
- Personel detay modalı
- Müşteri tarafı randevu, paket ve sadakat önizlemesi
- skills-main referanslarından türetilmiş kalite, güvenlik, tasarım ve test kontrol ekranı
- Backend gateway altyapısı ve üretim geçiş planı
- Salon hesabı, plan, deneme süresi ve yetki modeli
- Başlangıç, Profesyonel ve Premium planlarının ürün içi sunumu
- Hizmetler, paketler, yorum sinyalleri ve şube CTA'ları için müşteri vitrini
- Salon vitrininden online randevu talebi oluşturma
- Online talepleri satış fırsatına çevirme ve önceliklendirme
- Salon profili, hizmet, personel, vitrin, ödeme ve mağaza kurulum adımları
- Ajan çalışma merkezi ve sistematik geliştirme sırası
- Proje içi ajan workflow dokümanı
- Güvenlik ve yetki merkezi
- Salon sahibi, yönetici ve personel rol matrisi
- Hassas veri katalogu ve üretim güvenlik kontrol listesi
- Canlı ürün hazırlığı ekranı
- Pilot satış paketi ekranı
- Salon görüşmesi demo akışı ve pilot teklif dokümanı
- Gerçek auth, bulut veritabanı, tenant ayrımı ve abonelik planı
- Mağaza ikon, splash, ekran görüntüsü ve hukuki link checklist'i
- Gerçek randevu, ödeme, paket, dil, koyu mod ve mobil test senaryoları

## Kalıcı Veri

Uygulama verileri `@react-native-async-storage/async-storage` ile cihazda saklanır. Randevu, müşteri, paket, ödeme, hizmet ve personel verileri uygulama kapanıp açıldığında geri yüklenir.

## Çalıştırma

Bağımlılıklar kurulduktan sonra:

```bash
npm run web
```

Android ve iOS için:

```bash
npm run android
npm run ios
```

## Mağaza Hazırlığı

İlk sürümde gereksiz cihaz izinleri istenmez. Gizlilik politikası, kullanım koşulları, destek bilgisi, demo hesap ve hesap silme akışı uygulama mağazası hazırlıklarının parçasıdır.

Detaylı yayın planı için `docs/production-launch-plan.md`, backend geçiş planı için `docs/backend-architecture.md` dosyalarına bakın.
