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
import { createDemoBackendGateway, type BackendGateway, type SalonDataSnapshot } from "../services/backendGateway";
import { createCloudSalonGateway } from "../services/cloudSalonGateway";
import type { AuthSession } from "../services/authGateway";
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

export function SalonStoreProvider({ children, session }: { children: ReactNode; session: AuthSession | null }) {
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
  const backendGateway = useMemo(() => {
    const isCloudSession = Boolean(session?.accessToken && session.accessToken !== "demo-access-token");

    if (isCloudSession && session) {
      return createCloudSalonGateway({
        salonId: session.account.salonId,
        accessToken: session.accessToken
      });
    }

    return createDemoBackendGateway(loadSalonState, saveSalonState);
  }, [session]);

  useEffect(() => {
    let mounted = true;

    setStorageReady(false);

    if (backendGateway.mode === "cloud-ready") {
      setAppointments([]);
      setCustomers([]);
      setPackages([]);
      setPayments([]);
      setSalonServices([]);
      setStaffMembers([]);
      setBookingRequests([]);
      setInventoryItems([]);
    }

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
      .catch((error) => {
        if (mounted) {
          setNotice(`Salon verileri yüklenemedi: ${getErrorMessage(error)}`);
        }
      })
      .finally(() => {
        if (mounted) {
          setStorageReady(true);
        }
      });

    return () => {
      mounted = false;
    };
  }, [backendGateway]);

  useEffect(() => {
    if (!storageReady) {
      return;
    }

    if (backendGateway.mode === "cloud-ready") {
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
  }, [appointments, backendGateway, bookingRequests, customers, inventoryItems, packages, payments, salonServices, staffMembers, storageReady]);

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
        if (backendGateway.createAppointment) {
          void backendGateway
            .createAppointment(appointment)
            .then((savedAppointment) => {
              setAppointments((current) =>
                current.map((item) => (item.id === appointment.id ? savedAppointment : item))
              );
              setNotice("Randevu buluta kaydedildi.");
            })
            .catch((error) => setNotice(`Randevu buluta kaydedilemedi: ${getErrorMessage(error)}`));
        }
      },
      addCustomer: (customer) => {
        setCustomers((current) => [customer, ...current]);
        setNotice("Müşteri kaydedildi.");
        if (backendGateway.createCustomer) {
          void backendGateway
            .createCustomer(customer)
            .then((savedCustomer) => {
              setCustomers((current) => current.map((item) => (item.id === customer.id ? savedCustomer : item)));
              setNotice("Müşteri buluta kaydedildi.");
            })
            .catch((error) => setNotice(`Müşteri buluta kaydedilemedi: ${getErrorMessage(error)}`));
        }
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
        if (backendGateway.createPackage) {
          void backendGateway
            .createPackage(servicePackage)
            .then((savedPackage) => {
              setPackages((current) =>
                current.map((item) => (item.id === servicePackage.id ? savedPackage : item))
              );
              setNotice("Paket buluta kaydedildi.");
            })
            .catch((error) => setNotice(`Paket buluta kaydedilemedi: ${getErrorMessage(error)}`));
        }
      },
      addPayment: (payment) => {
        const matchedCustomer = customers.find((customer) => customer.name === payment.customer);
        setPayments((current) => [payment, ...current]);
        setCustomers((current) =>
          current.map((customer) =>
            customer.name === payment.customer ? { ...customer, debt: payment.remaining } : customer
          )
        );
        setNotice("Ödeme kaydedildi ve müşteri borcu güncellendi.");
        if (backendGateway.createPayment) {
          void backendGateway
            .createPayment(payment)
            .then((savedPayment) => {
              setPayments((current) => current.map((item) => (item.id === payment.id ? savedPayment : item)));
              setNotice("Ödeme buluta kaydedildi.");
            })
            .catch((error) => setNotice(`Ödeme buluta kaydedilemedi: ${getErrorMessage(error)}`));
        }
        if (matchedCustomer && backendGateway.updateCustomer) {
          void backendGateway
            .updateCustomer(matchedCustomer.id, { ...matchedCustomer, debt: payment.remaining })
            .then((savedCustomer) => {
              setCustomers((current) =>
                current.map((customer) => (customer.id === matchedCustomer.id ? savedCustomer : customer))
              );
            })
            .catch((error) => setNotice(`Müşteri borcu bulutta güncellenemedi: ${getErrorMessage(error)}`));
        }
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
        if (backendGateway.mode === "cloud-ready") {
          if (customers.length > 0 || appointments.length > 0 || packages.length > 0 || payments.length > 0) {
            setNotice("Bu bulut salonunda veri var. Mevcut demo hesabını korumak için otomatik yükleme yapılmadı.");
            return;
          }

          setNotice("Profesyonel demo verileri Supabase'e yükleniyor...");
          void seedCloudDemoData(backendGateway)
            .then((snapshot) => {
              setAppointments(snapshot.appointments);
              setCustomers(snapshot.customers);
              setPackages(snapshot.packages);
              setPayments(snapshot.payments);
              setSalonServices(snapshot.salonServices);
              setStaffMembers(snapshot.staffMembers);
              setBookingRequests(snapshot.bookingRequests);
              setInventoryItems(snapshot.inventoryItems);
              setNotice("Demo hesabı müşteri, randevu, ödeme ve stok verileriyle hazırlandı.");
            })
            .catch((error) => {
              setNotice(`Demo veriler buluta yüklenemedi: ${getErrorMessage(error)}`);
            });
          return;
        }

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
    [appointments, backendGateway, bookingRequests, customers, inventoryItems, notice, packages, payments, salonServices, staffMembers, storageReady, totals]
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

async function seedCloudDemoData(backendGateway: BackendGateway): Promise<SalonDataSnapshot> {
  const customers = backendGateway.createCustomer
    ? await Promise.all(initialCustomers.map((customer) => backendGateway.createCustomer?.(customer) ?? customer))
    : initialCustomers;

  const salonServices = backendGateway.createSalonService
    ? await Promise.all(initialSalonServices.map((service) => backendGateway.createSalonService?.(service) ?? service))
    : initialSalonServices;

  const staffMembers = backendGateway.createStaffMember
    ? await Promise.all(initialStaffMembers.map((staffMember) => backendGateway.createStaffMember?.(staffMember) ?? staffMember))
    : initialStaffMembers;

  const inventoryItems = backendGateway.createInventoryItem
    ? await Promise.all(initialInventoryItems.map((item) => backendGateway.createInventoryItem?.(item) ?? item))
    : initialInventoryItems;

  const packages = backendGateway.createPackage
    ? await Promise.all(initialPackages.map((servicePackage) => backendGateway.createPackage?.(servicePackage) ?? servicePackage))
    : initialPackages;

  const payments = backendGateway.createPayment
    ? await Promise.all(initialPayments.map((payment) => backendGateway.createPayment?.(payment) ?? payment))
    : initialPayments;

  const appointments = backendGateway.createAppointment
    ? await Promise.all(initialAppointments.map((appointment) => backendGateway.createAppointment?.(appointment) ?? appointment))
    : initialAppointments;

  return {
    appointments,
    customers,
    packages,
    payments,
    salonServices,
    staffMembers,
    bookingRequests: [],
    inventoryItems
  };
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Bilinmeyen hata";
}

function addMinutesToTime(value: string, minutes: number) {
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) {
    return "10:00";
  }

  const [hour, minute] = value.split(":").map(Number);
  const date = new Date(2026, 4, 9, hour, minute + minutes);
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}
