export const productConfig = {
  appName: "Saloniva",
  legalName: "Saloniva Software",
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
      name: "Free",
      price: "0 TL",
      description: "Demo ve tek kullanicili baslangic salon takibi.",
      limits: "1 kullanici, temel randevu, demo raporlar",
      features: ["Randevu takvimi", "Musteri listesi", "Temel gelir ozeti"]
    },
    {
      id: "pro",
      name: "Pro",
      price: "299 TL / ay",
      description: "Paket, odeme, personel ve gunluk karar paneliyle aktif salon yonetimi.",
      limits: "5 kullanici, profesyonel rapor, paket ve tahsilat takibi",
      features: ["Paket ve seans takibi", "Odeme hatirlatmalari", "Personel performansi", "Online talep yonetimi"]
    },
    {
      id: "premium",
      name: "Business",
      price: "699 TL / ay",
      description: "Cok subeli markalar ve premium salonlar icin buyume paketi.",
      limits: "Cok sube, gelismis rapor, oncelikli destek, musteri uygulamasi hazirligi",
      features: ["Cok sube yonetimi", "Gelismis gelir raporlari", "Oncelikli destek", "White-label teslim hazirligi"]
    }
  ],
  demoAccount: {
    salonId: "salon-demo-001",
    planId: "pro",
    subscriptionStatus: "Deneme",
    trialEndsAt: "23 Mayis 2026",
    permissions: ["randevu", "musteri", "odeme", "rapor", "ayar", "personel"]
  }
} as const;