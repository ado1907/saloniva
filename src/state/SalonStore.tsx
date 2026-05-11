import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from "react";
import {
  appointments as initialAppointments,
  customers as initialCustomers,
  inventoryItems as initialInventoryItems,
  packages as initialPackages,
  payments as initialPayments,
  salonServices as initialSalonServices,
  staffMembers as initialStaffMembers
} from "../data/demoData";
import { createDemoBackendGateway } from "../services/backendGateway";
import type { Appointment, AppointmentStatus, BookingRequest, Customer, InventoryItem, Payment, SalonService, ServicePackage, StaffMember } from "../types";
import { clearSalonState, loadSalonState, saveSalonState } from "./storage";

type SalonStore = {
  appointments: Appointment[];
  customers: Customer[];
  packages: ServicePackage[];
  payments: Payment[];
  salonServices: SalonService[];
  staffMembers: StaffMember[];
  bookingRequests: BookingRequest[];
  inventoryItems: InventoryItem[];
  totals: {
    expectedRevenue: number;
    collected: number;
    debt: number;
    completedAppointments: number;
    missedAppointments: number;
  };
  notice: string | null;
  addAppointment: (appointment: Appointment) => void;
  addCustomer: (customer: Customer) => void;
  addCustomerNote: (customerId: string, text: string) => void;
  addPackage: (servicePackage: ServicePackage) => void;
  addPayment: (payment: Payment) => void;
  addPackagePayment: (packageTitle: string, customer: string, amount: number) => void;
  addSalonService: (service: SalonService) => void;
  toggleSalonService: (serviceId: string) => void;
  markAppointmentCompleted: (appointmentId: string) => void;
  updateAppointmentStatus: (appointmentId: string, status: AppointmentStatus) => void;
  usePackageSession: (packageId: string) => void;
  resetDemoData: () => void;
  clearNotice: () => void;
  addBookingRequest: (request: BookingRequest) => void;
  approveBookingRequest: (requestId: string) => void;
  rejectBookingRequest: (requestId: string) => void;
  adjustInventoryQuantity: (itemId: string, delta: number) => void;
  storageReady: boolean;
};

const SalonContext = createContext<SalonStore | null>(null);
const backendGateway = createDemoBackendGateway(loadSalonState, saveSalonState);

