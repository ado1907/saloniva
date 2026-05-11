import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { radius } from "../theme/spacing";

type Props = {
  label: string;
  value: string;
  warning?: boolean;
};

export function SmallStat({ label, value, warning }: Props) {
  return (
    <View style={styles.stat}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, warning ? styles.warning : null]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  stat: {
    flexGrow: 1,
    flexBasis: 120,
    minWidth: 0,
    borderRadius: radius.sm,
    backgroundColor: colors.mutedSurface,
    padding: 9
  },
  label: {
    color: "#8a807b",
    fontSize: 12,
    fontWeight: "700"
  },
  value: {
    color: colors.text,
    fontWeight: "800",
    marginTop: 4,
    flexShrink: 1
  },
  warning: {
    color: colors.danger
  }
});
