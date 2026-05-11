import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { AnimatedNumber } from "../components/AnimatedNumber";
import { AnimatedText } from "../components/AnimatedText";
import { CompactRow } from "../components/CompactRow";
import { InsightCard } from "../components/InsightCard";
import { PanelCard } from "../components/PanelCard";
import { PremiumTrendCard } from "../components/PremiumTrendCard";
import { Pill } from "../components/Pill";
import { ReportMetricCard } from "../components/ReportMetricCard";
import { ScreenIntro } from "../components/ScreenIntro";
import { SimpleBar } from "../components/SimpleBar";
import { services, staff } from "../data/demoData";
import { useSalonStore } from "../state/SalonStore";
import { colors } from "../theme/colors";
import { radius } from "../theme/spacing";
import { formatCurrency } from "../utils/format";

export function ReportsScreen() {
  const { width } = useWindowDimensions();
  const isWide = width >= 900;
  const { appointments, payments } = useSalonStore();
  const revenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const debt = payments.reduce((sum, payment) => sum + payment.remaining, 0);
  const missed = appointments.filter((appointment) => appointment.status === "Gelmedi" || appointment.status === "İptal").length;
  const totalServiceRevenue = services.reduce((sum, service) => sum + service.revenue, 0);
  const maxServiceRevenue = Math.max(...services.map((service) => service.revenue));
  const maxStaffRevenue = Math.max(...staff.map((member) => member.revenue));
  const completed = appointments.filter((appointment) => appointment.status === "Tamamlandı").length;
  const completionRate = appointments.length ? Math.round((completed / appointments.length) * 100) : 0;
  const projectedRevenue = revenue + debt;
  const recoveryValue = missed * 1200;
  const upsellValue = Math.round(totalServiceRevenue * 0.18);

  return (
    <View style={styles.sectionGap}>
      <ScreenIntro
        title="Raporlar"
        description="Gelir, hizmet, personel ve kayıp randevu performansını salon kararları için görünür hale getirin."
        action="Rapor Al"
      />

      <View style={styles.filterRow}>
        {["Bugün", "Bu Hafta", "Bu Ay", "Özel Tarih"].map((item, index) => (
          <Pill key={item} label={item} active={index === 2} />
        ))}
      </View>

      <View style={styles.metricsGrid}>
        <ReportMetricCard label="Tahsilat" value={formatCurrency(revenue)} detail="Seçili dönem toplamı" trend="+12% geçen aya göre" />
        <ReportMetricCard label="Bekleyen Ödeme" value={formatCurrency(debt)} detail="Açık müşteri borcu" warning />
        <ReportMetricCard label="Kayıp Randevu" value={`${missed}`} detail="Gelmedi veya iptal" warning={missed > 0} />
        <ReportMetricCard label="Hizmet Geliri" value={formatCurrency(totalServiceRevenue)} detail="Popüler hizmet toplamı" />
        <ReportMetricCard label="Tamamlanma" value={`%${completionRate}`} detail="Randevu tamamlama oranı" trend="Takip edilebilir KPI" />
      </View>

      <RevenueAdvisor projectedRevenue={projectedRevenue} recoveryValue={recoveryValue} upsellValue={upsellValue} debt={debt} />

      <View style={styles.trendGrid}>
        <PremiumTrendCard
          title="Gelir ritmi"
          value={formatCurrency(projectedRevenue)}
          detail="Haftalık tahsilat ve açık bakiye trendi"
          points={[42, 56, 48, 66, 74, 92]}
          tone="gold"
        />
        <PremiumTrendCard
          title="Randevu kalitesi"
          value={`%${completionRate}`}
          detail="Tamamlanan randevu oranı"
          points={[54, 62, 70, 68, 82, completionRate]}
        />
        <PremiumTrendCard
          title="Ek satış potansiyeli"
          value={formatCurrency(upsellValue)}
          detail="Paket yenileme ve bakım önerisi"
          points={[26, 38, 45, 60, 72, 84]}
          tone="gold"
        />
      </View>

      <View style={[styles.columns, isWide ? styles.columnsWide : null]}>
        <View style={styles.mainColumn}>
          <PanelCard title="Akıllı İçgörüler">
            <InsightCard
              icon="trending-up-outline"
              title="Lazer epilasyon öne çıkıyor"
              text="Seçili dönemde en yüksek hizmet geliri lazer epilasyon tarafında görünüyor. Paket yenileme teklifleri burada önceliklendirilebilir."
              tone="success"
            />
            <InsightCard
              icon="alert-circle-outline"
              title="Bekleyen ödeme takip edilmeli"
              text={`${formatCurrency(debt)} açık ödeme var. Borç hatırlatma mesajları manuel olarak gönderilebilir.`}
              tone="warning"
            />
            <InsightCard
              icon="people-outline"
              title="Personel yoğunluğu dengelenebilir"
              text="Elif en yoğun personel olarak görünüyor. Yeni randevularda uygun hizmetlerde Seda veya Nur önerilebilir."
            />
          </PanelCard>
          <PanelCard title="En Çok Kazandıran Hizmetler">
            {services.map((service) => (
              <SimpleBar
                key={service.name}
                label={service.name}
                value={formatCurrency(service.revenue)}
                percent={(service.revenue / maxServiceRevenue) * 100}
              />
            ))}
          </PanelCard>
          <PanelCard title="Personel Performansı">
            {staff.map((member) => (
              <SimpleBar
                key={member.name}
                label={member.name}
                value={formatCurrency(member.revenue)}
                percent={(member.revenue / maxStaffRevenue) * 100}
              />
            ))}
          </PanelCard>
        </View>
        <View style={styles.sideColumn}>
          <PanelCard title="Dikkat Gerekenler">
            <CompactRow title="Açık ödeme" subtitle="Borç hatırlatma mesajı gönder" badge={formatCurrency(debt)} />
            <CompactRow title="Gelmedi randevu" subtitle="Tekrar randevu için geri kazanım mesajı" badge="Takip" />
            <CompactRow title="Paket yenileme" subtitle="Son seansı kalan müşterilere teklif" badge="Fırsat" />
          </PanelCard>
          <PanelCard title="Dönem Özeti">
            <CompactRow title="En güçlü hizmet" subtitle="Lazer Epilasyon" badge={formatCurrency(17600)} />
            <CompactRow title="En yoğun personel" subtitle="Elif" badge="6 randevu" />
            <CompactRow title="Tahsilat yöntemi" subtitle="Kart ödemesi önde" badge="2 işlem" />
          </PanelCard>
        </View>
      </View>
    </View>
  );
}

