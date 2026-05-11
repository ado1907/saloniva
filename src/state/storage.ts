import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Appointment, BookingRequest, Customer, InventoryItem, Payment, SalonService, ServicePackage, StaffMember } from "../types";

export type PersistedSalonState = {
  appointments: Appointment[];
  customers: Customer[];
  packages: ServicePackage[];
  payments: Payment[];
  salonServices: SalonService[];
  staffMembers: StaffMember[];
  bookingRequests?: BookingRequest[];
  inventoryItems?: InventoryItem[];
};

const STORAGE_KEY = "saloniva.store.v1";

export async function loadSalonState() {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as PersistedSalonState;

    return {
      appointments: parsed.appointments ?? [],
      customers: parsed.customers ?? [],
      packages: parsed.packages ?? [],
      payments: parsed.payments ?? [],
      salonServices: parsed.salonServices ?? [],
      staffMembers: parsed.staffMembers ?? [],
      bookingRequests: parsed.bookingRequests ?? [],
      inventoryItems: parsed.inventoryItems ?? []
    };
  } catch {
    await clearSalonState();
    return null;
  }
}

export async function saveSalonState(state: PersistedSalonState) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export async function clearSalonState() {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
