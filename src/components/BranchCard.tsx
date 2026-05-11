import { StyleSheet, Text, View } from "react-native";
import { MiniButton } from "./MiniButton";
import { SmallStat } from "./SmallStat";
import { colors } from "../theme/colors";
import { radius } from "../theme/spacing";
import type { Branch } from "../types";
import { formatCurrency } from "../utils/format";

type Props = {
  branch: Branch;
};

export function BranchCard({ branch }: Props) {
  const setup = branch.status === "Kurulumda";

  return (
    <View style={styles.card}>
      <View style={styles.rowBetween}>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>{branch.name}</Text>
          <Text style={styles.subtitle}>
            {branch.address} • Yönetici: {branch.manager}
          </Text>
        </View>
        <View style={[styles.badge, setup ? styles.setupBadge : styles.activeBadge]}>
          <Text style={styles.badgeText}>{branch.status}</Text>
        </View>
      </View>

      <View style={styles.stats}>
        <SmallStat label="Bugünkü randevu" value={`${branch.appointmentsToday}`} />
        <SmallStat label="Aylık gelir" value={formatCurrency(branch.monthlyRevenue)} />
        <SmallStat label="Personel" value={`${branch.staffCount}`} />
      </View>

      <View style={styles.actions}>
        <MiniButton icon="bar-chart-outline" label="Rapor" />
        <MiniButton icon="people-outline" label="Personel" />
        <MiniButton icon="settings-outline" label="Ayarlar" />
      </View>
    </View>
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
  titleWrap: {
    flex: 1,
    minWidth: 190
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800"
  },
  subtitle: {
    color: colors.muted,
    lineHeight: 20,
    marginTop: 2
  },
  badge: {
    borderRadius: radius.pill,
    paddingHorizontal: 9,
    paddingVertical: 5
  },
  activeBadge: {
    backgroundColor: colors.green
  },
  setupBadge: {
    backgroundColor: colors.champagneSoft
  },
  badgeText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "800"
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
