import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { radius } from "../theme/spacing";
import type { ServicePackage } from "../types";
import { formatCurrency } from "../utils/format";
import { MiniButton } from "./MiniButton";
import { SmallStat } from "./SmallStat";

type Props = {
  item: ServicePackage;
  onUseSession?: (packageId: string) => void;
  onOpenDetails?: (item: ServicePackage) => void;
};

export function PackageCard({ item, onUseSession, onOpenDetails }: Props) {
  const remaining = item.totalSessions - item.usedSessions;
  const debt = item.totalPrice - item.paid;
  const progress = `${item.usedSessions}/${item.totalSessions}`;

  return (
    <Pressable onPress={() => onOpenDetails?.(item)} style={styles.card}>
      <View style={styles.rowBetween}>
        <View>
          <Text style={styles.title}>{item.customer}</Text>
          <Text style={styles.subtitle}>{item.title}</Text>
        </View>
        <Text style={styles.progressText}>{progress}</Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${(item.usedSessions / item.totalSessions) * 100}%` }]} />
      </View>
      <View style={styles.stats}>
        <SmallStat label="Kalan seans" value={`${remaining}`} />
        <SmallStat label="Ödenen" value={formatCurrency(item.paid)} />
        <SmallStat label="Kalan ödeme" value={formatCurrency(debt)} warning={debt > 0} />
      </View>
      <View style={styles.actions}>
        <MiniButton icon="remove-circle-outline" label="Seans Kullan" onPress={() => onUseSession?.(item.id)} />
        <MiniButton icon="cash-outline" label="Ödeme Al" />
        <MiniButton icon="calendar-outline" label="Randevu" />
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
    padding: 13,
    gap: 12
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    flexWrap: "wrap"
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
  progressText: {
    color: colors.accent,
    fontWeight: "800",
    fontSize: 17
  },
  progressTrack: {
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.champagneSoft,
    overflow: "hidden"
  },
  progressFill: {
    height: "100%",
    borderRadius: radius.pill,
    backgroundColor: colors.accent
  },
  stats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  }
});
