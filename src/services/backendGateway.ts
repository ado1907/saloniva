import type {
  Appointment,
  BookingRequest,
  Customer,
  InventoryItem,
  Payment,
  SalonService,
  ServicePackage,
  StaffMember
} from "../types";

export type SalonDataSnapshot = {
  appointments: Appointment[];
  customers: Customer[];
  packages: ServicePackage[];
  payments: Payment[];
  salonServices: SalonService[];
  staffMembers: StaffMember[];
  bookingRequests: BookingRequest[];
  inventoryItems: InventoryItem[];
};

export type BackendMode = "demo-local" | "cloud-ready";

export type BackendGateway = {
  mode: BackendMode;
  loadSalonData: () => Promise<SalonDataSnapshot | null>;
  saveSalonData: (snapshot: SalonDataSnapshot) => Promise<void>;
  createAppointment?: (appointment: Appointment) => Promise<Appointment>;
  createCustomer?: (customer: Customer) => Promise<Customer>;
  updateCustomer?: (customerId: string, customer: Partial<Customer>) => Promise<Customer>;
  createPackage?: (servicePackage: ServicePackage) => Promise<ServicePackage>;
  createPayment?: (payment: Payment) => Promise<Payment>;
};

export const backendGatewayPlan = [
  "demo-local modu mevcut AsyncStorage yapısını korur.",
  "cloud-ready modu geldiğinde aynı veri şekli Supabase, Firebase veya özel API'ye taşınır.",
  "Salon tenant id, kullanıcı rolü ve abonelik durumu sunucu tarafında doğrulanır.",
  "Ödeme ve müşteri verileri için audit log ve veri silme süreci eklenir."
];

export function createDemoBackendGateway(
  loadSalonData: () => Promise<SalonDataSnapshot | null>,
  saveSalonData: (snapshot: SalonDataSnapshot) => Promise<void>
): BackendGateway {
  return {
    mode: "demo-local",
    loadSalonData,
    saveSalonData
  };
}
