import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { CompactRow } from "../components/CompactRow";
import { PanelCard } from "../components/PanelCard";
import { ScreenIntro } from "../components/ScreenIntro";
import { launchScore, launchSections } from "../config/launchReadiness";
import { productConfig } from "../config/productConfig";
import { apiContracts, apiReadinessChecklist } from "../services/apiContracts";
import { backendGatewayPlan } from "../services/backendGateway";
import { colors } from "../theme/colors";
import { radius } from "../theme/spacing";

export function LaunchReadinessScreen() {
  return (
    <View style={styles.sectionGap}>
      <ScreenIntro
        title="Satışa Çıkış Merkezi"
        description="Saloniva'yı gerçek müşteriye satılabilir ürüne dönüştürmek için backend, ödeme, mağaza, test ve güvenlik eksiklerini sırayla takip edin."
      />

      <View style={styles.hero}>
        <View style={styles.scoreRing}>
          <Text style={styles.scoreValue}>%{launchScore}</Text>
          <Text style={styles.scoreLabel}>hazırlık</Text>
        </View>
        <View style={styles.heroText}>
          <Text style={styles.kicker}>Commercial release</Text>
          <Text style={styles.heroTitle}>Demo güçlü, satış için altyapı sırada</Text>
          <Text style={styles.heroCopy}>
            Görsel ürün ve salon akışları pazarlanabilir seviyede. Gerçek satış için en kritik adım güvenli backend,
            abonelik ve mağaza yayın hattı.
          </Text>
        </View>
      </View>

      <View style={styles.columns}>
        {launchSections.map((section) => (
          <PanelCard key={section.title} title={section.title} style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.iconBox}>
                <Ionicons name={section.icon} size={20} color={colors.gold} />
              </View>
              <View style={styles.sectionText}>
                <Text style={styles.sectionSummary}>{section.summary}</Text>
                <View style={styles.track}>
                  <View style={[styles.fill, { width: `${section.score}%` }]} />
                </View>
              </View>
              <Text style={styles.sectionScore}>%{section.score}</Text>
            </View>
            {section.tasks.map((task) => (
              <CompactRow
                key={task.title}
                title={task.title}
                subtitle={task.description}
                badge={task.status}
              />
            ))}
          </PanelCard>
        ))}
      </View>

      <PanelCard title="Sıradaki Kodlama Önceliği">
        <CompactRow
          title="Backend bağlantı katmanı"
          subtitle="Demo veriyi bozmadan ileride Supabase/Firebase/API'ye bağlanabilecek servis arayüzü hazırlanacak."
          badge="1. adım"
        />
        <CompactRow
          title="Gerçek giriş ve rol yapısı"
          subtitle="Salon sahibi, yönetici ve personel rolleri sunucu tarafı yetki kontrolüne hazırlanacak."
          badge="2. adım"
        />
        <CompactRow
          title="Abonelik ve lisans ekranı"
          subtitle="Ücretsiz deneme, plan seçimi ve ödeme durumunu gösterecek ürün akışı eklendi; ödeme sağlayıcısı sırada."
          badge="Hazır"
        />
      </PanelCard>

      <View style={styles.columns}>
        <PanelCard title="Backend Geçiş Planı" style={styles.sectionCard}>
          {backendGatewayPlan.map((item, index) => (
            <CompactRow key={item} title={`${index + 1}. adım`} subtitle={item} badge={index === 0 ? "Mevcut" : "Sırada"} />
          ))}
        </PanelCard>
        <PanelCard title="Satış Planları" style={styles.sectionCard}>
          {productConfig.plans.map((plan) => (
            <CompactRow key={plan.id} title={`${plan.name} • ${plan.price}`} subtitle={`${plan.description} ${plan.limits}`} badge="Plan" />
          ))}
        </PanelCard>
      </View>

      <PanelCard title="Demo Hesap ve Lisans">
        <CompactRow title="Demo salon" subtitle={productConfig.demoAccount.salonId} badge={productConfig.demoAccount.subscriptionStatus} />
        <CompactRow title="Aktif demo planı" subtitle="Mağaza incelemesi ve müşteri demosu için Profesyonel plan gösterilir." badge={productConfig.demoAccount.planId} />
        <CompactRow title="Demo yetkileri" subtitle={productConfig.demoAccount.permissions.join(", ")} badge={`${productConfig.demoAccount.permissions.length} yetki`} />
      </PanelCard>

      <View style={styles.columns}>
        <PanelCard title="API Sözleşmeleri" style={styles.sectionCard}>
          {apiContracts.slice(0, 5).map((endpoint) => (
            <CompactRow
              key={`${endpoint.method}-${endpoint.path}`}
              title={`${endpoint.method} ${endpoint.path}`}
              subtitle={endpoint.description}
              badge={endpoint.protection}
            />
          ))}
        </PanelCard>
        <PanelCard title="API Güvenlik Kontrolü" style={styles.sectionCard}>
          {apiReadinessChecklist.map((item, index) => (
            <CompactRow key={item} title={`${index + 1}. kontrol`} subtitle={item} badge="API" />
          ))}
        </PanelCard>
      </View>
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
    alignItems: "center",
    gap: 16
  },
  scoreRing: {
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 2,
    borderColor: colors.sage,
    backgroundColor: "#332d26",
    alignItems: "center",
    justifyContent: "center"
  },
  scoreValue: {
    color: colors.white,
    fontSize: 26,
    fontWeight: "800"
  },
  scoreLabel: {
    color: "#d9d2c5",
    fontWeight: "800",
    marginTop: 2
  },
  heroText: {
    flex: 1,
    minWidth: 240
  },
  kicker: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  heroTitle: {
    color: colors.white,
    fontSize: 23,
    fontWeight: "800",
    marginTop: 5
  },
  heroCopy: {
    color: "#d9d2c5",
    marginTop: 6,
    lineHeight: 20
  },
  columns: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    alignItems: "flex-start"
  },
  sectionCard: {
    flex: 1,
    minWidth: 300
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 2
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.sage,
    backgroundColor: colors.ink,
    alignItems: "center",
    justifyContent: "center"
  },
  sectionText: {
    flex: 1,
    gap: 8
  },
  sectionSummary: {
    color: colors.muted,
    lineHeight: 19
  },
  sectionScore: {
    color: colors.accent,
    fontWeight: "800",
    fontSize: 16
  },
  track: {
    height: 7,
    borderRadius: 7,
    backgroundColor: colors.mutedSurface,
    overflow: "hidden"
  },
  fill: {
    height: "100%",
    borderRadius: 7,
    backgroundColor: colors.gold
  }
});
