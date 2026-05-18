import { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { AppointmentCard } from "../components/AppointmentCard";
import { AppointmentDetail } from "../components/AppointmentDetail";
import { CompactRow } from "../components/CompactRow";
import { ModalShell } from "../components/ModalShell";
import { PanelCard } from "../components/PanelCard";
import { SalonivaIntelligencePanel } from "../components/SalonivaIntelligencePanel";
import { services, staff } from "../data/demoData";
import { useSalonStore } from "../state/SalonStore";
import { colors } from "../theme/colors";
import { radius } from "../theme/spacing";
import type { Appointment } from "../types";
import { appointmentPaymentId, createPaymentFromAppointment } from "../utils/appointmentPayment";
import { formatCurrency } from "../utils/format";
import { buildSalonivaAiInsights, buildSalonivaSignals, getSalonivaDemoScore } from "../utils/salonivaAiInsights";

type Props = {
  isWide: boolean;
};

type MetricTone = "sage" | "gold" | "danger" | "ink";

export function DashboardScreen({ isWide }: Props) {
  const {
    appointments,
    bookingRequests,
    customers,
    inventoryItems,
    payments,
    addPayment,
    markAppointmentCompleted,
    packages,
    totals
  } = useSalonStore();
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const plannedAppointments = appointments.filter((appointment) => appointment.status === "Planlandı").length;
  const activeAppointments = appointments.filter((appointment) => appointment.status === "Planlandı" || appointment.status === "Geldi");
  const pendingRequests = bookingRequests.filter((request) => request.status === "Onay Bekliyor");
  const debtCustomers = customers.filter((customer) => customer.debt > 0);
  const lowStock = inventoryItems.filter((item) => item.quantity <= item.minQuantity);
  const renewalPackages = packages.filter((item) => item.totalSessions - item.usedSessions <= 1);
  const totalRevenue = totals.collected + totals.debt;
  const collectionRate = totalRevenue > 0 ? Math.round((totals.collected / totalRevenue) * 100) : 0;
  const occupancyRate = appointments.length > 0 ? Math.round((appointments.length / Math.max(appointments.length + 2, 1)) * 100) : 0;
  const nextAppointment = activeAppointments[0] ?? appointments[0];

  const priorityItems = useMemo(
    () => [
      {
        title: `${debtCustomers.length} ödeme hatırlatması`,
        detail: `${formatCurrency(totals.debt)} açık bakiye`,
        badge: "Tahsilat",
        tone: "danger" as MetricTone
      },
      {
        title: `${pendingRequests.length} online talep`,
        detail: "Onay bekleyen randevuları hızlı kapat",
        badge: "Talep",
        tone: "sage" as MetricTone
      },
      {
        title: `${renewalPackages.length} paket yenileme`,
        detail: "Bitmek üzere olan seansları satışa çevir",
        badge: "Satış",
        tone: "gold" as MetricTone
      },
      {
        title: `${lowStock.length} stok uyarısı`,
        detail: "Kritik ürünleri bugün siparişe al",
        badge: "Stok",
        tone: "ink" as MetricTone
      }
    ],
    [debtCustomers.length, lowStock.length, pendingRequests.length, renewalPackages.length, totals.debt]
  );
  const aiInsights = useMemo(
    () =>
      buildSalonivaAiInsights({
        appointments,
        bookingRequests,
        customers,
        inventoryItems,
        packages,
        payments,
        totals
      }),
    [appointments, bookingRequests, customers, inventoryItems, packages, payments, totals]
  );

  const aiSignals = useMemo(
    () =>
      buildSalonivaSignals({
        appointments,
        bookingRequests,
        customers,
        inventoryItems,
        packages,
        payments,
        totals
      }),
    [appointments, bookingRequests, customers, inventoryItems, packages, payments, totals]
  );

  const aiScore = useMemo(
    () =>
      getSalonivaDemoScore({
        appointments,
        bookingRequests,
        customers,
        inventoryItems,
        packages,
        payments,
        totals
      }),
    [appointments, bookingRequests, customers, inventoryItems, packages, payments, totals]
  );

  const handleTakePayment = (appointment: Appointment) => {
    if (!payments.some((payment) => payment.id === appointmentPaymentId(appointment))) {
      addPayment(createPaymentFromAppointment(appointment));
    }

    markAppointmentCompleted(appointment.id);
  };

  const vipCustomers = useMemo(
    () => [...customers].sort((first, second) => second.totalSpent - first.totalSpent).slice(0, 3),
    [customers]
  );

  return (
    <View style={styles.sectionGap}>
      <View style={[styles.commandCenter, isWide ? styles.commandCenterWide : null]}>
        <View style={styles.commandCopy}>
          <Text style={styles.kicker}>Saloniva Command</Text>
          <Text style={styles.commandTitle}>Bugünün ritmini tek ekrandan yönet.</Text>
          <Text style={styles.commandText}>
            Randevu akışı, tahsilat, müşteri fırsatları ve ekip yoğunluğu satış demosunda ilk bakışta anlaşılır hale getirildi.
          </Text>
          <View style={styles.signalStrip}>
            <Signal label="Doluluk" value={`%${occupancyRate}`} />
            <Signal label="Tahsilat" value={`%${collectionRate}`} />
            <Signal label="Bekleyen" value={`${plannedAppointments}`} />
          </View>
        </View>

        <View style={styles.nextPanel}>
          <Text style={styles.nextKicker}>Sıradaki kritik işlem</Text>
          {nextAppointment ? (
            <>
              <Text style={styles.nextTime}>{nextAppointment.time}</Text>
              <Text style={styles.nextTitle}>{nextAppointment.customer}</Text>
              <Text style={styles.nextDetail}>
                {nextAppointment.service} · {nextAppointment.staff} · {formatCurrency(nextAppointment.price)}
              </Text>
            </>
          ) : (
            <Text style={styles.nextDetail}>Bugün için randevu görünmüyor.</Text>
          )}
          <View style={styles.nextFooter}>
            <Text style={styles.nextFooterText}>{pendingRequests.length} online talep</Text>
            <Text style={styles.nextFooterText}>{debtCustomers.length} açık ödeme</Text>
          </View>
        </View>
      </View>

      <SalonivaIntelligencePanel
        insights={aiInsights}
        isWide={isWide}
        score={aiScore}
        signals={aiSignals}
      />
      <View style={[styles.metricsGrid, isWide ? styles.metricsGridWide : null]}>
        <MetricTile title="Günlük ciro" value={formatCurrency(totals.expectedRevenue)} detail="Planlı randevu potansiyeli" tone="gold" />
        <MetricTile title="Tahsilat sağlığı" value={`%${collectionRate}`} detail={`${formatCurrency(totals.debt)} açık bakiye`} tone="sage" />
        <MetricTile title="Randevu akışı" value={`${totals.completedAppointments}/${appointments.length}`} detail={`${plannedAppointments} randevu bekliyor`} tone="ink" />
        <MetricTile title="Kayıp risk" value={`${totals.missedAppointments}`} detail="Gelmedi veya iptal" tone="danger" />
      </View>

      <View style={[styles.columns, isWide ? styles.columnsWide : null]}>
        <PanelCard title="Canlı randevu akışı" action={`${appointments.length} kayıt`} style={styles.mainColumn}>
          <View style={styles.timelineIntro}>
            <Text style={styles.timelineTitle}>Bugünkü zaman çizgisi</Text>
            <Text style={styles.timelineText}>Müşteri geldi, tamamlandı veya gelmedi durumları buradan hızlı yönetilir.</Text>
          </View>
          {appointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onOpenDetails={setSelectedAppointment}
              onTakePayment={handleTakePayment}
            />
          ))}
        </PanelCard>

        <View style={styles.sideColumn}>
          <PanelCard title="Öncelik listesi">
            {priorityItems.map((item) => (
              <PriorityRow key={item.badge} {...item} />
            ))}
          </PanelCard>

          <PanelCard title="VIP müşteri fırsatları">
            {vipCustomers.map((customer) => (
              <CompactRow
                key={customer.id}
                title={customer.name}
                subtitle={customer.note}
                badge={formatCurrency(customer.totalSpent)}
              />
            ))}
          </PanelCard>

          <PanelCard title="En güçlü hizmetler">
            {services.slice(0, 4).map((service) => (
              <CompactRow
                key={service.name}
                title={service.name}
                subtitle={`${service.count} işlem · demo satış vitrini`}
                badge={formatCurrency(service.revenue)}
              />
            ))}
          </PanelCard>

          <PanelCard title="Ekip yükü">
            {staff.map((member) => (
              <CompactRow
                key={member.name}
                title={member.name}
                subtitle={`${member.count} randevu bugün`}
                badge={formatCurrency(member.revenue)}
              />
            ))}
          </PanelCard>
        </View>
      </View>

      <ModalShell
        visible={Boolean(selectedAppointment)}
        title="Randevu Detayı"
        onClose={() => setSelectedAppointment(null)}
      >
        {selectedAppointment ? (
          <AppointmentDetail appointment={selectedAppointment} onClose={() => setSelectedAppointment(null)} />
        ) : null}
      </ModalShell>
    </View>
  );
}

