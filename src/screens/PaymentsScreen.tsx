import { useState } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import { CompactRow } from "../components/CompactRow";
import { EmptyState } from "../components/EmptyState";
import { ModalShell } from "../components/ModalShell";
import { PanelCard } from "../components/PanelCard";
import { PaymentCard } from "../components/PaymentCard";
import { PaymentDetail } from "../components/PaymentDetail";
import { Pill } from "../components/Pill";
import { ScreenIntro } from "../components/ScreenIntro";
import { SummaryCard } from "../components/SummaryCard";
import { useSalonStore } from "../state/SalonStore";
import type { Payment } from "../types";
import { formatCurrency } from "../utils/format";

export function PaymentsScreen() {
  const { width } = useWindowDimensions();
  const isWide = width >= 900;
  const { payments } = useSalonStore();
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [activeFilter, setActiveFilter] = useState("Tümü");
  const filteredPayments = payments.filter((payment) => {
    if (activeFilter === "Tümü") {
      return true;
    }

    return payment.status === activeFilter;
  });
  const collected = payments.reduce((sum, item) => sum + item.amount, 0);
  const remaining = payments.reduce((sum, item) => sum + item.remaining, 0);
  const waitingCount = payments.filter((item) => item.remaining > 0).length;

  return (
    <View style={styles.sectionGap}>
      <ScreenIntro
        title="Ödemeler ve Borçlar"
        description="Günlük tahsilatı, açık borçları ve ödeme yöntemlerini tek ekrandan takip edin."
      />

      <View style={styles.summaryGrid}>
        <SummaryCard label="Bugünkü Tahsilat" value={formatCurrency(collected)} detail="Nakit, kart ve havale toplamı" />
        <SummaryCard label="Bekleyen Ödeme" value={formatCurrency(remaining)} detail={`${waitingCount} müşteride açık ödeme`} warning />
        <SummaryCard label="Kart Tahsilatı" value={formatCurrency(12850)} detail="Bugünün kart işlemleri" />
      </View>

      <View style={styles.filterRow}>
        {["Tümü", "Ödendi", "Kısmi Ödendi", "Bekliyor", "İade"].map((item) => (
          <Pill key={item} label={item} active={activeFilter === item} onPress={() => setActiveFilter(item)} />
        ))}
      </View>

      <View style={[styles.columns, isWide ? styles.columnsWide : null]}>
        <PanelCard title="Son Ödemeler" style={styles.mainColumn}>
          {filteredPayments.length > 0 ? (
            filteredPayments.map((payment) => (
              <PaymentCard key={payment.id} payment={payment} onOpenDetails={setSelectedPayment} />
            ))
          ) : (
            <EmptyState title="Ödeme bulunamadı" description="Seçili durum filtresinde ödeme kaydı yok." />
          )}
        </PanelCard>
        <View style={styles.sideColumn}>
          <PanelCard title="Borçlu Müşteriler">
            {payments
              .filter((payment) => payment.remaining > 0)
              .map((payment) => (
                <CompactRow
                  key={payment.id}
                  title={payment.customer}
                  subtitle={payment.service}
                  badge={formatCurrency(payment.remaining)}
                />
              ))}
          </PanelCard>
          <PanelCard title="Ödeme Yöntemleri">
            <CompactRow title="Kart" subtitle="2 işlem" badge={formatCurrency(12000)} />
            <CompactRow title="Nakit" subtitle="1 işlem" badge={formatCurrency(850)} />
            <CompactRow title="Havale" subtitle="1 işlem" badge={formatCurrency(2000)} />
          </PanelCard>
        </View>
      </View>
      <ModalShell
        visible={Boolean(selectedPayment)}
        title="Ödeme Detayı"
        onClose={() => setSelectedPayment(null)}
      >
        {selectedPayment ? <PaymentDetail payment={selectedPayment} /> : null}
      </ModalShell>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionGap: {
    gap: 16
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  columns: {
    gap: 14
  },
  columnsWide: {
    flexDirection: "row",
    alignItems: "flex-start"
  },
  mainColumn: {
    flex: 1.5
  },
  sideColumn: {
    flex: 1,
    gap: 14
  }
});