export function SalonStoreProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [customers, setCustomers] = useState(initialCustomers);
  const [packages, setPackages] = useState(initialPackages);
  const [payments, setPayments] = useState(initialPayments);
  const [salonServices, setSalonServices] = useState(initialSalonServices);
  const [staffMembers, setStaffMembers] = useState(initialStaffMembers);
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([]);
  const [inventoryItems, setInventoryItems] = useState(initialInventoryItems);
  const [storageReady, setStorageReady] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    backendGateway
      .loadSalonData()
      .then((storedState) => {
        if (!mounted || !storedState) {
          return;
        }

        setAppointments(storedState.appointments);
        setCustomers(storedState.customers);
        setPackages(storedState.packages);
        setPayments(storedState.payments);
        setSalonServices(storedState.salonServices);
        setStaffMembers(storedState.staffMembers);
        setBookingRequests(storedState.bookingRequests ?? []);
        setInventoryItems(
          storedState.inventoryItems && storedState.inventoryItems.length > 0
            ? storedState.inventoryItems
            : initialInventoryItems
        );
      })
      .finally(() => {
        if (mounted) {
          setStorageReady(true);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!storageReady) {
      return;
    }

    void backendGateway.saveSalonData({
      appointments,
      customers,
      packages,
      payments,
      salonServices,
      staffMembers,
      bookingRequests,
      inventoryItems
    });
  }, [appointments, bookingRequests, customers, inventoryItems, packages, payments, salonServices, staffMembers, storageReady]);

  const totals = useMemo(() => {
    const expectedRevenue = appointments.reduce((sum, item) => sum + item.price, 0);
    const collected = payments.reduce((sum, item) => sum + item.amount, 0);
    const debt = payments.reduce((sum, item) => sum + item.remaining, 0);
    const completedAppointments = appointments.filter((item) => item.status === "Tamamlandı").length;
    const missedAppointments = appointments.filter((item) => item.status === "Gelmedi" || item.status === "İptal").length;

    return {
      expectedRevenue,
      collected,
      debt,
      completedAppointments,
      missedAppointments
    };
  }, [appointments, payments]);

  const value = useMemo<SalonStore>(
    () => ({
      appointments,
      customers,
      packages,
      payments,
      salonServices,
      staffMembers,
      bookingRequests,
      inventoryItems,
      totals,
      notice,
      storageReady,
      addAppointment: (appointment) => {
        setAppointments((current) => [appointment, ...current]);
        setNotice("Randevu kaydedildi.");
      },
      addCustomer: (customer) => {
        setCustomers((current) => [customer, ...current]);
        setNotice("Müşteri kaydedildi.");
      },
      addCustomerNote: (customerId, text) => {
        setCustomers((current) =>
          current.map((customer) =>
            customer.id === customerId
              ? {
                  ...customer,
                  notes: [{ id: `note-${Date.now()}`, text, date: "Bugün" }, ...(customer.notes ?? [])]
                }
              : customer
          )
        );
        setNotice("Müşteri notu eklendi.");
      },
      addPackage: (servicePackage) => {
        setPackages((current) => [servicePackage, ...current]);
        setNotice("Paket müşteriye tanımlandı.");
      },
      addPayment: (payment) => {
        setPayments((current) => [payment, ...current]);
        setCustomers((current) =>
          current.map((customer) =>
            customer.name === payment.customer ? { ...customer, debt: payment.remaining } : customer
          )
        );
        setNotice("Ödeme kaydedildi ve müşteri borcu güncellendi.");
      },
      addPackagePayment: (packageTitle, customer, amount) => {
        setPackages((current) =>
          current.map((item) =>
            item.title === packageTitle && item.customer === customer
              ? { ...item, paid: Math.min(item.totalPrice, item.paid + amount) }
              : item
          )
        );
      },
      addSalonService: (service) => {
        setSalonServices((current) => [service, ...current]);
        setNotice("Hizmet fiyat listesine eklendi.");
      },
      toggleSalonService: (serviceId) => {
        setSalonServices((current) =>
          current.map((service) =>
            service.id === serviceId ? { ...service, active: !service.active } : service
          )
        );
        setNotice("Hizmet durumu güncellendi.");
      },
      markAppointmentCompleted: (appointmentId) => {
        setAppointments((current) =>
          current.map((appointment) =>
            appointment.id === appointmentId ? { ...appointment, status: "Tamamlandı" } : appointment
          )
        );
        setNotice("Randevu tamamlandı olarak işaretlendi.");
      },
      updateAppointmentStatus: (appointmentId, status) => {
        setAppointments((current) =>
          current.map((appointment) =>
            appointment.id === appointmentId ? { ...appointment, status } : appointment
          )
        );
        setNotice(`Randevu durumu "${status}" olarak güncellendi.`);
      },
      usePackageSession: (packageId) => {
        setPackages((current) =>
          current.map((item) =>
            item.id === packageId && item.usedSessions < item.totalSessions
              ? { ...item, usedSessions: item.usedSessions + 1 }
              : item
          )
        );
        setNotice("Paket seansı kullanıldı.");
      },
      resetDemoData: () => {
        setAppointments(initialAppointments);
        setCustomers(initialCustomers);
        setPackages(initialPackages);
        setPayments(initialPayments);
        setSalonServices(initialSalonServices);
        setStaffMembers(initialStaffMembers);
        setBookingRequests([]);
        setInventoryItems(initialInventoryItems);
        void clearSalonState();
        setNotice("Demo veriler sıfırlandı.");
      },
      clearNotice: () => {
        setNotice(null);
      },
      addBookingRequest: (request) => {
        setBookingRequests((current) => [request, ...current]);
        setNotice("Online randevu talebi oluşturuldu.");
      },
      approveBookingRequest: (requestId) => {
        const request = bookingRequests.find((item) => item.id === requestId);

        if (!request) {
          return;
        }

        setAppointments((current) => [
          {
            id: `a-${Date.now()}`,
            time: request.preferredTime,
            end: addMinutesToTime(request.preferredTime, 60),
            customer: request.customer,
            phone: request.phone,
            service: request.service,
            staff: "Atanmadı",
            price: 0,
            status: "Planlandı"
          },
          ...current
        ]);
        setBookingRequests((current) =>
          current.map((item) => (item.id === requestId ? { ...item, status: "Onaylandı" } : item))
        );
        setNotice("Online talep randevuya dönüştürüldü.");
      },
      rejectBookingRequest: (requestId) => {
        setBookingRequests((current) =>
          current.map((item) => (item.id === requestId ? { ...item, status: "Reddedildi" } : item))
        );
        setNotice("Online randevu talebi reddedildi.");
      },
      adjustInventoryQuantity: (itemId, delta) => {
        setInventoryItems((current) =>
          current.map((item) =>
            item.id === itemId ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
          )
        );
        setNotice(delta > 0 ? "Stok miktarı artırıldı." : "Stok kullanımı kaydedildi.");
      }
    }),
    [appointments, bookingRequests, customers, inventoryItems, notice, packages, payments, salonServices, staffMembers, storageReady, totals]
  );

  return <SalonContext.Provider value={value}>{children}</SalonContext.Provider>;
}

export function useSalonStore() {
  const store = useContext(SalonContext);

  if (!store) {
    throw new Error("useSalonStore must be used inside SalonStoreProvider");
  }

  return store;
}

function addMinutesToTime(value: string, minutes: number) {
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) {
    return "10:00";
  }

  const [hour, minute] = value.split(":").map(Number);
  const date = new Date(2026, 4, 9, hour, minute + minutes);
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}
