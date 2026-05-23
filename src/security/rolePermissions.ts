import type { TabKey, UserRole } from "../types";

export type PermissionCode =
  | "randevu"
  | "musteri"
  | "paket"
  | "odeme"
  | "rapor"
  | "ayar"
  | "personel"
  | "stok"
  | "sube"
  | "vitrin"
  | "abonelik";

export type RolePermissionProfile = {
  role: UserRole;
  description: string;
  permissions: PermissionCode[];
  restrictedAreas: string[];
  defaultTabs: TabKey[];
};

export type DataSecurityItem = {
  title: string;
  description: string;
  sensitivity: "Yüksek" | "Orta" | "eüşük";
  productionRule: string;
};

export const rolePermissionProfiles: RolePermissionProfile[] = [
  {
    role: "Salon Sahibi",
    description: "Tüm salon verisini, aboneliği, personeli, raporları ve ayarları yönetir.",
    permissions: ["randevu", "musteri", "paket", "odeme", "rapor", "ayar", "personel", "stok", "sube", "vitrin", "abonelik"],
    restrictedAreas: ["Yok"],
    defaultTabs: ["panel", "calendar", "customers", "packages", "payments", "reports", "settings", "billing", "launch"]
  },
  {
    role: "Yönetici",
    description: "Günlük operasyon, müşteri, paket, ödeme, personel ve rapor akışını yönetir.",
    permissions: ["randevu", "musteri", "paket", "odeme", "rapor", "personel", "stok", "vitrin"],
    restrictedAreas: ["Abonelik planı", "Hesap silme", "Ana güvenlik ayarları"],
    defaultTabs: ["panel", "calendar", "customers", "packages", "payments", "reports", "staff"]
  },
  {
    role: "Personel",
    description: "Kendi randevularını, müşteri notlarını ve seans işlemlerini görür.",
    permissions: ["randevu", "musteri", "paket"],
    restrictedAreas: ["Ödemeler", "Raporlar", "Ayarlar", "Abonelik", "Personel yönetimi", "Çok şube"],
    defaultTabs: ["panel", "calendar", "customers", "packages"]
  }
];

export const tabPermissionMap: Partial<Record<TabKey, PermissionCode>> = {
  calendar: "randevu",
  customers: "musteri",
  packages: "paket",
  payments: "odeme",
  reports: "rapor",
  settings: "ayar",
  staff: "personel",
  inventory: "stok",
  branches: "sube",
  showcase: "vitrin",
  billing: "abonelik"
};

export const sensitiveDataCatalog: DataSecurityItem[] = [
  {
    title: "Müşteri kimlik ve iletişim verisi",
    description: "Ad, telefon, notlar, tercih edilen hizmet ve ziyaret geçmişi.",
    sensitivity: "Yüksek",
    productionRule: "Sadece ilgili salon tenant içinde okunmalı; dışa aktarma ve silme kayıt altına alınmalı."
  },
  {
    title: "Ödeme ve borç bilgisi",
    description: "Tahsilat, kalan borç, ödeme yöntemi ve paket ödenen tutarı.",
    sensitivity: "Yüksek",
    productionRule: "Personel rolü varsayılan olarak ödeme toplamlarını görmemeli; sunucu tarafında yetki doğrulanmalı."
  },
  {
    title: "Randevu ve personel takvimi",
    description: "Saat, hizmet, personel, müşteri ve randevu durumu.",
    sensitivity: "Orta",
    productionRule: "Personel sadece kendi randevularını yönetmeli; yönetici tüm günlük operasyonu görebilmeli."
  },
  {
    title: "Salon abonelik ve lisans verisi",
    description: "Aktif plan, deneme bitişi, ödeme durumu ve plan limitleri.",
    sensitivity: "Yüksek",
    productionRule: "Sadece Salon Sahibi ve sistem yöneticisi erişmeli; lisans kontrolü backend üzerinden yapılmalı."
  }
];

export const securityReadinessChecklist = [
  "Her APn isteğinde salonnd sunucuda doğrulanmalı.",
  "Rol yetkileri sadece uygulama içinde değil backend tarafında da kontrol edilmeli.",
  "Hesap silme ve veri dışa aktarma işlemleri kayıt altına alınmalı.",
  "Müşteri notları ve ödeme verileri hassas veri olarak sınıflandırılmalı.",
  "Inceleme hesabi gercek musteri verisi tasimamali."
];

export function getRoleProfile(role: UserRole) {
  return rolePermissionProfiles.find((profile) => profile.role === role) ?? rolePermissionProfiles[0];
}

export function canRoleAccessTab(role: UserRole, tab: TabKey) {
  if (tab === "panel" || tab === "more") {
    return true;
  }

  const requiredPermission = tabPermissionMap[tab];
  if (!requiredPermission) {
    return role === "Salon Sahibi";
  }

  return getRoleProfile(role).permissions.includes(requiredPermission);
}
