export const productConfig = {
  appName: "Saloniva",
  legalName: "Saloniva Yazılım",
  supportEmail: "destek@saloniva.app",
  websiteUrl: "https://saloniva.app",
  privacyUrl: "https://saloniva.app/gizlilik",
  termsUrl: "https://saloniva.app/kullanim-kosullari",
  supportUrl: "https://saloniva.app/destek",
  deleteAccountUrl: "https://saloniva.app/hesap-silme",
  bundle: {
    ios: "com.saloniva.app",
    android: "com.saloniva.app",
    scheme: "saloniva"
  },
  plans: [
    {
      id: "starter",
      name: "Başlangıç",
      price: "399 TL/ay",
      description: "Tek şube, temel randevu ve müşteri takibi.",
      limits: "1 kullanıcı, 1 şube, temel rapor"
    },
    {
      id: "pro",
      name: "Profesyonel",
      price: "799 TL/ay",
      description: "Paket, ödeme, personel, rapor ve kampanya modülleri.",
      limits: "5 kullanıcı, gelişmiş rapor, WhatsApp akışları"
    },
    {
      id: "premium",
      name: "Premium",
      price: "1.299 TL/ay",
      description: "Çok şube, gelişmiş rapor, öncelikli destek ve müşteri uygulaması.",
      limits: "Çok şube, müşteri uygulaması, öncelikli destek"
    }
  ],
  demoAccount: {
    salonId: "salon-demo-001",
    planId: "pro",
    subscriptionStatus: "Deneme",
    trialEndsAt: "23 Mayıs 2026",
    permissions: ["randevu", "musteri", "odeme", "rapor", "ayar", "personel"]
  }
};
