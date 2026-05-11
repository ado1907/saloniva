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
import type { BackendGateway, SalonDataSnapshot } from "./backendGateway";
import { supabaseConfig } from "./supabaseConfig";
import { supabaseRestClient } from "./supabaseRestClient";

type CloudGatewayOptions = {
  salonId: string;
  accessToken?: string;
};

type CloudRow = Record<string, unknown>;

const emptySnapshot: SalonDataSnapshot = {
  appointments: [],
  customers: [],
  packages: [],
  payments: [],
  salonServices: [],
  staffMembers: [],
  bookingRequests: [],
  inventoryItems: []
};

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function asNumber(value: unknown, fallback = 0) {
  return typeof value === "number" ? value : fallback;
}

function asBoolean(value: unknown, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

function asStringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function mapCustomer(row: CloudRow): Customer {
  return {
    id: asString(row.id),
    name: asString(row.name),
    phone: asString(row.phone),
    lastVisit: asString(row.last_visit, "Henüz yok"),
    totalSpent: asNumber(row.total_spent),
    debt: asNumber(row.debt),
    packageLabel: asString(row.package_label, "Aktif paket yok"),
    note: asString(row.note)
  };
}

function mapAppointment(row: CloudRow): Appointment {
  return {
    id: asString(row.id),
    time: asString(row.starts_at),
    end: asString(row.ends_at),
    customer: asString(row.customer_name),
    phone: asString(row.phone),
    service: asString(row.service_name),
    staff: asString(row.staff_name),
    price: asNumber(row.price),
    status: asString(row.status, "Planlandı") as Appointment["status"]
  };
}

function mapPackage(row: CloudRow): ServicePackage {
  return {
    id: asString(row.id),
    customer: asString(row.customer_name),
    title: asString(row.title),
    totalSessions: asNumber(row.total_sessions),
    usedSessions: asNumber(row.used_sessions),
    totalPrice: asNumber(row.total_price),
    paid: asNumber(row.paid)
  };
}

function mapPayment(row: CloudRow): Payment {
  return {
    id: asString(row.id),
    customer: asString(row.customer_name),
    service: asString(row.service_name),
    date: asString(row.paid_at),
    amount: asNumber(row.amount),
    method: asString(row.method, "Diğer") as Payment["method"],
    status: asString(row.status, "Bekliyor") as Payment["status"],
    remaining: asNumber(row.remaining)
  };
}

function mapService(row: CloudRow): SalonService {
  return {
    id: asString(row.id),
    name: asString(row.name),
    category: asString(row.category),
    durationMinutes: asNumber(row.duration_minutes, 60),
    price: asNumber(row.price),
    active: asBoolean(row.active, true),
    staff: asStringArray(row.staff)
  };
}

function mapStaff(row: CloudRow): StaffMember {
  return {
    id: asString(row.id),
    name: asString(row.name),
    role: asString(row.role),
    phone: asString(row.phone),
    active: asBoolean(row.active, true),
    services: asStringArray(row.services),
    appointmentsToday: asNumber(row.appointments_today),
    monthlyRevenue: asNumber(row.monthly_revenue),
    nextAppointment: asString(row.next_appointment, "Planlanmadı")
  };
}

function mapInventory(row: CloudRow): InventoryItem {
  return {
    id: asString(row.id),
    name: asString(row.name),
    category: asString(row.category),
    quantity: asNumber(row.quantity),
    unit: asString(row.unit),
    minQuantity: asNumber(row.min_quantity),
    cost: asNumber(row.cost),
    supplier: asString(row.supplier)
  };
}

function mapBookingRequest(row: CloudRow): BookingRequest {
  return {
    id: asString(row.id),
    customer: asString(row.customer_name),
    phone: asString(row.phone),
    service: asString(row.service_name),
    preferredTime: asString(row.preferred_time),
    note: asString(row.note),
    status: asString(row.status, "Onay Bekliyor") as BookingRequest["status"]
  };
}

export function createCloudSalonGateway(options: CloudGatewayOptions): BackendGateway {
  return {
    mode: "cloud-ready",
    async loadSalonData() {
      if (!supabaseConfig.configured) {
        return emptySnapshot;
      }

      const requestOptions = { accessToken: options.accessToken, order: "created_at.desc" };
      const [
        appointments,
        customers,
        packages,
        payments,
        salonServices,
        staffMembers,
        bookingRequests,
        inventoryItems
      ] = await Promise.all([
        supabaseRestClient.list<CloudRow>("appointments", requestOptions),
        supabaseRestClient.list<CloudRow>("customers", requestOptions),
        supabaseRestClient.list<CloudRow>("service_packages", requestOptions),
        supabaseRestClient.list<CloudRow>("payments", requestOptions),
        supabaseRestClient.list<CloudRow>("salon_services", requestOptions),
        supabaseRestClient.list<CloudRow>("staff_members", requestOptions),
        supabaseRestClient.list<CloudRow>("booking_requests", requestOptions),
        supabaseRestClient.list<CloudRow>("inventory_items", requestOptions)
      ]);

      return {
        appointments: appointments.map(mapAppointment),
        customers: customers.map(mapCustomer),
        packages: packages.map(mapPackage),
        payments: payments.map(mapPayment),
        salonServices: salonServices.map(mapService),
        staffMembers: staffMembers.map(mapStaff),
        bookingRequests: bookingRequests.map(mapBookingRequest),
        inventoryItems: inventoryItems.map(mapInventory)
      };
    },
    async saveSalonData() {
      throw new Error(
        "Cloud save henüz toplu senkronizasyon için açılmadı. Canlı geçişte her form kendi güvenli insert/update isteğini kullanmalı."
      );
    }
  };
}

export const cloudBackendMilestones = [
  {
    title: "Bağlantı",
    status: "Hazır",
    description: ".env ile Supabase URL ve anon key okunur; gizli anahtar GitHub'a girmez."
  },
  {
    title: "Veri modeli",
    status: "Hazır",
    description: "Salon, kullanıcı, müşteri, randevu, ödeme ve audit tabloları supabase/schema.sql içinde hazır."
  },
  {
    title: "Salon ayrımı",
    status: "Hazır",
    description: "Tüm operasyon tabloları salon_id taşır ve RLS politikaları salon üyeliğini kontrol eder."
  },
  {
    title: "Uygulama bağlantısı",
    status: "Sırada",
    description: "Demo-local mod korunur; Supabase modu gerçek proje anahtarları girilince açılır."
  },
  {
    title: "Canlı yazma",
    status: "Sırada",
    description: "Randevu, müşteri, ödeme ve paket formları tek tek güvenli cloud insert/update akışına bağlanır."
  }
];
