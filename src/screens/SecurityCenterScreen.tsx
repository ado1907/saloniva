import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { CompactRow } from "../components/CompactRow";
import { PanelCard } from "../components/PanelCard";
import { ScreenIntro } from "../components/ScreenIntro";
import {
  rolePermissionProfiles,
  securityReadinessChecklist,
  sensitiveDataCatalog,
  getRoleProfile
} from "../security/rolePermissions";
import { colors } from "../theme/colors";
import { radius } from "../theme/spacing";
import type { SalonAccount } from "../types";

type Props = {
  account: SalonAccount;
};

export function SecurityCenterScreen({ account }: Props) {
  const activeProfile = getRoleProfile(account.role);

  return (
    <View style={styles.sectionGap}>
      <ScreenIntro
        title="Güvenlik ve Yetki Merkezi"
        description="Saloniva'nın satışa çıkmadan önce netleşmesi gereken rol, veri güvenliği, salon ayrımı ve hesap silme kuralları."
      />

      <View style={styles.hero}>
        <View style={styles.heroIcon}>
          <Ionicons name="shield-checkmark-outline" size={30} color={colors.gold} />
        </View>
        <View style={styles.heroText}>
          <Text style={styles.kicker}>Security and data agent</Text>
          <Text style={styles.heroTitle}>Rol ve veri güvenliği görünür oldu</Text>
          <Text style={styles.heroCopy}>
            Demo hesapta aktif rol {account.role}. Gerçek satışta bu kurallar backend tarafında da zorunlu olarak doğrulanmalı.
          </Text>
        </View>
        <View style={styles.heroMetric}>
          <Text style={styles.metricValue}>{activeProfile.permissions.length}</Text>
          <Text style={styles.metricLabel}>aktif yetki</Text>
        </View>
      </View>

      <View style={styles.columns}>
        <View style={styles.mainColumn}>
          <PanelCard title="Rol Yetki Matrisi">
            {rolePermissionProfiles.map((profile) => (
              <View key={profile.role} style={[styles.roleCard, profile.role === account.role ? styles.activeRoleCard : null]}>
                <View style={styles.roleHeader}>
                  <View style={styles.roleIcon}>
                    <Ionicons
                      name={profile.role === "Salon Sahibi" ? "ribbon-outline" : profile.role === "Yönetici" ? "people-outline" : "person-outline"}
                      size={20}
                      color={colors.sage}
                    />
                  </View>
                  <View style={styles.roleText}>
                    <Text style={styles.roleName}>{profile.role}</Text>
                    <Text style={styles.roleDescription}>{profile.description}</Text>
                  </View>
                  <Text style={styles.roleBadge}>{profile.permissions.length} yetki</Text>
                </View>
                <Text style={styles.permissionLine}>{profile.permissions.join(" • ")}</Text>
                <Text style={styles.restrictedLine}>Sınırlı alan: {profile.restrictedAreas.join(", ")}</Text>
              </View>
            ))}
          </PanelCard>

          <PanelCard title="Hassas Veri Kataloğu">
            {sensitiveDataCatalog.map((item) => (
              <View key={item.title} style={styles.dataCard}>
                <View style={styles.dataHeader}>
                  <Text style={styles.dataTitle}>{item.title}</Text>
                  <Text style={[styles.sensitivity, item.sensitivity === "Yüksek" ? styles.highSensitivity : null]}>
                    {item.sensitivity}
                  </Text>
                </View>
                <Text style={styles.dataDescription}>{item.description}</Text>
                <Text style={styles.productionRule}>{item.productionRule}</Text>
              </View>
            ))}
          </PanelCard>
        </View>

        <View style={styles.sideColumn}>
          <PanelCard title="Aktif Hesap Güvenliği">
            <CompactRow title="Salon tenant" subtitle={account.salonId} badge="Zorunlu" />
            <CompactRow title="Aktif rol" subtitle={activeProfile.description} badge={account.role} />
            <CompactRow title="Plan ve lisans" subtitle={`${account.planId} • ${account.subscriptionStatus}`} badge="Backend" />
            <CompactRow title="Deneme bitişi" subtitle={account.trialEndsAt} badge="Lisans" />
          </PanelCard>

          <PanelCard title="Üretim Güvenlik Kontrolü">
            {securityReadinessChecklist.map((item, index) => (
              <CompactRow key={item} title={`${index + 1}. kontrol`} subtitle={item} badge="Kritik" />
            ))}
          </PanelCard>

          <PanelCard title="Sıradaki Güvenlik Adımları">
            <CompactRow title="Backend rol doğrulaması" subtitle="Uygulamadaki yetki matrisi API tarafında da zorunlu kontrol edilmeli." badge="1. adım" />
            <CompactRow title="Audit log" subtitle="Ödeme, hesap silme, veri dışa aktarma ve rol değişimi kayıt altına alınmalı." badge="2. adım" />
            <CompactRow title="Veri dışa aktarma" subtitle="Salon sahibi müşteri ve ödeme verisini güvenli dosya olarak alabilmeli." badge="3. adım" />
          </PanelCard>
        </View>
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
    lineHeight: 21
  },
  heroMetric: {
    minWidth: 98,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.gold,
    backgroundColor: "#3b332b",
    padding: 12,
    alignItems: "center"
  },
  metricValue: {
    color: colors.white,
    fontSize: 28,
    fontWeight: "800"
  },
  metricLabel: {
    color: "#d9d2c5",
    fontWeight: "700",
    marginTop: 2
  },
  columns: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    alignItems: "flex-start"
  },
  mainColumn: {
    flex: 1.35,
    minWidth: 300,
    gap: 14
  },
  sideColumn: {
    flex: 1,
    minWidth: 280,
    gap: 14
  },
  roleCard: {
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.softBorder,
    backgroundColor: colors.card,
    padding: 12,
    gap: 8
  },
  activeRoleCard: {
    borderColor: colors.sage,
    backgroundColor: colors.sageSoft
  },
  roleHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  roleIcon: {
    width: 38,
    height: 38,
    borderRadius: radius.sm,
    backgroundColor: colors.accentSofter,
    alignItems: "center",
    justifyContent: "center"
  },
  roleText: {
    flex: 1
  },
  roleName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800"
  },
  roleDescription: {
    color: colors.muted,
    marginTop: 3,
    lineHeight: 19
  },
  roleBadge: {
    color: colors.accent,
    fontWeight: "800"
  },
  permissionLine: {
    color: colors.mutedDark,
    fontWeight: "700",
    lineHeight: 20
  },
  restrictedLine: {
    color: colors.muted,
    lineHeight: 19
  },
  dataCard: {
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.softBorder,
    backgroundColor: colors.card,
    padding: 12,
    gap: 7
  },
  dataHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10
  },
  dataTitle: {
    flex: 1,
    color: colors.text,
    fontWeight: "800",
    fontSize: 16
  },
  sensitivity: {
    color: colors.accent,
    fontWeight: "800"
  },
  highSensitivity: {
    color: colors.danger
  },
  dataDescription: {
    color: colors.muted,
    lineHeight: 19
  },
  productionRule: {
    color: colors.mutedDark,
    fontWeight: "700",
    lineHeight: 20
  }
});
