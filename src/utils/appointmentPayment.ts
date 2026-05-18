import type { Appointment, Payment } from "../types";

export function appointmentPaymentId(appointment: Appointment) {
  return `appointment-payment-${appointment.id}`;
}

export function createPaymentFromAppointment(appointment: Appointment): Payment {
  return {
    id: appointmentPaymentId(appointment),
    customer: appointment.customer,
    service: appointment.service,
    date: "Bugün",
    amount: appointment.price,
    method: "Kart",
    status: "Ödendi",
    remaining: 0
  };
}