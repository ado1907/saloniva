export type ProductionReadinessStatus = "Hazır" | "Demo" | "Sırada" | "Kritik";

export type ProductionReadinessPhase = {
  title: string;
  agent: string;
  status: ProductionReadinessStatus;
  summary: string;
  nextAction: string;
};

export const productionReadinessPhases: ProductionReadinessPhase[] = [
  {
    title: "Gerçek kullanıcı girişi ve bulut veritabanı",
    agent: "Backend/Auth Agent",
    status: "Sırada",
    summary: "Demo giriş hazır; gerçek auth, şifre sıfırlama, cloud snapshot ve sync bağlantısı kurulmalı.",
    nextAction: "Supabase/Firebase/özel API seçilip authGateway gerçek sağlayıcıya bağlanacak."
  },
  {
    title: "Salonların verisinin ayrılması",
    agent: "Security and Data Agent",
    status: "Kritik",
    summary: "Rol matrisi ve hassas veri katalogu hazır; backend tenant izolasyonu zorunlu.",
    nextAction: "Tüm endpointlerde salonId oturumdan doğrulanacak ve audit log eklenecek."
  },
  {
    title: "Abonelik ve ödeme sistemi",
    agent: "Billing Agent",
    status: "Sırada",
    summary: "Planlar ürün içinde hazır; gerçek ödeme sağlayıcısı ve lisans kontrolü bağlanmalı.",
    nextAction: "Web ödeme ve mobil mağaza abonelik politikası netleştirilecek."
  },
  {
    title: "App Store / Google Play ikon, splash, ekran görüntüleri",
    agent: "Store Readiness Agent",
    status: "Sırada",
    summary: "Premium görsel dil hazır; mağaza varlıkları ve ekran görüntüsü seti hazırlanmalı.",
    nextAction: "Panel, Rapor, Vitrin, Güvenlik ve Müşteri Uygulaması ekranları alınacak."
  },
  {
    title: "Gizlilik, destek ve hesap silme web linkleri",
    agent: "Legal/Store Agent",
    status: "Kritik",
    summary: "Uygulama içi metinler var; yayın için gerçek web sayfaları gerekir.",
    nextAction: "Gizlilik, kullanım koşulları, destek ve hesap silme sayfaları yayına alınacak."
  },
  {
    title: "Gerçek test",
    agent: "QA Agent",
    status: "Sırada",
    summary: "Test senaryoları tanımlandı; web, mobil, dil, tema ve kritik formlar denenmeli.",
    nextAction: "Kabul kriterlerine göre randevu, ödeme, paket, dil ve tema testi yapılacak."
  }
];

export const productionReadinessScore = Math.round(
  productionReadinessPhases.reduce((score, phase) => {
    if (phase.status === "Hazır") return score + 100;
    if (phase.status === "Demo") return score + 70;
    if (phase.status === "Sırada") return score + 35;
    return score + 15;
  }, 0) / productionReadinessPhases.length
);
