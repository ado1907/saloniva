import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { radius } from "../theme/spacing";
import type { Appointment } from "../types";
import { formatCurrency } from "../utils/format";
import { sendAppointmentReminder } from "../utils/whatsapp";
import { MiniButton } from "./MiniButton";
import { StatusBadge } from "./StatusBadge";

type Props = {
  appointment: Appointment;
  onOpenDetails?: (appointment: Appointment) => void;
  onTakePayment?: (appointment: Appointment) => void;
};

export function AppointmentCard({ appointment, onOpenDetails, onTakePayment }: Props) {
  return (
    <Pressable onPress={() => onOpenDetails?.(appointment)} style={styles.card}>
      <View style={styles.timeBlock}>
        <Text style={styles.timeText}>{appointment.time}</Text>
        <Text style={styles.endText}>{appointment.end}</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.rowBetween}>
          <Text style={styles.title}>{appointment.customer}</Text>
          <StatusBadge status={appointment.status} />
        </View>
        <Text style={styles.subtitle}>
          {appointment.service} • {appointment.staff} • {formatCurrency(appointment.price)}
        </Text>
        <View style={styles.actions}>
          <MiniButton icon="cash-outline" label="Ödeme Al" onPress={() => onTakePayment?.(appointment)} />
          <MiniButton icon="logo-whatsapp" label="Hatırlat" onPress={() => sendAppointmentReminder(appointment)} />
          <MiniButton icon="document-text-outline" label="Detay" onPress={() => onOpenDetails?.(appointment)} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.softBorder,
    backgroundColor: colors.card,
    padding: 12,
    flexDirection: "row",
    gap: 12
  },
  timeBlock: {
    width: 64,
    borderRadius: radius.sm,
    backgroundColor: colors.mutedSurface,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10
  },
  timeText: {
    color: colors.text,
    fontWeight: "800"
  },
  endText: {
    color: "#8a807b",
    marginTop: 3,
    fontSize: 12
  },
  body: {
    flex: 1,
    gap: 8
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800"
  },
  subtitle: {
    color: "#706762",
    lineHeight: 20
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  }
});