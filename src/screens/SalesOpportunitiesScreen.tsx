import { StyleSheet, Text, View } from "react-native";
import { ActionButton } from "../components/ActionButton";
import { CompactRow } from "../components/CompactRow";
import { PanelCard } from "../components/PanelCard";
import { ScreenIntro } from "../components/ScreenIntro";
import { useSalonStore } from "../state/SalonStore";
import { colors } from "../theme/colors";
import { radius } from "../theme/spacing";
import { formatCurrency } from "../utils/format";
import { buildSalesOpportunities } from "../utils/opportunities";

export function SalesOpportunitiesScreen() {
  const { approveBookingRequest, bookingRequests, rejectBookingRequest, salonServices } = useSalonStore();
  const opportunities = buildSalesOpportunities(bookingRequests, salonServices);
  const openOpportunities = opportunities.filter((item) => item.status === "Onay Bekliyor");
  const totalPotential = openOpportunities.reduce((sum, item) => sum + item.potentialRevenue, 0);
  const highPriority = openOpportunities.filter((item) => item.priority === "Yüksek").length;

  return (
    <View style={styles.sectionGap}>
      <ScreenIntro
        title="Satış Fırsatları"
        description="Vitrin ve online randevu taleplerini gelir potansiyeline göre takip edin, hızlı dönüşle randevuya çevirin."
      />

      <View style={styles.hero}>
        <View>
          <Text style={styles.kicker}>Revenue pipeline</Text>
          <Text style={styles.heroTitle}>{formatCurrency(totalPotential)} açık fırsat</Text>
          <Text style={styles.heroCopy}>
            {openOpportunities.length} açık talep, {highPriority} yüksek öncelikli dönüş bekliyor.
          </Text>
        </View>
      </View>

      <View style={styles.metricGrid}>
        <Metric label="Açık talep" value={`${openOpportunities.length}`} />
        <Metric label="Yüksek öncelik" value={`${highPriority}`} />
        <Metric label="Toplam potansiyel" value={formatCurrency(totalPotential)} />
      </View>

      <PanelCard title="Fırsat Listesi">
        {opportunities.length > 0 ? (
          opportunities.map((item) => (
            <View key={item.id} style={styles.opportunityCard}>
              <CompactRow
                title={`${item.customer} • ${item.service}`}
                subtitle={`${item.source} • ${item.phone}`}
                badge={formatCurrency(item.potentialRevenue)}
              />
              <View style={styles.metaRow}>
                <Text style={styles.priority}>{item.priority} öncelik</Text>
                <Text style={styles.status}>{item.status}</Text>
              </View>
              <Text style={styles.nextAction}>{item.nextAction}</Text>
              {item.status === "Onay Bekliyor" ? (
                <View style={styles.actions}>
                  <ActionButton icon="checkmark-circle-outline" label="Randevuya Çevir" primary onPress={() => approveBookingRequest(item.id)} />
                  <ActionButton icon="close-circle-outline" label="Kaybedildi" onPress={() => rejectBookingRequest(item.id)} />
                </View>
              ) : null}
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>Henüz satış fırsatı yok. Salon Vitrini ekranından demo talep oluşturabilirsiniz.</Text>
        )}
      </PanelCard>

      <PanelCard title="Dönüş Hızı Playbook">
        <CompactRow title="0-15 dakika" subtitle="Yeni talebe WhatsApp ile hızlı dönüş yapılır." badge="En iyi" />
        <CompactRow title="15-60 dakika" subtitle="Talep sıcaklığını kaybetmeden alternatif saat önerilir." badge="İyi" />
        <CompactRow title="1 gün+" subtitle="Paket indirimi veya mini bakım önerisiyle geri kazanım yapılır." badge="Risk" />
      </PanelCard>
    </View>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionGap: {
    gap: 16
  },
  hero: {
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.sage,
    backgroundColor: colors.ink,
    padding: 16
  },
  kicker: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  heroTitle: {
    color: colors.white,
    fontSize: 26,
    fontWeight: "800",
    marginTop: 6
  },
  heroCopy: {
    color: "#d9d2c5",
    marginTop: 6,
    lineHeight: 20
  },
  metricGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12
  },
  metricCard: {
    flex: 1,
    minWidth: 170,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 14
  },
  metricLabel: {
    color: colors.muted,
    fontWeight: "800"
  },
  metricValue: {
    color: colors.text,
    fontSize: 23,
    fontWeight: "800",
    marginTop: 6
  },
  opportunityCard: {
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.softBorder,
    backgroundColor: colors.card,
    padding: 10,
    gap: 10
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  priority: {
    color: colors.accent,
    fontWeight: "800"
  },
  status: {
    color: colors.mutedDark,
    fontWeight: "800"
  },
  nextAction: {
    color: colors.muted,
    lineHeight: 19
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  emptyText: {
    color: colors.muted,
    lineHeight: 20
  }
});