function Signal({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.signal}>
      <Text style={styles.signalLabel}>{label}</Text>
      <Text style={styles.signalValue}>{value}</Text>
    </View>
  );
}

function MetricTile({ title, value, detail, tone }: { title: string; value: string; detail: string; tone: MetricTone }) {
  return (
    <View style={styles.metricTile}>
      <View style={[styles.metricMark, tone === "gold" ? styles.metricGold : tone === "danger" ? styles.metricDanger : tone === "ink" ? styles.metricInk : styles.metricSage]} />
      <Text style={styles.metricTitle}>{title}</Text>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricDetail}>{detail}</Text>
    </View>
  );
}

function PriorityRow({ title, detail, badge, tone }: { title: string; detail: string; badge: string; tone: MetricTone }) {
  return (
    <View style={styles.priorityRow}>
      <View style={styles.priorityCopy}>
        <Text style={styles.priorityTitle}>{title}</Text>
        <Text style={styles.priorityDetail}>{detail}</Text>
      </View>
      <Text style={[styles.priorityBadge, tone === "gold" ? styles.priorityGold : tone === "danger" ? styles.priorityDanger : tone === "ink" ? styles.priorityInk : styles.prioritySage]}>
        {badge}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionGap: {
    gap: 16
  },
  commandCenter: {
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: "rgba(244, 231, 206, 0.24)",
    backgroundColor: colors.ink,
    padding: 18,
    gap: 14,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3
  },
  commandCenterWide: {
    flexDirection: "row",
    alignItems: "stretch"
  },
  commandCopy: {
    flex: 1.45,
    gap: 10
  },
  kicker: {
    color: colors.goldSoft,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  commandTitle: {
    color: colors.white,
    fontSize: 31,
    lineHeight: 38,
    fontWeight: "900"
  },
  commandText: {
    color: "#f1e7d6",
    lineHeight: 22,
    maxWidth: 640
  },
  signalStrip: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4
  },
  signal: {
    minWidth: 104,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    backgroundColor: "rgba(255,255,255,0.10)",
    padding: 10
  },
  signalLabel: {
    color: "rgba(255,255,255,0.70)",
    fontSize: 12,
    fontWeight: "800"
  },
  signalValue: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "900",
    marginTop: 3
  },
  nextPanel: {
    flex: 0.85,
    minWidth: 260,
    borderRadius: radius.sm,
    backgroundColor: "#f8efe0",
    padding: 15,
    justifyContent: "space-between",
    gap: 10
  },
  nextKicker: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  nextTime: {
    color: colors.text,
    fontSize: 36,
    lineHeight: 42,
    fontWeight: "900"
  },
  nextTitle: {
    color: colors.text,
    fontSize: 19,
    fontWeight: "900"
  },
  nextDetail: {
    color: colors.mutedDark,
    lineHeight: 21
  },
  nextFooter: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  nextFooterText: {
    borderRadius: radius.pill,
    backgroundColor: colors.card,
    color: colors.accent,
    fontWeight: "800",
    paddingHorizontal: 10,
    paddingVertical: 7
  },
  metricsGrid: {
    gap: 10
  },
  metricsGridWide: {
    flexDirection: "row"
  },
  metricTile: {
    flex: 1,
    minWidth: 154,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.softBorder,
    backgroundColor: colors.card,
    padding: 14,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 7 },
    elevation: 2
  },
  metricMark: {
    width: 34,
    height: 5,
    borderRadius: radius.pill,
    marginBottom: 12
  },
  metricSage: {
    backgroundColor: colors.sage
  },
  metricGold: {
    backgroundColor: colors.gold
  },
  metricDanger: {
    backgroundColor: colors.danger
  },
  metricInk: {
    backgroundColor: colors.accent
  },
  metricTitle: {
    color: colors.muted,
    fontWeight: "800"
  },
  metricValue: {
    color: colors.text,
    fontSize: 25,
    fontWeight: "900",
    marginTop: 4
  },
  metricDetail: {
    color: colors.muted,
    marginTop: 4,
    lineHeight: 19
  },
  columns: {
    gap: 14
  },
  columnsWide: {
    flexDirection: "row",
    alignItems: "flex-start"
  },
  mainColumn: {
    flex: 1.65
  },
  sideColumn: {
    flex: 1,
    gap: 14
  },
  timelineIntro: {
    borderRadius: radius.sm,
    backgroundColor: colors.accentSofter,
    borderWidth: 1,
    borderColor: colors.sageSoft,
    padding: 12,
    gap: 4
  },
  timelineTitle: {
    color: colors.accent,
    fontWeight: "900"
  },
  timelineText: {
    color: colors.mutedDark,
    lineHeight: 20
  },
  priorityRow: {
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.softBorder,
    backgroundColor: colors.surface,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10
  },
  priorityCopy: {
    flex: 1,
    gap: 4
  },
  priorityTitle: {
    color: colors.text,
    fontWeight: "900"
  },
  priorityDetail: {
    color: colors.muted,
    lineHeight: 19
  },
  priorityBadge: {
    minWidth: 62,
    overflow: "hidden",
    borderRadius: radius.pill,
    color: colors.white,
    fontWeight: "900",
    textAlign: "center",
    paddingHorizontal: 10,
    paddingVertical: 7
  },
  prioritySage: {
    backgroundColor: colors.sage
  },
  priorityGold: {
    backgroundColor: colors.gold
  },
  priorityDanger: {
    backgroundColor: colors.danger
  },
  priorityInk: {
    backgroundColor: colors.accent
  }
});
