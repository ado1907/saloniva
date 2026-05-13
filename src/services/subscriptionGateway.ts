import { productConfig } from "../config/productConfig";

export type BillingProvider = "iyzico-ready" | "stripe-ready" | "app-store-ready" | "google-play-ready";
export type LicenseStatus = "trialing" | "active" | "past_due" | "canceled";

export type CheckoutContract = {
  planId: string;
  planName: string;
  price: string;
  checkoutPath: string;
  successRedirect: string;
  cancelRedirect: string;
  licenseRule: string;
};

export const billingReadinessPlan = [
  {
    title: "Web abonelik odemesi",
    description: "Iyzico veya Stripe ile karttan aylik/yillik abonelik baslatilir.",
    status: "Sirada"
  },
  {
    title: "Mobil magaza aboneligi",
    description: "App Store ve Google Play politikalari kontrol edilerek mobil abonelik modeli netlesir.",
    status: "Kritik"
  },
  {
    title: "Lisans kontrolu",
    description: "Deneme bitisi, odeme basarisizligi ve plan limiti uygulama erisimine baglanir.",
    status: "Sirada"
  },
  {
    title: "Fatura ve bildirim",
    description: "Odeme basarili/basarisiz durumlari e-posta ve uygulama ici bildirimle gosterilir.",
    status: "Sirada"
  }
] as const;

export const checkoutContracts: CheckoutContract[] = productConfig.plans.map((plan) => ({
  planId: plan.id,
  planName: plan.name,
  price: plan.price,
  checkoutPath: `/salons/:salonId/subscription/checkout?plan=${plan.id}`,
  successRedirect: `${productConfig.websiteUrl}/odeme/basarili?plan=${plan.id}`,
  cancelRedirect: `${productConfig.websiteUrl}/odeme/iptal?plan=${plan.id}`,
  licenseRule: `${plan.name} plani aktif odeme veya deneme suresi boyunca kullanilabilir.`
}));

export const billingWebhookEvents = [
  {
    event: "checkout.completed",
    action: "Salon aboneligini active yap, plan_id guncelle, audit log yaz."
  },
  {
    event: "invoice.payment_failed",
    action: "subscription_status degerini past_due yap ve salon sahibine odeme uyarisi gonder."
  },
  {
    event: "subscription.canceled",
    action: "Lisans durumunu canceled yap, yalnizca veri disari aktarma ve destek erisimini acik birak."
  }
];

export const licenseAccessRules: Record<LicenseStatus, string> = {
  trialing: "Deneme suresi boyunca tum secili plan ozellikleri kullanilabilir.",
  active: "Odeme aktif oldugu surece plan limitleri dahilinde tam erisim vardir.",
  past_due: "Odeme basarisizsa kullanici uyarilir; kisa ek sure sonunda yeni islem kisitlanir.",
  canceled: "Abonelik iptal edilirse yeni veri girisi kapanir, hesap silme ve destek erisimi acik kalir."
};

