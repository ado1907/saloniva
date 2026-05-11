import { StyleSheet, Text, View } from "react-native";
import { CompactRow } from "./CompactRow";
import { LuxuryMiniScene } from "./LuxuryVisual";
import { PanelCard } from "./PanelCard";
import { useSalonStore } from "../state/SalonStore";
import { colors } from "../theme/colors";
import { formatCurrency } from "../utils/format";

export function AlertCenter() {
  const { appointments, bookingRequests, customers, inventoryItems, packages } = useSalonStore();
  const upcoming = appointments.filter((item) => item.status === "Planlandı").slice(0, 3);
  const debtCustomers = customers.filter((item) => item.debt > 0).slice(0, 3);
  const lowStock = inventoryItems.filter((item) => item.quantity <= item.minQuantity).slice(0, 3);
  const renewals = packages
    .filter((item) => item.totalSessions - item.usedSessions <= 1)
    .slice(0, 3);
  const pendingRequests = bookingRequests.filter((item) => item.status === "Onay Bekliyor").slice(0, 3);
  const hasAlerts = upcoming.length || debtCustomers.length || lowStock.length || renewals.length || pendingRequests.length;

  return (
    <PanelCard title="Uyarı Merkezi">
      <View style={styles.editorial}>
        <LuxuryMiniScene />
      </View>
      {hasAlerts ? (
        <View style={styles.stack}>
          {pendingRequests.map((item) => (
            <CompactRow key={item.id} title={`${item.preferredTime} - ${item.customer}`} subtitle="Online randevu onayı bekliyor" badge="Onay" />
          ))}
          {upcoming.map((item) => (
            <CompactRow key={item.id} title={`${item.time} - ${item.customer}`} subtitle={`${item.service} • ${item.staff}`} badge="Yaklaşan" />
          ))}
          {debtCustomers.map((item) => (
            <CompactRow key={item.id} title={item.name} subtitle="Açık ödeme hatırlatılabilir" badge={formatCurrency(item.debt)} />
          ))}
          {renewals.map((item) => (
            <CompactRow key={item.id} title={item.customer} subtitle={item.title} badge={`${item.totalSessions - item.usedSessions} seans`} />
          ))}
          {lowStock.map((item) => (
            <CompactRow key={item.id} title={item.name} subtitle={`${item.supplier} • düşük stok`} badge={`${item.quantity} ${item.unit}`} />
          ))}
        </View>
      ) : (
        <Text style={styles.empty}>Bugün için kritik uyarı görünmüyor.</Text>
      )}
    </PanelCard>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: 10
  },
  empty: {
    color: colors.muted,
    lineHeight: 20
  },
  editorial: {
    gap: 10
  }
});