function RevenueAdvisor({
  projectedRevenue,
  recoveryValue,
  upsellValue,
  debt
}: {
  projectedRevenue: number;
  recoveryValue: number;
  upsellValue: number;
  debt: number;
}) {
  return (
    <View style={styles.advisor}>
      <View style={styles.advisorHeader}>
        <AnimatedText style={styles.advisorKicker}>Gelir danışmanı</AnimatedText>
        <AnimatedText delay={90} style={styles.advisorTitle}>Bu ayın büyüme planı</AnimatedText>
        <Text style={styles.advisorCopy}>
          Tahsilat, kayıp randevu ve ek satış fırsatları tek planda toplandı.
        </Text>
      </View>
      <View style={styles.advisorGrid}>
        <AdvisorStep label="Tahmini ciro" value={projectedRevenue} detail="Tahsilat ve açık bakiye toplamı" />
        <AdvisorStep label="Geri kazanım" value={recoveryValue} detail="Gelmedi/iptal randevu potansiyeli" />
        <AdvisorStep label="Ek satış" value={upsellValue} detail="Paket yenileme ve bakım önerisi" />
        <AdvisorStep label="Tahsilat hedefi" value={debt} detail="WhatsApp hatırlatma listesi" warning />
      </View>
    </View>
  );
}

function AdvisorStep({
  label,
  value,
  detail,
  warning
}: {
  label: string;
  value: number;
  detail: string;
  warning?: boolean;
}) {
  return (
    <View style={styles.advisorStep}>
      <View style={[styles.stepLine, warning ? styles.stepLineWarning : null]} />
      <Text style={styles.stepLabel}>{label}</Text>
      <AnimatedNumber value={value} currency style={styles.stepValue} />
      <Text style={styles.stepDetail}>{detail}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionGap: {
    gap: 16
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12
  },
  trendGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12
  },
  advisor: {
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.sage,
    backgroundColor: colors.ink,
    padding: 16,
    gap: 14
  },
  advisorHeader: {
    gap: 5
  },
  advisorKicker: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  advisorTitle: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "800"
  },
  advisorCopy: {
    color: "#d9d2c5",
    lineHeight: 20
  },
  advisorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  advisorStep: {
    flex: 1,
    minWidth: 160,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: "#5e6654",
    backgroundColor: "#332d26",
    padding: 12
  },
  stepLine: {
    width: 44,
    height: 3,
    borderRadius: 3,
    backgroundColor: colors.gold,
    marginBottom: 10
  },
  stepLineWarning: {
    backgroundColor: colors.accent
  },
  stepLabel: {
    color: "#d9d2c5",
    fontWeight: "800"
  },
  stepValue: {
    color: colors.white,
    fontSize: 21,
    fontWeight: "800",
    marginTop: 5
  },
  stepDetail: {
    color: "#c9c0b2",
    marginTop: 4,
    lineHeight: 18
  },
  columns: {
    gap: 14
  },
  columnsWide: {
    flexDirection: "row",
    alignItems: "flex-start"
  },
  mainColumn: {
    flex: 1.5,
    gap: 14
  },
  sideColumn: {
    flex: 1,
    gap: 14
  }
});
