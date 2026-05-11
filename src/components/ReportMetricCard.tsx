import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { radius } from "../theme/spacing";

type Props = {
  label: string;
  value: string;
  detail: string;
  trend?: string;
  warning?: boolean;
};

export function ReportMetricCard({ label, value, detail, trend, warning }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, warning ? styles.warning : null]}>{value}</Text>
      <Text style={styles.detail}>{detail}</Text>
      {trend ? <Text style={styles.trend}>{trend}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 190,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 16
  },
  label: {
    color: colors.muted,
    fontWeight: "700"
  },
  value: {
    color: colors.text,
    fontSize: 23,
    fontWeight: "700",
    marginTop: 6
  },
  warning: {
    color: colors.danger
  },
  detail: {
    color: colors.muted,
    marginTop: 4
  },
  trend: {
    color: colors.accent,
    fontWeight: "700",
    marginTop: 8
  }
});
