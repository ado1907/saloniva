import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { radius } from "../theme/spacing";

type Props = {
  label: string;
  value: string;
  percent: number;
};

export function SimpleBar({ label, value, percent }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${Math.max(4, Math.min(100, percent))}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 7
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10
  },
  label: {
    color: colors.text,
    fontWeight: "800"
  },
  value: {
    color: colors.accent,
    fontWeight: "800"
  },
  track: {
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.champagneSoft,
    overflow: "hidden"
  },
  fill: {
    height: "100%",
    borderRadius: radius.pill,
    backgroundColor: colors.accent
  }
});
