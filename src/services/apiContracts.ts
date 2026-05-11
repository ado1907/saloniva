import type { Ionicons } from "@expo/vector-icons";

export type ApiArea = "auth" | "salon" | "operations" | "billing" | "public";
export type ApiMethod = "GET" | "POST" | "PATCH" | "DELETE";
export type ApiProtection = "public" | "authenticated" | "owner" | "staff" | "billing";

export type ApiContract = {
  area: ApiArea;
  method: ApiMethod;
  path: string;
  title: string;
  description: string;
  protection: ApiProtection;
  icon: keyof typeof Ionicons.glyphMap;
};

export const apiContracts: ApiContract[] = [
  {
    area: "auth",
    method: "POST",
    path: "/auth/login",
    title: "Giriş",
    description: "E-posta/şifre ile kullanıcı oturumu başlatır ve salon bağlamını döndürür.",
    protection: "public",
    icon: "log-in-outline"
  },
  {
    area: "auth",
    method: "POST",
    path: "/auth/register-salon",
    title: "Salon hesabı oluştur",
    description: "Yeni salon tenant, sahip kullanıcı ve deneme aboneliğini başlatır.",
    protection: "public",
    icon: "business-outline"
  },
  {
    area: "salon",
    method: "GET",
    path: "/salons/:salonId/snapshot",
    title: "Salon veri özeti",
    description: "Panel için randevu, müşteri, paket, ödeme, personel ve stok verisini tek snapshot olarak döndürür.",
    protection: "authenticated",
    icon: "albums-outline"
  },
  {
    area: "operations",
    method: "POST",
    path: "/salons/:salonId/appointments",
    title: "Randevu oluştur",
    description: "Takvim veya onaylanan online talepten yeni randevu oluşturur.",
    protection: "staff",
    icon: "calendar-outline"
  },
  {
    area: "operations",
    method: "POST",
    path: "/salons/:salonId/customers",
    title: "Müşteri oluştur",
    description: "Müşteri kartı, telefon, not ve paket başlangıç bilgilerini oluşturur.",
    protection: "staff",
    icon: "person-add-outline"
  },
  {
    area: "operations",
    method: "POST",
    path: "/salons/:salonId/payments",
    title: "Ödeme kaydet",
    description: "Tahsilat, kalan bakiye ve ödeme yöntemini audit log ile kaydeder.",
    protection: "staff",
    icon: "cash-outline"
  },
  {
    area: "public",
    method: "POST",
    path: "/public/salons/:slug/booking-requests",
    title: "Online talep oluştur",
    description: "Salon vitrini veya randevu linkinden gelen müşteri talebini oluşturur.",
    protection: "public",
    icon: "send-outline"
  },
  {
    area: "billing",
    method: "GET",
    path: "/salons/:salonId/subscription",
    title: "Abonelik durumu",
    description: "Plan, deneme bitişi, ödeme durumu ve lisans bilgisini döndürür.",
    protection: "billing",
    icon: "card-outline"
  },
  {
    area: "billing",
    method: "POST",
    path: "/salons/:salonId/subscription/checkout",
    title: "Ödeme başlat",
    description: "Seçilen plan için web veya mağaza uyumlu ödeme akışını başlatır.",
    protection: "owner",
    icon: "wallet-outline"
  },
  {
    area: "salon",
    method: "DELETE",
    path: "/salons/:salonId/account",
    title: "Hesap silme talebi",
    description: "Salon verisi silme talebini güvenli onay ve bekleme süreciyle başlatır.",
    protection: "owner",
    icon: "trash-outline"
  }
];

export const apiReadinessChecklist = [
  "Her endpoint salon tenant kontrolü yapmalı.",
  "Müşteri telefonu, ödeme ve not alanları hassas veri kabul edilmeli.",
  "Yazma işlemleri audit log üretmeli.",
  "Public booking endpoint rate limit ve spam koruması almalı.",
  "Billing endpointleri sadece salon sahibi veya lisans yetkisiyle çalışmalı."
];
