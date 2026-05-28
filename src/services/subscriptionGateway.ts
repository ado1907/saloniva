import { productConfig } from "../config/productConfig";
import { supabaseRestClient } from "./supabaseRestClient";

export type BillingProvider = "iyzico-ready" | "stripe-ready" | "app-store-ready" | "google-play-ready";
export type LicenseStatus = "trialing" | "active" | "past_due" | "canceled";
export type SaasPlanId = "free" | "pro" | "business";

export type SalonSubscriptionStatus = {
  salon_id: string;
  plan_id: SaasPlanId;
  plan_name: string;
  status: "trialing" | "active" | "past_due" | "canceled" | "expired";
  provider: "manual" | "iyzico" | "stripe" | "app_store" | "google_play";
  is_active: boolean;
  is_in_trial: boolean;
  is_in_grace: boolean;
  can_create_records: boolean;
  trial_ends_at: string | null;
  current_period_end: string | null;
  grace_until: string | null;
  admin_override_until: string | null;
  staff_limit: number;
  customer_limit: number;
  monthly_appointment_limit: number;
  branch_limit: number;
  monthly_booking_request_limit: number;
  current_staff_count: number;
  current_customer_count: number;
  current_month_appointment_count: number;
  current_month_booking_request_count: number;
};

export type PlanLimitCheck = {
  checked_limit: "staff" | "customers" | "appointments_monthly" | "branches" | "booking_requests_monthly";
  allowed: boolean;
  current_usage: number;
  plan_limit: number;
  status: SalonSubscriptionStatus["status"];
  reason: "subscription_inactive" | "unlimited" | "within_limit" | "limit_exceeded";
};

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

export async function getSalonSubscriptionStatus(salonId: string, accessToken?: string) {
  const rows = await supabaseRestClient.rpc<SalonSubscriptionStatus[]>(
    "get_salon_subscription_status",
    { target_salon_id: salonId },
    { accessToken }
  );

  return rows[0] ?? null;
}

export async function checkSalonPlanLimit(
  salonId: string,
  limitKey: PlanLimitCheck["checked_limit"],
  accessToken?: string,
  requestedIncrement = 1
) {
  const rows = await supabaseRestClient.rpc<PlanLimitCheck[]>(
    "check_plan_limit",
    {
      target_salon_id: salonId,
      limit_key: limitKey,
      requested_increment: requestedIncrement
    },
    { accessToken }
  );

  return rows[0] ?? null;
}
