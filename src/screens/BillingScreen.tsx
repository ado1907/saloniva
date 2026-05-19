import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { ActionButton } from "../components/ActionButton";
import { CompactRow } from "../components/CompactRow";
import { PanelCard } from "../components/PanelCard";
import { ScreenIntro } from "../components/ScreenIntro";
import { productConfig } from "../config/productConfig";
import { billingWebhookEvents, checkoutContracts, licenseAccessRules } from "../services/subscriptionGateway";
import { colors } from "../theme/colors";
import { radius } from "../theme/spacing";

export function BillingScreen() {
  return (
    <View style={styles.sectionGap}>
      <ScreenIntro
        title="Premium Planlar"
        description="Saloniva, salon sahipleri icin Free, Pro ve Business planlariyla gelir uretebilen store-ready SaaS modeline hazirlandi."
      />

      <View style={styles.hero}>
        <View style={styles.heroIcon}>
          <Ionicons name="sparkles-outline" size={30} color={colors.gold} />
        </View>
        <View style={styles.heroText}>
          <Text style={styles.kicker}>Subscription ready</Text>
          <Text style={styles.heroTitle}>Satilabilir abonelik modeli</Text>
          <Text style={styles.heroCopy}>
            Planlar, demo ekraninda net fiyat ve deger vaadiyle gorunur. Gercek odeme altyapisi baglandiginda checkout ve lisans kurallari hazir akisa oturur.
          </Text>
        </View>
      </View>

      <View style={styles.planGrid}>
        {productConfig.plans.map((plan, index) => (
          <View key={plan.id} style={[styles.planCard, index === 1 ? styles.featuredPlan : null]}>
            <Text style={styles.planLabel}>{index === 1 ? "En cok satilan" : "Plan"}</Text>
            <Text style={styles.planTitle}>{plan.name}</Text>
            <Text style={styles.planPrice}>{plan.price}</Text>
            <Text style={styles.planDescription}>{plan.description}</Text>
            <View style={styles.featureList}>
              {plan.features.map((feature) => (
                <View key={feature} style={styles.featureRow}>
                  <Ionicons name="checkmark-circle" size={16} color={index === 1 ? colors.gold : colors.accent} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.planLimits}>{plan.limits}</Text>
            <ActionButton
              icon={index === 1 ? "sparkles-outline" : "checkmark-circle-outline"}
              label={index === 1 ? "Pro Plani One Cikar" : "Plani Incele"}
              primary={index === 1}
            />
          </View>
        ))}
      </View>

      <View style={styles.columns}>
        <PanelCard title="Odeme Altyapisi Yol Haritasi" style={styles.columnCard}>
          <CompactRow title="Web kart odemesi" subtitle="Iyzico veya Stripe ile aylik/yillik abonelik baslatilir." badge="Sirada" />
          <CompactRow title="Mobil magaza kurallari" subtitle="iOS ve Android abonelik modeli App Store / Play Store politikalarina gore netlesir." badge="Kritik" />
          <CompactRow title="Fatura ve lisans" subtitle="Odeme basarisizligi, deneme bitisi ve plan degisikligi lisansa baglanir." badge="Sirada" />
        </PanelCard>
        <PanelCard title="Demo Lisans Senaryosu" style={styles.columnCard}>
          <CompactRow title="Demo plan" subtitle="Pro plan, musteri demosu ve magaza incelemesi icin aktif gosterilir." badge="Demo" />
          <CompactRow title="Deneme suresi" subtitle={`Deneme bitisi: ${productConfig.demoAccount.trialEndsAt}`} badge="Aktif" />
          <CompactRow title="Yetki kapsami" subtitle={productConfig.demoAccount.permissions.join(", ")} badge={`${productConfig.demoAccount.permissions.length} yetki`} />
        </PanelCard>
      </View>

      <View style={styles.columns}>
        <PanelCard title="Checkout Sozlesmesi" style={styles.columnCard}>
          {checkoutContracts.map((contract) => (
            <CompactRow
              key={contract.planId}
              title={`${contract.planName} - ${contract.price}`}
              subtitle={`${contract.checkoutPath} -> ${contract.successRedirect}`}
              badge="Hazir"
            />
          ))}
        </PanelCard>
        <PanelCard title="Webhook ve Lisans Kurallari" style={styles.columnCard}>
          {billingWebhookEvents.map((item) => (
            <CompactRow key={item.event} title={item.event} subtitle={item.action} badge="Webhook" />
          ))}
          <CompactRow title="Past due kurali" subtitle={licenseAccessRules.past_due} badge="Lisans" />
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
    borderColor: "rgba(246, 229, 196, 0.26)",
    backgroundColor: colors.ink,
    padding: 18,
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
    shadowColor: "#000000",
    shadowOpacity: 0.22,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 4
  },
  heroIcon: {
    width: 60,
    height: 60,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: "rgba(246, 229, 196, 0.34)",
    backgroundColor: colors.inkPanel,
    alignItems: "center",
    justifyContent: "center"
  },
  heroText: {
    flex: 1,
    minWidth: 220
  },
  kicker: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  heroTitle: {
    color: colors.white,
    fontSize: 25,
    fontWeight: "900",
    marginTop: 5
  },
  heroCopy: {
    color: "#E8DDCA",
    marginTop: 6,
    lineHeight: 21
  },
  planGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14
  },
  planCard: {
    flex: 1,
    minWidth: 230,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    padding: 16,
    gap: 10,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3
  },
  featuredPlan: {
    borderColor: colors.gold,
    backgroundColor: colors.ink
  },
  planLabel: {
    color: colors.champagne,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  planTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "900"
  },
  planPrice: {
    color: colors.accent,
    fontSize: 26,
    fontWeight: "900"
  },
  planDescription: {
    color: colors.muted,
    lineHeight: 20
  },
  featureList: {
    gap: 7
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7
  },
  featureText: {
    color: colors.mutedDark,
    fontWeight: "700",
    flex: 1
  },
  planLimits: {
    color: colors.mutedDark,
    fontWeight: "800",
    lineHeight: 20
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