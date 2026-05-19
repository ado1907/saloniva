import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { radius } from "../theme/spacing";

type Props = {
  label: string;
  value: string;
  detail: string;
  warning?: boolean;
};

export function SummaryCard({ label, value, detail, warning }: Props) {
  return (
    <View style={styles.card}>
      <View style={[styles.marker, warning ? styles.markerDanger : null]} />
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, warning ? styles.warning : null]}>{value}</Text>
      <Text style={styles.detail}>{detail}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 180,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2
  },
  marker: {
    width: 26,
    height: 4,
    borderRadius: 999,
    backgroundColor: colors.gold,
    marginBottom: 12
  },
  markerDanger: {
    backgroundColor: colors.danger
  },
  label: {
    color: colors.muted,
    fontWeight: "900",
    textTransform: "uppercase",
    fontSize: 11
  },
  value: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "900",
    marginTop: 6
  },
  warning: {
    color: colors.danger
  },
  detail: {
    color: colors.muted,
    marginTop: 5,
    lineHeight: 19
  }
});
