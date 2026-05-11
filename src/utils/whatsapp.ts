import { Linking } from "react-native";
import type { Appointment } from "../types";

const normalizePhone = (phone: string) => {
  const digits = phone.replace(/\D/g, "");

  if (digits.startsWith("90")) {
    return digits;
  }

  if (digits.startsWith("0")) {
    return `9${digits}`;
  }

  return digits || "905320000000";
};

export const openWhatsAppMessage = (phone: string, message: string) => {
  void Linking.openURL(`https://wa.me/${normalizePhone(phone)}?text=${encodeURIComponent(message)}`);
};

export const sendAppointmentReminder = (appointment: Appointment) => {
  const message = `Merhaba ${appointment.customer}, ${appointment.time} saatindeki ${appointment.service} randevunuzu hatırlatmak isteriz. Görüşmek üzere.`;
  openWhatsAppMessage(appointment.phone, message);
};

export const sendPaymentReminder = (phone: string, customer: string, amount: string) => {
  const message = `Merhaba ${customer}, Saloniva kaydınızda ${amount} bekleyen ödeme görünmektedir. Uygun olduğunuzda bizimle iletişime geçebilirsiniz.`;
  openWhatsAppMessage(phone, message);
};

export const sendPackageReminder = (
  phone: string,
  customer: string,
  packageName: string,
  remainingSessions: number
) => {
  const message = `Merhaba ${customer}, ${packageName} paketinizde ${remainingSessions} seansınız kalmıştır. Yeni randevu oluşturmak için bize yazabilirsiniz.`;
  openWhatsAppMessage(phone, message);
};

export const sendWinbackMessage = (phone: string, customer: string) => {
  const message = `Merhaba ${customer}, sizi yeniden salonumuzda görmek isteriz. Size uygun bir bakım randevusu oluşturabiliriz.`;
  openWhatsAppMessage(phone, message);
};
