import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { CompactRow } from "../components/CompactRow";
import { PanelCard } from "../components/PanelCard";
import { ScreenIntro } from "../components/ScreenIntro";
import { productionReadinessPhases, productionReadinessScore } from "../config/productionReadiness";
import { legalLaunchLinks, storeAssetChecklist } from "../config/storeLaunchAssets";
import { authGatewayPlan } from "../services/authGateway";
import { cloudDatabaseTables, tenantIsolationRules } from "../services/cloudDatabasePlan";
import { billingReadinessPlan, checkoutContracts } from "../services/subscriptionGateway";
import { productionTestScenarios } from "../qa/productionTestScenarios";
import { colors } from "../theme/colors";
import { radius } from "../theme/spacing";

export function ProductionReadinessScreen() {
  return (
    <View style={styles.sectionGap}>
      <ScreenIntro
        title="Canlı Ürün Hazırlığı"
        description="Saloniva'yı demo üründen para alınabilir gerçek SaaS ürüne taşımak için backend, tenant, ödeme, mağaza, hukuki linkler ve test adımları."
      />

      <View style={styles.hero}>
        <View style={styles.scoreRing}>
          <Text style={styles.scoreValue}>%{productionReadinessScore}</Text>
          <Text style={styles.scoreLabel}>canlı hazırlık</Text>
        </View>
        <View style={styles.heroText}>
          <Text style={styles.kicker}>Production launch agents</Text>
          <Text style={styles.heroTitle}>Demo satılabilir, canlı ürün için altyapı sırada</Text>
          <Text style={styles.heroCopy}>
            Ajanlar artık gerçek satış öncesi eksikleri sıraya bağladı. Önce backend ve tenant güvenliği, sonra ödeme, mağaza ve test hattı tamamlanacak.
          </Text>
        </View>
      </View>

      <PanelCard title="Sıralı Ajan Planı">
        {productionReadinessPhases.map((phase, index) => (
          <View key={phase.title} style={styles.phaseCard}>
            <View style={styles.phaseHeader}>
              <View style={styles.phaseIcon}>
                <Text style={styles.phaseStep}>{index + 1}</Text>
              </View>
              <View style={styles.phaseText}>
                <Text style={styles.phaseTitle}>{phase.title}</Text>
                <Text style={styles.phaseAgent}>{phase.agent}</Text>
              </View>
              <Text style={[styles.status, phase.status === "Kritik" ? styles.critical : null]}>{phase.status}</Text>
            </View>
            <Text style={styles.phaseSummary}>{phase.summary}</Text>
            <Text style={styles.nextAction}>{phase.nextAction}</Text>
          </View>
        ))}
      </PanelCard>

      <View style={styles.columns}>
        <PanelCard title="Gerçek Giriş ve Bulut Veri" style={styles.columnCard}>
          {authGatewayPlan.map((item) => (
            <CompactRow key={item.title} title={item.title} subtitle={item.description} badge={item.status} />
          ))}
        </PanelCard>
        <PanelCard title="Salon Tenant Ayrımı" style={styles.columnCard}>
          {tenantIsolationRules.map((rule, index) => (
            <CompactRow key={rule} title={`${index + 1}. kural`} subtitle={rule} badge="Tenant" />
          ))}
        </PanelCard>
      </View>

      <View style={styles.columns}>
        <PanelCard title="Bulut Veritabanı Şeması" style={styles.columnCard}>
          {cloudDatabaseTables.map((table) => (
            <CompactRow
              key={table.table}
              title={table.table}
              subtitle={`${table.purpose} ${table.tenantRule}`}
              badge={table.sensitive ? "Hassas" : "Standart"}
            />
          ))}
        </PanelCard>
        <PanelCard title="Abonelik ve Ödeme" style={styles.columnCard}>
          {billingReadinessPlan.map((item) => (
            <CompactRow key={item.title} title={item.title} subtitle={item.description} badge={item.status} />
          ))}
        </PanelCard>
      </View>

      <View style={styles.columns}>
        <PanelCard title="Checkout Sözleşmeleri" style={styles.columnCard}>
          {checkoutContracts.map((contract) => (
            <CompactRow
              key={contract.planId}
              title={`${contract.planName} • ${contract.price}`}
              subtitle={contract.licenseRule}
              badge="Checkout"
            />
          ))}
        </PanelCard>
        <PanelCard title="Mağaza Varlıkları" style={styles.columnCard}>
          {storeAssetChecklist.map((item) => (
            <CompactRow key={item.title} title={item.title} subtitle={item.description} badge={item.status} />
          ))}
        </PanelCard>
      </View>

      <View style={styles.columns}>
        <PanelCard title="Hukuki ve Destek Linkleri" style={styles.columnCard}>
          {legalLaunchLinks.map((link) => (
            <CompactRow key={link.title} title={link.title} subtitle={link.url} badge={link.status} />
          ))}
        </PanelCard>
        <PanelCard title="Gerçek Test Senaryoları" style={styles.columnCard}>
          {productionTestScenarios.map((test) => (
            <CompactRow key={test.area} title={test.area} subtitle={`${test.scenario} Kabul: ${test.acceptance}`} badge="Test" />
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
    width: 108,
    height: 108,
    borderRadius: 54,
    borderWidth: 2,
    borderColor: colors.sage,
    backgroundColor: "#302b22",
    alignItems: "center",
    justifyContent: "center"
  },
  scoreValue: {
    color: colors.white,
    fontSize: 26,
    fontWeight: "800"
  },
  scoreLabel: {
    color: colors.goldSoft,
    fontWeight: "800",
    marginTop: 2
  },
  heroText: {
    flex: 1,
    minWidth: 240
  },
  kicker: {
    color: colors.goldSoft,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  heroTitle: {
    color: colors.white,
    fontSize: 24,
    fontWeight: "800",
    marginTop: 5
  },
  heroCopy: {
    color: "#f3ead8",
    marginTop: 6,
    lineHeight: 21
  },
  phaseCard: {
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.softBorder,
    backgroundColor: colors.card,
    padding: 12,
    gap: 8
  },
  phaseHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  phaseIcon: {
    width: 38,
    height: 38,
    borderRadius: radius.sm,
    backgroundColor: colors.sageSoft,
    alignItems: "center",
    justifyContent: "center"
  },
  phaseStep: {
    color: colors.accent,
    fontWeight: "800"
  },
  phaseText: {
    flex: 1
  },
  phaseTitle: {
    color: colors.text,
    fontWeight: "800",
    fontSize: 16
  },
  phaseAgent: {
    color: colors.muted,
    fontWeight: "700",
    marginTop: 3
  },
  status: {
    color: colors.accent,
    fontWeight: "800"
  },
  critical: {
    color: colors.danger
  },
  phaseSummary: {
    color: colors.mutedDark,
    lineHeight: 20
  },
  nextAction: {
    color: colors.muted,
    fontWeight: "700",
    lineHeight: 19
  },
  columns: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    alignItems: "flex-start"
  },
  columnCard: {
    flex: 1,
    minWidth: 300
  }
});
