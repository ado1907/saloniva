export type TabKey =
  | "panel"
  | "calendar"
  | "customers"
  | "packages"
  | "payments"
  | "services"
  | "staff"
  | "reports"
  | "settings"
  | "booking"
  | "campaigns"
  | "inventory"
  | "branches"
  | "clientApp"
  | "quality"
  | "launch"
  | "billing"
  | "showcase"
  | "opportunities"
  | "onboarding"
  | "agents"
  | "security"
  | "production"
  | "pilot"
  | "more";

export type Branch = {
  id: string;
  name: string;
  address: string;
  manager: string;
  appointmentsToday: number;
  monthlyRevenue: number;
  staffCount: number;
  status: "Aktif" | "Kurulumda";
};

export type InventoryItem = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minQuantity: number;
  cost: number;
  supplier: string;
};

export type WorkingDay = {
  day: string;
  hours: string;
  open: boolean;
};

export type UserRole = "Salon Sahibi" | "Yönetici" | "Personel";

export type SubscriptionPlanId = "starter" | "pro" | "premium";
export type SubscriptionStatus = "Deneme" | "Aktif" | "Ödeme Bekliyor" | "Askıda";

export type SalonAccount = {
  salonId: string;
  salonName: string;
  ownerName: string;
  email: string;
  role: UserRole;
  planId: SubscriptionPlanId;
  subscriptionStatus: SubscriptionStatus;
  trialEndsAt: string;
  permissions: string[];
};

export type AppointmentStatus = "Planlandı" | "Geldi" | "Tamamlandı" | "Gelmedi" | "İptal";

export type Appointment = {
  id: string;
  time: string;
  end: string;
  customer: string;
  phone: string;
  service: string;
  staff: string;
  price: number;
  status: AppointmentStatus;
};

export type Customer = {
  id: string;
  name: string;
  phone: string;
  lastVisit: string;
  totalSpent: number;
  debt: number;
  packageLabel: string;
  note: string;
  notes?: CustomerNote[];
};

export type CustomerNote = {
  id: string;
  text: string;
  date: string;
};

export type ServicePackage = {
  id: string;
  customer: string;
  title: string;
  totalSessions: number;
  usedSessions: number;
  totalPrice: number;
  paid: number;
};

export type PaymentStatus = "Ödendi" | "Kısmi Ödendi" | "Bekliyor" | "İade";

export type PaymentMethod = "Nakit" | "Kart" | "Havale" | "Diğer";

export type Payment = {
  id: string;
  customer: string;
  service: string;
  date: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  remaining: number;
};

export type SalonService = {
  id: string;
  name: string;
  category: string;
  durationMinutes: number;
  price: number;
  active: boolean;
  staff: string[];
};

export type StaffMember = {
  id: string;
  name: string;
  role: string;
  phone: string;
  active: boolean;
  services: string[];
  appointmentsToday: number;
  monthlyRevenue: number;
  nextAppointment: string;
};

export type BookingRequest = {
  id: string;
  customer: string;
  phone: string;
  service: string;
  preferredTime: string;
  note: string;
  status: "Onay Bekliyor" | "Onaylandı" | "Reddedildi";
};

export type PopularService = {
  name: string;
  count: number;
  revenue: number;
};

export type StaffPerformance = {
  name: string;
  count: number;
  revenue: number;
};
