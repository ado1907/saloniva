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
        title="Abonelik ve Ödeme"
        description="Saloniva'nın satışa çıkış modeli: plan seçimi, deneme süresi, lisans durumu ve ödeme hazırlığı."
      />

      <View style={styles.hero}>
        <View style={styles.heroIcon}>
          <Ionicons name="card-outline" size={30} color={colors.gold} />
        </View>
        <View style={styles.heroText}>
          <Text style={styles.kicker}>Revenue system</Text>
          <Text style={styles.heroTitle}>Ürünün para kazanma akışı</Text>
          <Text style={styles.heroCopy}>
            Planlar uygulama içinde netleşti. Sonraki üretim adımı gerçek ödeme sağlayıcısı ve lisans kontrolünü bağlamak.
          </Text>
        </View>
      </View>

      <View style={styles.planGrid}>
        {productConfig.plans.map((plan, index) => (
          <View key={plan.id} style={[styles.planCard, index === 1 ? styles.featuredPlan : null]}>
            <Text style={styles.planLabel}>{index === 1 ? "Önerilen" : "Plan"}</Text>
            <Text style={styles.planTitle}>{plan.name}</Text>
            <Text style={styles.planPrice}>{plan.price}</Text>
            <Text style={styles.planDescription}>{plan.description}</Text>
            <Text style={styles.planLimits}>{plan.limits}</Text>
            <ActionButton
              icon={index === 1 ? "sparkles-outline" : "checkmark-circle-outline"}
              label={index === 1 ? "Bu Planı Öne Çıkar" : "Planı İncele"}
              primary={index === 1}
            />
          </View>
        ))}
      </View>

      <View style={styles.columns}>
        <PanelCard title="Ödeme Altyapısı Yol Haritası" style={styles.columnCard}>
          <CompactRow title="Web kart ödemesi" subtitle="İyzico/Stripe benzeri sağlayıcıyla aylık abonelik başlatılır." badge="Sırada" />
          <CompactRow title="Mobil mağaza kuralları" subtitle="iOS/Android abonelik modelinde mağaza politikaları kontrol edilir." badge="Kritik" />
          <CompactRow title="Fatura ve lisans" subtitle="Ödeme başarısızlığı, deneme bitişi ve plan değişikliği lisansa bağlanır." badge="Sırada" />
        </PanelCard>
        <PanelCard title="Demo Lisans Senaryosu" style={styles.columnCard}>
          <CompactRow title="Demo plan" subtitle="Profesyonel plan mağaza incelemesi ve müşteri demosu için aktif gösterilir." badge="Demo" />
          <CompactRow title="Deneme süresi" subtitle={`Deneme bitişi: ${productConfig.demoAccount.trialEndsAt}`} badge="Aktif" />
          <CompactRow title="Yetki kapsamı" subtitle={productConfig.demoAccount.permissions.join(", ")} badge={`${productConfig.demoAccount.permissions.length} yetki`} />
        </PanelCard>
      </View>

      <View style={styles.columns}>
        <PanelCard title="Checkout Sözleşmesi" style={styles.columnCard}>
          {checkoutContracts.map((contract) => (
            <CompactRow
              key={contract.planId}
              title={`${contract.planName} - ${contract.price}`}
              subtitle={`${contract.checkoutPath} -> ${contract.successRedirect}`}
              badge="Hazır"
            />
          ))}
        </PanelCard>
        <PanelCard title="Webhook ve Lisans Kuralları" style={styles.columnCard}>
          {billingWebhookEvents.map((item) => (
            <CompactRow key={item.event} title={item.event} subtitle={item.action} badge="Webhook" />
          ))}
          <CompactRow title="Past due kuralı" subtitle={licenseAccessRules.past_due} badge="Lisans" />
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
    gap: 14,
    alignItems: "center"
  },
  heroIcon: {
    width: 58,
    height: 58,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.sage,
    backgroundColor: "#332d26",
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
    backgroundColor: colors.surface,
    padding: 16,
    gap: 10
  },
  featuredPlan: {
    borderColor: colors.gold,
    backgroundColor: colors.goldSoft
  },
  planLabel: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  planTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "800"
  },
  planPrice: {
    color: colors.accent,
    fontSize: 24,
    fontWeight: "800"
  },
  planDescription: {
    color: colors.muted,
    lineHeight: 20
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
