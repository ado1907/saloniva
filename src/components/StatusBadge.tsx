import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import type { AppointmentStatus } from "../types";

type Props = {
  status: AppointmentStatus;
};

export function StatusBadge({ status }: Props) {
  const styleByStatus: Record<AppointmentStatus, object> = {
    Planlandı: styles.blue,
    Geldi: styles.purple,
    Tamamlandı: styles.green,
    Gelmedi: styles.red,
    İptal: styles.gray
  };

  return (
    <View style={[styles.badge, styleByStatus[status]]}>
      <Text style={styles.text}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 5
  },
  text: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.text
  },
  blue: { backgroundColor: colors.blue },
  purple: { backgroundColor: colors.purple },
  green: { backgroundColor: colors.green },
  red: { backgroundColor: colors.red },
  gray: { backgroundColor: colors.gray }
});
