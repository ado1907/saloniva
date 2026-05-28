import { useEffect, useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { ActionButton } from "../components/ActionButton";
import { CompactRow } from "../components/CompactRow";
import { PanelCard } from "../components/PanelCard";
import { ScreenIntro } from "../components/ScreenIntro";
import { productConfig } from "../config/productConfig";
import { getSalonSubscriptionStatus, type SalonSubscriptionStatus } from "../services/subscriptionGateway";
import { colors } from "../theme/colors";
import { radius } from "../theme/spacing";
import type { SalonAccount, TabKey } from "../types";

type Props = {
  account: SalonAccount;
  accessToken?: string;
  isCloudSession?: boolean;
  onNavigate?: (tab: TabKey) => void;
};

export function BillingScreen({ account, accessToken, isCloudSession = false, onNavigate }: Props) {
  const { width } = useWindowDimensions();
  const isCompact = width < 680;
  const fallbackSubscription = useMemo(() => buildFallbackSubscription(account), [account]);
  const [subscription, setSubscription] = useState<SalonSubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(isCloudSession);
  const [error, setError] = useState<string | null>(null);
  const activeSubscription = subscription ?? fallbackSubscription;
  const statusCopy = getStatusCopy(activeSubscription);

  useEffect(() => {
    let mounted = true;

    if (!isCloudSession) {
      setSubscription(null);
      setLoading(false);
      setError(null);
      return () => {
        mounted = false;
      };
    }

    setLoading(true);
    setError(null);

    void getSalonSubscriptionStatus(account.salonId, accessToken)
      .then((status) => {
        if (!mounted) {
          return;
        }

        setSubscription(status);

        if (!status) {
          setError("Bu salon icin abonelik kaydi bulunamadi. Supabase phase3 migration ve backfill adimini kontrol edin.");
        }
      })
      .catch(() => {
        if (!mounted) {
          return;
        }

        setSubscription(null);
        setError("Canli plan durumu alinamadi. Oturum veya Supabase RLS ayarlarini kontrol edin.");
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [accessToken, account.salonId, isCloudSession]);

  const limitRows = [
    {
      title: "Personel limiti",
      subtitle: "Ekibiniz icin tanimli kullanici kapasitesi",
      current: activeSubscription.current_staff_count,
      limit: activeSubscription.staff_limit
    },
    {
      title: "Musteri limiti",
      subtitle: "Salon hafizasinda tutulabilecek musteri sayisi",
      current: activeSubscription.current_customer_count,
      limit: activeSubscription.customer_limit
    },
    {
      title: "Aylik randevu limiti",
      subtitle: "Bu ay olusturulan randevu kapasitesi",
      current: activeSubscription.current_month_appointment_count,
      limit: activeSubscription.monthly_appointment_limit
    }
  ];

  return (
    <View style={styles.sectionGap}>
      <ScreenIntro
        title="Premium Planlar"
        description="Saloniva plan durumunu canli Supabase abonelik altyapisindan okur. Mobil uygulamada odeme alinmaz; plan talepleri satis ekibiyle yonlendirilir."
      />

      <View style={styles.hero}>
        <View style={styles.heroIcon}>
          <Ionicons name="sparkles-outline" size={30} color={colors.gold} />
        </View>
        <View style={styles.heroText}>
          <Text style={styles.kicker}>Plan durumu</Text>
          <Text style={styles.heroTitle}>{activeSubscription.plan_name}</Text>
          <Text style={styles.heroCopy}>{statusCopy.description}</Text>
        </View>
        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeText}>{statusCopy.label}</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.statusText}>
          <ActivityIndicator color={colors.accent} />
          <Text style={styles.statusTextCopy}>Canli abonelik durumu aliniyor...</Text>
        </View>
      ) : null}

      {error ? <Text style={[styles.statusText, styles.warningText]}>{error}</Text> : null}

      <PanelCard title="Mevcut Plan Ozeti">
        <View style={styles.statusGrid}>
          <StatusTile label="Durum" value={statusCopy.label} />
          <StatusTile label="Deneme" value={activeSubscription.is_in_trial ? "Aktif" : "Kapali"} />
          <StatusTile label="Ek sure" value={activeSubscription.is_in_grace ? "Aktif" : "Yok"} />
          <StatusTile label="Admin onayi" value={isDateInFuture(activeSubscription.admin_override_until) ? "Aktif" : "Yok"} />
        </View>
        <CompactRow
          title="Kayit olusturma"
          subtitle={activeSubscription.can_create_records ? "Planiniz yeni kayit olusturmaya izin veriyor." : "Plan pasif oldugu icin yeni kayit olusturma kisitlanabilir."}
          badge={activeSubscription.can_create_records ? "Acik" : "Kisitli"}
        />
        <CompactRow title="Donem bitisi" subtitle={formatDate(activeSubscription.current_period_end) ?? "Donem tarihi tanimli degil"} badge={activeSubscription.provider} />
        <CompactRow title="Trial / grace / override" subtitle={buildSpecialWindowCopy(activeSubscription)} badge="Kontrol" />
      </PanelCard>

      <PanelCard title="Plan Limitleri">
        {limitRows.map((item) => (
          <View key={item.title} style={styles.limitRow}>
            <View style={styles.limitText}>
              <Text style={styles.limitTitle}>{item.title}</Text>
              <Text style={styles.limitSubtitle}>{item.subtitle}</Text>
            </View>
            <Text style={styles.limitValue}>{formatLimit(item.current, item.limit)}</Text>
          </View>
        ))}
      </PanelCard>

      <View style={[styles.ctaCard, isCompact ? styles.ctaCardCompact : null]}>
        <View style={styles.ctaText}>
          <Text style={styles.ctaTitle}>Plan degisikligi icin satis ekibiyle gorusun</Text>
          <Text style={styles.ctaCopy}>
            Store politikalarina uygun kalmak icin uygulama icinde kart veya abonelik odemesi alinmaz. Teklif ve kurulum akisi satis ekibi uzerinden ilerler.
          </Text>
        </View>
        <View style={styles.ctaActions}>
          <ActionButton icon="chatbox-ellipses-outline" label="Demo / Satis Ekibi" primary onPress={() => onNavigate?.("pilot")} />
          <ActionButton icon="settings-outline" label="Ayarlar" onPress={() => onNavigate?.("settings")} />
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
            <CompactRow
              title={plan.name === activeSubscription.plan_name ? "Mevcut plan" : "Uygun plan"}
              subtitle="Plan degisikligi satis ekibi tarafindan manuel olarak etkinlestirilir."
              badge={plan.name === activeSubscription.plan_name ? "Aktif" : "Teklif"}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

function StatusTile({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statusTile}>
      <Text style={styles.statusLabel}>{label}</Text>
      <Text style={styles.statusValue}>{value}</Text>
    </View>
  );
}

function buildFallbackSubscription(account: SalonAccount): SalonSubscriptionStatus {
  const activePlan = productConfig.plans.find((plan) => plan.id === account.planId) ?? productConfig.plans[0];

  return {
    salon_id: account.salonId,
    plan_id: activePlan.name === "Business" ? "business" : activePlan.name === "Pro" ? "pro" : "free",
    plan_name: activePlan.name,
    status: account.subscriptionStatus === "Deneme" ? "trialing" : account.subscriptionStatus === "Aktif" ? "active" : "past_due",
    provider: "manual",
    is_active: account.subscriptionStatus === "Deneme" || account.subscriptionStatus === "Aktif",
    is_in_trial: account.subscriptionStatus === "Deneme",
    is_in_grace: false,
    can_create_records: account.subscriptionStatus === "Deneme" || account.subscriptionStatus === "Aktif",
    trial_ends_at: account.trialEndsAt,
    current_period_end: null,
    grace_until: null,
    admin_override_until: null,
    staff_limit: activePlan.name === "Business" ? -1 : activePlan.name === "Pro" ? 5 : 1,
    customer_limit: activePlan.name === "Business" ? -1 : activePlan.name === "Pro" ? 500 : 50,
    monthly_appointment_limit: activePlan.name === "Business" ? -1 : activePlan.name === "Pro" ? 750 : 80,
    branch_limit: activePlan.name === "Business" ? -1 : 1,
    monthly_booking_request_limit: activePlan.name === "Business" ? -1 : activePlan.name === "Pro" ? 150 : 20,
    current_staff_count: 0,
    current_customer_count: 0,
    current_month_appointment_count: 0,
    current_month_booking_request_count: 0
  };
}

function getStatusCopy(subscription: SalonSubscriptionStatus) {
  if (subscription.is_in_trial) {
    return {
      label: "Deneme aktif",
      description: `Deneme sureci devam ediyor. Bitis: ${formatDate(subscription.trial_ends_at) ?? "tarih bekleniyor"}.`
    };
  }

  if (subscription.is_in_grace) {
    return {
      label: "Ek sure aktif",
      description: `Odeme veya lisans kontrolu icin ek sure tanimli. Son tarih: ${formatDate(subscription.grace_until) ?? "tarih bekleniyor"}.`
    };
  }

  if (isDateInFuture(subscription.admin_override_until)) {
    return {
      label: "Admin onayi aktif",
      description: `Salon erisimi yonetici onayi ile acik. Onay bitisi: ${formatDate(subscription.admin_override_until) ?? "tarih bekleniyor"}.`
    };
  }

  if (subscription.is_active) {
    return {
      label: subscription.status === "active" ? "Aktif" : "Erisim acik",
      description: "Salon plani aktif. Kayit ve operasyon akislari plan limitleri dahilinde kullanilabilir."
    };
  }

  if (subscription.status === "past_due") {
    return {
      label: "Odeme bekliyor",
      description: "Plan odeme kontrolu bekliyor. Yeni kayitlar kisitlanmadan once satis ekibiyle gorusulmeli."
    };
  }

  return {
    label: "Kisitli",
    description: "Plan aktif gorunmuyor. Salon verileri korunur; yeni kayitlar kisitlanabilir."
  };
}

function buildSpecialWindowCopy(subscription: SalonSubscriptionStatus) {
  const trial = subscription.trial_ends_at ? `Deneme: ${formatDate(subscription.trial_ends_at)}` : "Deneme yok";
  const grace = subscription.grace_until ? `Ek sure: ${formatDate(subscription.grace_until)}` : "Ek sure yok";
  const override = subscription.admin_override_until ? `Admin onayi: ${formatDate(subscription.admin_override_until)}` : "Admin onayi yok";

  return [trial, grace, override].join(" | ");
}

function formatLimit(current: number, limit: number) {
  if (limit < 0) {
    return `${current} / Limitsiz`;
  }

  return `${current} / ${limit}`;
}

function formatDate(value: string | null) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function isDateInFuture(value: string | null) {
  if (!value) {
    return false;
  }

  const date = new Date(value);
  return !Number.isNaN(date.getTime()) && date.getTime() > Date.now();
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
    flexWrap: "wrap",
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
  heroBadge: {
    borderRadius: 999,
    backgroundColor: colors.champagneSoft,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: "flex-start"
  },
  heroBadgeText: {
    color: colors.gold,
    fontWeight: "900"
  },
  statusText: {
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.sageSoft,
    backgroundColor: colors.accentSofter,
    padding: 13,
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  statusTextCopy: {
    color: colors.accent,
    fontWeight: "800",
    lineHeight: 21,
    flex: 1
  },
  warningText: {
    color: colors.accent,
    fontWeight: "800",
    lineHeight: 21
  },
  statusGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  statusTile: {
    flex: 1,
    minWidth: 135,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.softBorder,
    backgroundColor: colors.card,
    padding: 12
  },
  statusLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800"
  },
  statusValue: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
    marginTop: 6
  },
  limitRow: {
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.softBorder,
    backgroundColor: colors.card,
    padding: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12
  },
  limitText: {
    flex: 1
  },
  limitTitle: {
    color: colors.text,
    fontWeight: "900"
  },
  limitSubtitle: {
    color: colors.muted,
    marginTop: 4,
    lineHeight: 19
  },
  limitValue: {
    color: colors.accent,
    fontSize: 18,
    fontWeight: "900"
  },
  ctaCard: {
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.softBorder,
    backgroundColor: colors.card,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2
  },
  ctaCardCompact: {
    flexDirection: "column"
  },
  ctaText: {
    flex: 1,
    minWidth: 220
  },
  ctaTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900"
  },
  ctaCopy: {
    color: colors.muted,
    marginTop: 7,
    lineHeight: 21
  },
  ctaActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    alignItems: "center"
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
  }
});
