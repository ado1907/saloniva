import { StyleSheet, Text, View } from "react-native";
import { AnimatedNumber } from "./AnimatedNumber";
import { AnimatedText } from "./AnimatedText";
import { useSalonStore } from "../state/SalonStore";
import { colors } from "../theme/colors";
import { radius } from "../theme/spacing";
import { formatCurrency } from "../utils/format";

export function BusinessSnapshot() {
  const { appointments, bookingRequests, customers, inventoryItems, packages, totals } = useSalonStore();
  const planned = appointments.filter((item) => item.status === "Planlandı").length;
  const completed = appointments.filter((item) => item.status === "Tamamlandı").length;
  const pendingRequests = bookingRequests.filter((item) => item.status === "Onay Bekliyor").length;
  const debtCustomers = customers.filter((item) => item.debt > 0).length;
  const lowStock = inventoryItems.filter((item) => item.quantity <= item.minQuantity).length;
  const renewalPackages = packages.filter((item) => item.totalSessions - item.usedSessions <= 1).length;
  const totalRevenue = totals.collected + totals.debt;
  const collectionRate = totalRevenue > 0 ? Math.round((totals.collected / totalRevenue) * 100) : 0;

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <AnimatedText style={styles.kicker}>Salon sahibi özeti</AnimatedText>
        <AnimatedText delay={90} style={styles.title}>Bugünün karar ekranı</AnimatedText>
        <Text style={styles.copy}>
          Gelir, tahsilat, randevu ve stok riskleri tek bakışta görülsün diye öncelikler sıralandı.
        </Text>
      </View>
      <View style={styles.grid}>
        <Signal label="Tahsilat sağlığı" value={collectionRate} suffix="%" detail={`${formatCurrency(totals.debt)} açık bakiye`} tone="gold" />
        <Signal label="Randevu akışı" value={completed} suffix={`/${appointments.length}`} detail={`${planned} randevu bekliyor`} tone="sage" />
        <Signal label="Online talep" value={pendingRequests} detail="Onay bekleyen müşteri" tone="accent" />
        <Signal label="Satış fırsatı" value={renewalPackages} detail="Paketi bitmek üzere" tone="gold" />
      </View>
      <View style={styles.actionStrip}>
        <Text style={styles.actionText}>
          Öncelik: {debtCustomers} müşteriye ödeme hatırlatması, {lowStock} stok kalemine sipariş takibi.
        </Text>
      </View>
    </View>
  );
}

function Signal({
  label,
  value,
  suffix,
  detail,
  tone
}: {
  label: string;
  value: number;
  suffix?: string;
  detail: string;
  tone: "accent" | "gold" | "sage";
}) {
  return (
    <View style={styles.signal}>
      <View style={[styles.dot, tone === "accent" ? styles.dotAccent : tone === "sage" ? styles.dotSage : styles.dotGold]} />
      <Text style={styles.signalLabel}>{label}</Text>
      <AnimatedNumber value={value} suffix={suffix} style={styles.signalValue} />
      <Text style={styles.signalDetail}>{detail}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.sage,
    backgroundColor: colors.ink,
    padding: 16,
    gap: 14
  },
  header: {
    gap: 5
  },
  kicker: {
    color: colors.goldSoft,
    fontWeight: "800",
    textTransform: "uppercase",
    fontSize: 12
  },
  title: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "800"
  },
  copy: {
    color: "#f3ead8",
    lineHeight: 20
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  signal: {
    flex: 1,
    minWidth: 145,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: "rgba(245, 231, 204, 0.20)",
    backgroundColor: "#302b22",
    padding: 12
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    marginBottom: 9
  },
  dotAccent: {
    backgroundColor: colors.accent
  },
  dotGold: {
    backgroundColor: colors.gold
  },
  dotSage: {
    backgroundColor: colors.sage
  },
  signalLabel: {
    color: "#f3ead8",
    fontWeight: "700"
  },
  signalValue: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "800",
    marginTop: 5
  },
  signalDetail: {
    color: "#dfd0b8",
    marginTop: 4,
    lineHeight: 18
  },
  actionStrip: {
    borderRadius: radius.sm,
    backgroundColor: "#344034",
    borderWidth: 1,
    borderColor: colors.sage,
    padding: 12
  },
  actionText: {
    color: colors.goldSoft,
    fontWeight: "700",
    lineHeight: 20
  }
});
