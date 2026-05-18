import { StyleSheet, Text, View } from "react-native";
import { ActionButton } from "./ActionButton";
import { CompactRow } from "./CompactRow";
import { PanelCard } from "./PanelCard";
import { StatusBadge } from "./StatusBadge";
import { useSalonStore } from "../state/SalonStore";
import { colors } from "../theme/colors";
import type { Appointment } from "../types";
import { appointmentPaymentId, createPaymentFromAppointment } from "../utils/appointmentPayment";
import { formatCurrency } from "../utils/format";
import { sendAppointmentReminder } from "../utils/whatsapp";

type Props = {
  appointment: Appointment;
  onClose: () => void;
};

export function AppointmentDetail({ appointment, onClose }: Props) {
  const { addPayment, customers, payments, markAppointmentCompleted, updateAppointmentStatus } = useSalonStore();
  const customer = customers.find((item) => item.name === appointment.customer);
  const customerPayments = payments.filter((item) => item.customer === appointment.customer);
  const latestPayment = customerPayments[0];

  const completeAppointment = () => {
    markAppointmentCompleted(appointment.id);
    onClose();
  };

  const takePayment = () => {
    if (!payments.some((payment) => payment.id === appointmentPaymentId(appointment))) {
      addPayment(createPaymentFromAppointment(appointment));
    }

    markAppointmentCompleted(appointment.id);
    onClose();
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <View style={styles.titleWrap}>
          <Text style={styles.customer}>{appointment.customer}</Text>
          <Text style={styles.meta}>
            {appointment.time} - {appointment.end} • {appointment.staff}
          </Text>
        </View>
        <StatusBadge status={appointment.status} />
      </View>

      <View style={styles.actions}>
        <ActionButton icon="cash-outline" label="Ödeme Al" primary onPress={takePayment} />
        <ActionButton icon="checkmark-circle-outline" label="Tamamlandı Yap" onPress={completeAppointment} />
        <ActionButton icon="person-outline" label="Geldi" onPress={() => updateAppointmentStatus(appointment.id, "Geldi")} />
        <ActionButton icon="alert-circle-outline" label="Gelmedi" onPress={() => updateAppointmentStatus(appointment.id, "Gelmedi")} />
        <ActionButton icon="close-circle-outline" label="İptal" onPress={() => updateAppointmentStatus(appointment.id, "İptal")} />
        <ActionButton icon="logo-whatsapp" label="WhatsApp Hatırlat" onPress={() => sendAppointmentReminder(appointment)} />
      </View>

      <PanelCard title="Randevu Bilgisi">
        <CompactRow title={appointment.service} subtitle="Hizmet" badge={formatCurrency(appointment.price)} />
        <CompactRow title={appointment.staff} subtitle="Personel" badge={appointment.status} />
        <CompactRow title={`${appointment.time} - ${appointment.end}`} subtitle="Saat aralığı" badge="Bugün" />
      </PanelCard>

      <PanelCard title="Müşteri Özeti">
        {customer ? (
          <>
            <CompactRow title={customer.phone} subtitle="Telefon" badge="Kayıtlı" />
            <CompactRow title={customer.packageLabel} subtitle="Paket durumu" badge={formatCurrency(customer.debt)} />
            <Text style={styles.note}>{customer.note}</Text>
          </>
        ) : (
          <Text style={styles.note}>Bu randevu için kayıtlı müşteri kartı bulunamadı.</Text>
        )}
      </PanelCard>

      <PanelCard title="Son Ödeme">
        {latestPayment ? (
          <CompactRow
            title={latestPayment.service}
            subtitle={`${latestPayment.date} • ${latestPayment.method} • ${latestPayment.status}`}
            badge={formatCurrency(latestPayment.amount)}
          />
        ) : (
          <Text style={styles.note}>Bu müşteri için ödeme kaydı yok.</Text>
        )}
      </PanelCard>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 12
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    flexWrap: "wrap"
  },
  titleWrap: {
    flex: 1,
    minWidth: 220
  },
  customer: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "800"
  },
  meta: {
    color: colors.muted,
    marginTop: 3
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  note: {
    color: colors.muted,
    lineHeight: 20
  }
});