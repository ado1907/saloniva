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
    backgroundColor: colors.surface,
    padding: 16
  },
  label: {
    color: colors.muted,
    fontWeight: "700"
  },
  value: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "800",
    marginTop: 6
  },
  warning: {
    color: colors.danger
  },
  detail: {
    color: colors.muted,
    marginTop: 4
  }
});
