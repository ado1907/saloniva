export type CloudTablePlan = {
  table: string;
  purpose: string;
  tenantRule: string;
  sensitive: boolean;
};

export const cloudDatabaseTables: CloudTablePlan[] = [
  {
    table: "salons",
    purpose: "Salon profili, abonelik planı ve hesap durumu.",
    tenantRule: "Her salon benzersiz salonId ile ayrılır.",
    sensitive: true
  },
  {
    table: "users",
    purpose: "Kullanıcı, rol, e-posta ve salon bağlantısı.",
    tenantRule: "Kullanıcı sadece bağlı olduğu salonlara erişir.",
    sensitive: true
  },
  {
    table: "appointments",
    purpose: "Randevu saati, hizmet, personel, müşteri ve durum.",
    tenantRule: "Okuma/yazma işlemleri salonId filtresi olmadan çalışmaz.",
    sensitive: false
  },
  {
    table: "customers",
    purpose: "Müşteri adı, telefon, not, borç ve ziyaret geçmişi.",
    tenantRule: "Müşteri verisi salon dışına açılmaz; dışa aktarma loglanır.",
    sensitive: true
  },
  {
    table: "payments",
    purpose: "Tahsilat, kalan bakiye, ödeme yöntemi ve paket ödemesi.",
    tenantRule: "Personel rolünde sınırlı görünür; audit log zorunludur.",
    sensitive: true
  },
  {
    table: "subscriptions",
    purpose: "Plan, deneme bitişi, ödeme durumu ve lisans kontrolü.",
    tenantRule: "Sadece Salon Sahibi ve billing servisi erişir.",
    sensitive: true
  },
  {
    table: "audit_logs",
    purpose: "Ödeme, hesap silme, rol değişimi ve veri dışa aktarma kayıtları.",
    tenantRule: "Loglar salonId ve kullanıcıId ile saklanır.",
    sensitive: true
  }
];

export const tenantIsolationRules = [
  "Tüm veriler salonId ile saklanır.",
  "API, salonId değerini istemciye güvenerek değil oturumdan doğrular.",
  "Salon Sahibi dışındaki roller abonelik, hesap silme ve kritik güvenlik ayarlarına erişemez.",
  "Public randevu talebi salon slug ile gelir, gerçek salonId backend tarafından çözülür.",
  "Audit log silinemez; sadece yetkili sistem rolü tarafından okunur."
];

