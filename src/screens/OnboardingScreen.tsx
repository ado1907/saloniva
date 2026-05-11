import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { CompactRow } from "../components/CompactRow";
import { PanelCard } from "../components/PanelCard";
import { ScreenIntro } from "../components/ScreenIntro";
import { useSalonStore } from "../state/SalonStore";
import { colors } from "../theme/colors";
import { radius } from "../theme/spacing";
import type { SalonAccount } from "../types";

type Props = {
  account: SalonAccount;
};

const setupSteps = [
  {
    title: "Salon profili",
    description: "Salon adı, yetkili, rol ve lisans bilgisi hazır.",
    icon: "business-outline",
    status: "Hazır"
  },
  {
    title: "Hizmet ve fiyat listesi",
    description: "Aktif hizmetler, süreler, kategoriler ve fiyatlar tanımlanır.",
    icon: "pricetags-outline",
    status: "Hazır"
  },
  {
    title: "Personel ve yetkinlik",
    description: "Personel hizmetleri, günlük yoğunluk ve performans görünür.",
    icon: "person-circle-outline",
    status: "Hazır"
  },
  {
    title: "Müşteri vitrini",
    description: "Salon vitrini, online randevu ve satış fırsatı hattı bağlanır.",
    icon: "sparkles-outline",
    status: "Hazır"
  },
  {
    title: "Ödeme ve abonelik",
    description: "Plan seçimi ve lisans durumu gösterilir; ödeme sağlayıcısı sıradaki üretim adımıdır.",
    icon: "card-outline",
    status: "Demo"
  },
  {
    title: "Mağaza hazırlığı",
    description: "Gizlilik, destek, hesap silme, ekran görüntüleri ve build süreci kontrol edilir.",
    icon: "rocket-outline",
    status: "Sırada"
  }
] as const;

export function OnboardingScreen({ account }: Props) {
  const { bookingRequests, customers, salonServices, staffMembers } = useSalonStore();
  const completedSteps = setupSteps.filter((step) => step.status === "Hazır").length;
  const progress = Math.round((completedSteps / setupSteps.length) * 100);

  return (
    <View style={styles.sectionGap}>
      <ScreenIntro
        title="Kurulum Sihirbazı"
        description="Yeni bir salonun satışa hazır hale gelmesi için profil, hizmetler, personel, vitrin, ödeme ve mağaza adımlarını sırayla takip edin."
      />

      <View style={styles.hero}>
        <View style={styles.progressRing}>
          <Text style={styles.progressValue}>%{progress}</Text>
          <Text style={styles.progressLabel}>kurulum</Text>
        </View>
        <View style={styles.heroText}>
          <Text style={styles.kicker}>Salon onboarding</Text>
          <Text style={styles.heroTitle}>{account.salonName}</Text>
          <Text style={styles.heroCopy}>
            {account.ownerName} için demo hesap hazır. Sıradaki üretim hedefi gerçek onboarding, ödeme sağlayıcısı ve bulut veri bağlantısı.
          </Text>
        </View>
      </View>

      <View style={styles.metrics}>
        <Metric label="Müşteri" value={`${customers.length}`} />
        <Metric label="Hizmet" value={`${salonServices.filter((item) => item.active).length}`} />
        <Metric label="Personel" value={`${staffMembers.filter((item) => item.active).length}`} />
        <Metric label="Talep" value={`${bookingRequests.length}`} />
      </View>

      <PanelCard title="Kurulum Adımları">
        {setupSteps.map((step, index) => (
          <View key={step.title} style={styles.stepCard}>
            <View style={styles.stepIcon}>
              <Ionicons name={step.icon} size={20} color={colors.sage} />
            </View>
            <View style={styles.stepText}>
              <Text style={styles.stepIndex}>Adım {index + 1}</Text>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepDescription}>{step.description}</Text>
            </View>
            <Text style={styles.stepStatus}>{step.status}</Text>
          </View>
        ))}
      </PanelCard>

      <View style={styles.columns}>
        <PanelCard title="Canlı Demo Kontrolü" style={styles.columnCard}>
          <CompactRow title="İlk randevu akışı" subtitle="Yeni randevu oluşturup takvimde görünecek." badge="Hazır" />
          <CompactRow title="İlk satış fırsatı" subtitle="Salon Vitrini üzerinden talep oluşturup fırsata düşecek." badge="Hazır" />
          <CompactRow title="İlk tahsilat" subtitle="Ödeme al ekranından müşteri borcu güncellenecek." badge="Hazır" />
        </PanelCard>

        <PanelCard title="Gerçek Ürün İçin Sıradaki Kurulum" style={styles.columnCard}>
          <CompactRow title="Salon kurulum formu" subtitle="Logo, adres, sosyal medya, çalışma saatleri ve hizmet kategorileri alınmalı." badge="Sırada" />
          <CompactRow title="Veri içe aktarma" subtitle="Eski müşteri listesi Excel/CSV ile aktarılmalı." badge="Sırada" />
          <CompactRow title="Eğitim turu" subtitle="İlk girişte panel, takvim ve ödeme ekranları kısa turla anlatılmalı." badge="Sırada" />
        </PanelCard>
      </View>
    </View>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
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
    padding: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    alignItems: "center"
  },
  progressRing: {
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 2,
    borderColor: colors.sage,
    backgroundColor: "#332d26",
    alignItems: "center",
    justifyContent: "center"
  },
  progressValue: {
    color: colors.white,
    fontSize: 26,
    fontWeight: "700"
  },
  progressLabel: {
    color: "#d9d2c5",
    fontWeight: "700",
    marginTop: 2
  },
  heroText: {
    flex: 1,
    minWidth: 240
  },
  kicker: {
    color: colors.sageSoft,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase"
  },
  heroTitle: {
    color: colors.white,
    fontSize: 25,
    fontWeight: "700",
    marginTop: 5
  },
  heroCopy: {
    color: "#d9d2c5",
    marginTop: 6,
    lineHeight: 21
  },
  metrics: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12
  },
  metricCard: {
    flex: 1,
    minWidth: 140,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 14
  },
  metricValue: {
    color: colors.text,
    fontSize: 23,
    fontWeight: "700"
  },
  metricLabel: {
    color: colors.muted,
    fontWeight: "700",
    marginTop: 4
  },
  stepCard: {
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.softBorder,
    backgroundColor: colors.card,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.sageSoft,
    alignItems: "center",
    justifyContent: "center"
  },
  stepText: {
    flex: 1
  },
  stepIndex: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase"
  },
  stepTitle: {
    color: colors.text,
    fontWeight: "700",
    fontSize: 16,
    marginTop: 3
  },
  stepDescription: {
    color: colors.muted,
    lineHeight: 19,
    marginTop: 3
  },
  stepStatus: {
    color: colors.accent,
    fontWeight: "700"
  },
  columns: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14
  },
  columnCard: {
    flex: 1,
    minWidth: 280
  }
});
