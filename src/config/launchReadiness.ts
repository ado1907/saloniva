import { Ionicons } from "@expo/vector-icons";

export type LaunchStatus = "Hazır" | "Demo" | "Sırada" | "Kritik";

export type LaunchTask = {
  title: string;
  description: string;
  status: LaunchStatus;
};

export type LaunchSection = {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  summary: string;
  score: number;
  tasks: LaunchTask[];
};

export const launchSections: LaunchSection[] = [
  {
    title: "Ürün ve Demo",
    icon: "sparkles-outline",
    summary: "Salon sahibine beş dakikada değer gösterecek ana iş akışları hazırlandı.",
    score: 88,
    tasks: [
      {
        title: "Salon yönetim paneli",
        description: "Randevu, müşteri, paket, ödeme, rapor, stok ve şube akışları demo seviyesinde çalışır.",
        status: "Hazır"
      },
      {
        title: "Gelir odaklı satış hikayesi",
        description: "Karar özeti, gelir danışmanı ve müşteri uygulaması önizlemesi pazarlama değerini güçlendirir.",
        status: "Hazır"
      },
      {
        title: "Gerçek müşteri onboarding akışı",
        description: "Salon profili, hizmetler, personel, vitrin, ödeme ve mağaza hazırlığını sıraya alan kurulum sihirbazı eklendi.",
        status: "Hazır"
      },
      {
        title: "Salon vitrin sayfası",
        description: "Hizmetler, paketler, yorum gücü, şubeler ve WhatsApp/randevu çağrıları için profesyonel müşteri arayüzü eklendi.",
        status: "Hazır"
      },
      {
        title: "Satış fırsatı hattı",
        description: "Vitrin ve online randevu talepleri gelir potansiyeline göre fırsat listesine dönüşür.",
        status: "Hazır"
      },
      {
        title: "Ajan çalışma sistemi",
        description: "Ürün, arayüz, Expo, güvenlik, mağaza ve QA ajanları geliştirme sırasına bağlandı.",
        status: "Hazır"
      }
    ]
  },
  {
    title: "Backend ve Veri",
    icon: "server-outline",
    summary: "Satışa çıkış için demo store yerine güvenli bulut veri katmanı gerekir.",
    score: 42,
    tasks: [
      {
        title: "Kullanıcı hesabı ve salon tenant yapısı",
        description: "Gerçek auth, salon tenant, oturum ve rol kontrolü için üretim hazırlık planı eklendi.",
        status: "Sırada"
      },
      {
        title: "Bulut veritabanı",
        description: "Randevu, müşteri, ödeme, paket ve personel verileri için bulut tablo planı çıkarıldı.",
        status: "Sırada"
      },
      {
        title: "Yedekleme ve veri silme",
        description: "Hesap silme, dışa aktarma ve yedekleme süreçleri ürün politikasıyla bağlanmalı.",
        status: "Sırada"
      }
    ]
  },
  {
    title: "Para Kazanma",
    icon: "card-outline",
    summary: "Abonelik planı ve ödeme altyapısı satış kanalının merkezinde olmalı.",
    score: 36,
    tasks: [
      {
        title: "Abonelik planları",
        description: "Başlangıç, Profesyonel ve Premium planları ürün içinde ve web tanıtımında netleşmeli.",
        status: "Demo"
      },
      {
        title: "Online ödeme",
        description: "Web ödeme, mobil mağaza aboneliği, lisans kontrolü ve checkout sözleşmeleri planlandı.",
        status: "Sırada"
      },
      {
        title: "Fatura ve lisans kontrolü",
        description: "Deneme süresi, ödeme başarısızlığı ve lisans durumu kullanıcı deneyimine bağlanmalı.",
        status: "Sırada"
      }
    ]
  },
  {
    title: "Mağaza ve Yayın",
    icon: "rocket-outline",
    summary: "App Store ve Google Play için hukuki metin, görseller ve build süreci tamamlanmalı.",
    score: 64,
    tasks: [
      {
        title: "Gizlilik, destek ve hesap silme",
        description: "Uygulama içinde temel karşılıkları var; yayın için gizlilik, destek ve hesap silme linkleri listelendi.",
        status: "Demo"
      },
      {
        title: "Ekran görüntüleri ve tanıtım metni",
        description: "Panel, rapor, müşteri uygulaması, kalite merkezi, güvenlik ve vitrin ekranları kullanılmalı.",
        status: "Sırada"
      },
      {
        title: "Android/iOS build",
        description: "Expo/EAS build, paket kimlikleri, ikon, splash ve mağaza sürüm notları tamamlanmalı.",
        status: "Sırada"
      }
    ]
  },
  {
    title: "Test ve Güvenlik",
    icon: "shield-checkmark-outline",
    summary: "Satış öncesi form, veri, yetki, tema, dil ve performans kontrolü sistemli yapılmalı.",
    score: 58,
    tasks: [
      {
        title: "Kritik kullanıcı akışı testi",
        description: "Randevu, ödeme, paket, dil, koyu mod, mobil ve web test senaryoları tanımlandı.",
        status: "Sırada"
      },
      {
        title: "Güvenlik tehdit modeli",
        description: "Müşteri verisi, ödeme bilgisi, rol yetkisi ve çoklu salon erişimi için güvenlik merkezi eklendi.",
        status: "Hazır"
      },
      {
        title: "Rol bazlı yetki matrisi",
        description: "Salon sahibi, yönetici ve personel için ekran/yetki ayrımı ürün içinde görünür hale getirildi.",
        status: "Hazır"
      },
      {
        title: "Dil ve koyu mod kontrolü",
        description: "Türkçe, İngilizce, Arapça ve koyu mod ekranları taşma/okunabilirlik açısından kontrol edilmeli.",
        status: "Demo"
      }
    ]
  }
];

export const launchScore = Math.round(
  launchSections.reduce((total, section) => total + section.score, 0) / launchSections.length
);
