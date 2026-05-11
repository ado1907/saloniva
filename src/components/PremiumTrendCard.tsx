import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { radius } from "../theme/spacing";

type Props = {
  title: string;
  value: string;
  detail: string;
  points: number[];
  tone?: "sage" | "gold";
};

export function PremiumTrendCard({ title, value, detail, points, tone = "sage" }: Props) {
  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.detail}>{detail}</Text>
      </View>
      <View style={styles.chart}>
        {points.map((point, index) => (
          <View key={`${point}-${index}`} style={styles.barWrap}>
            <View
              style={[
                styles.bar,
                tone === "gold" ? styles.barGold : styles.barSage,
                { height: `${Math.max(18, Math.min(100, point))}%` }
              ]}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 210,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.softBorder,
    backgroundColor: colors.card,
    padding: 15,
    gap: 14,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 7 },
    elevation: 2
  },
  title: {
    color: colors.muted,
    fontWeight: "800"
  },
  value: {
    color: colors.text,
    fontSize: 25,
    fontWeight: "800",
    marginTop: 5
  },
  detail: {
    color: colors.muted,
    marginTop: 4,
    lineHeight: 19
  },
  chart: {
    height: 74,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,
    borderRadius: radius.sm,
    backgroundColor: colors.mutedSurface,
    padding: 8
  },
  barWrap: {
    flex: 1,
    height: "100%",
    justifyContent: "flex-end"
  },
  bar: {
    borderRadius: radius.pill
  },
  barSage: {
    backgroundColor: colors.sage
  },
  barGold: {
    backgroundColor: colors.gold
  }
});
