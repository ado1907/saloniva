import { productConfig } from "../config/productConfig";

export type BillingProvider = "iyzico-ready" | "stripe-ready" | "app-store-ready" | "google-play-ready";

export const billingReadinessPlan = [
  {
    title: "Web abonelik ödemesi",
    description: "İyzico veya Stripe ile karttan aylık/yıllık abonelik başlatılır.",
    status: "Sırada"
  },
  {
    title: "Mobil mağaza aboneliği",
    description: "App Store ve Google Play politikaları kontrol edilerek mobil abonelik modeli netleşir.",
    status: "Kritik"
  },
  {
    title: "Lisans kontrolü",
    description: "Deneme bitişi, ödeme başarısızlığı ve plan limiti uygulama erişimine bağlanır.",
    status: "Sırada"
  },
  {
    title: "Fatura ve bildirim",
    description: "Ödeme başarılı/başarısız durumları e-posta ve uygulama içi bildirimle gösterilir.",
    status: "Sırada"
  }
] as const;

export const checkoutContracts = productConfig.plans.map((plan) => ({
  planId: plan.id,
  planName: plan.name,
  price: plan.price,
  checkoutPath: `/salons/:salonId/subscription/checkout?plan=${plan.id}`,
  licenseRule: `${plan.name} planı aktif ödeme veya deneme süresi boyunca kullanılabilir.`
}));

