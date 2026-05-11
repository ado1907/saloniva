import { useState, type ReactNode } from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { CompactRow } from "../components/CompactRow";
import { ActionButton } from "../components/ActionButton";
import { LegalContent, type LegalType } from "../components/LegalContent";
import { ModalShell } from "../components/ModalShell";
import { PanelCard } from "../components/PanelCard";
import { Pill } from "../components/Pill";
import { ScreenIntro } from "../components/ScreenIntro";
import { SettingsRow } from "../components/SettingsRow";
import { productConfig } from "../config/productConfig";
import { useAppPreferences, type AppLanguage, type AppThemeMode } from "../state/AppPreferences";
import { useSalonStore } from "../state/SalonStore";
import { colors } from "../theme/colors";
import { radius } from "../theme/spacing";
import type { SalonAccount, TabKey, WorkingDay } from "../types";

type Props = {
  account: SalonAccount;
  onNavigate?: (tab: TabKey) => void;
};

const workingDays: WorkingDay[] = [
  { day: "Pazartesi", hours: "09:00 - 19:00", open: true },
  { day: "Salı", hours: "09:00 - 19:00", open: true },
  { day: "Çarşamba", hours: "09:00 - 19:00", open: true },
  { day: "Perşembe", hours: "09:00 - 19:00", open: true },
  { day: "Cuma", hours: "09:00 - 19:00", open: true },
  { day: "Cumartesi", hours: "10:00 - 18:00", open: true },
  { day: "Pazar", hours: "Kapalı", open: false }
];

export function SettingsScreen({ account, onNavigate }: Props) {
  const { width } = useWindowDimensions();
  const isWide = width >= 900;
  const { resetDemoData, storageReady } = useSalonStore();
  const { language, setLanguage, themeMode, setThemeMode, t } = useAppPreferences();
  const [legalModal, setLegalModal] = useState<LegalType | null>(null);
  const activePlan = productConfig.plans.find((plan) => plan.id === account.planId) ?? productConfig.plans[0];

  return (
    <View style={styles.sectionGap}>
      <ScreenIntro
        title={t("settingsTitle")}
        description={t("settingsDescription")}
        action={t("save")}
      />

      <View style={[styles.columns, isWide ? styles.columnsWide : null]}>
        <View style={styles.mainColumn}>
          <PanelCard title="Salon Bilgileri">
            <InfoBox label="Salon ID" value={account.salonId} />
            <InfoBox label="Salon adı" value={account.salonName} />
            <InfoBox label="Yetkili" value={account.ownerName} />
            <InfoBox label="E-posta" value={account.email} />
            <InfoBox label="Rol" value={account.role} />
          </PanelCard>

          <PanelCard title="Abonelik ve Lisans">
            <View style={styles.planCard}>
              <View>
                <Text style={styles.planKicker}>Aktif plan</Text>
                <Text style={styles.planTitle}>{activePlan.name}</Text>
                <Text style={styles.planDescription}>{activePlan.description}</Text>
              </View>
              <Text style={styles.planPrice}>{activePlan.price}</Text>
            </View>
            <CompactRow title="Lisans durumu" subtitle={`Deneme bitişi: ${account.trialEndsAt}`} badge={account.subscriptionStatus} />
            <CompactRow title="Plan limiti" subtitle={activePlan.limits} badge="Kontrol" />
            <CompactRow title="Yetkiler" subtitle={account.permissions.join(", ")} badge={`${account.permissions.length} yetki`} />
            <View style={styles.resetAction}>
              <ActionButton icon="card-outline" label="Planları Yönet" onPress={() => onNavigate?.("billing")} />
            </View>
          </PanelCard>

          <PanelCard title="Çalışma Saatleri">
            {workingDays.map((day) => (
              <CompactRow key={day.day} title={day.day} subtitle={day.open ? "Randevu alınabilir" : "Randevu kapalı"} badge={day.hours} />
            ))}
          </PanelCard>

          <PanelCard title={t("languageAndTheme")}>
            <PreferenceBlock title={t("appLanguage")} subtitle={t("appLanguageSubtitle")}>
              {languageOptions.map((item) => (
                <Pill
                  key={item.value}
                  label={item.label}
                  active={language === item.value}
                  onPress={() => setLanguage(item.value)}
                />
              ))}
            </PreferenceBlock>
            <PreferenceBlock title={t("themeMode")} subtitle={t("themeModeSubtitle")}>
              {themeOptions.map((item) => (
                <Pill
                  key={item.value}
                  label={t(item.labelKey)}
                  active={themeMode === item.value}
                  onPress={() => setThemeMode(item.value)}
                />
              ))}
            </PreferenceBlock>
          </PanelCard>

          <PanelCard title="Uygulama ve Mağaza Uyumluluğu">
            <SettingsRow icon="shield-checkmark-outline" title="Gizlilik Politikası" subtitle="Toplanan veriler, kullanım amacı ve saklama süreci açıklanır." badge="Aç" onPress={() => setLegalModal("privacy")} />
            <SettingsRow icon="document-text-outline" title="Kullanım Koşulları" subtitle="Saloniva kullanım şartları ve abonelik süreçleri burada yayınlanır." badge="Aç" onPress={() => setLegalModal("terms")} />
            <SettingsRow icon="mail-outline" title="Destek İletişimi" subtitle="Mağaza incelemesi ve kullanıcı desteği için destek e-postası gerekir." badge="Aç" onPress={() => setLegalModal("support")} />
            <SettingsRow icon="save-outline" title="Kalıcı Veri" subtitle="Randevu, müşteri, ödeme ve paket verileri cihazda saklanır." badge={storageReady ? "Aktif" : "Yükleniyor"} />
            <SettingsRow icon="trash-outline" title="Hesap Silme Talebi" subtitle="Salon hesabı ve verilerin silinmesi için görünür talep akışı." badge="Aç" danger onPress={() => setLegalModal("delete")} />
            <View style={styles.resetAction}>
              <ActionButton icon="refresh-outline" label="Demo Veriye Sıfırla" onPress={resetDemoData} />
            </View>
          </PanelCard>
        </View>

        <View style={styles.sideColumn}>
          <PanelCard title="Güvenlik">
            <SettingsRow icon="lock-closed-outline" title="Şifre Değiştir" subtitle="Salon hesabı şifresini yenileyin." />
            <SettingsRow icon="people-outline" title="Rol Yetkileri" subtitle="Sahip, yönetici ve personel erişimlerini düzenleyin." badge="Aç" onPress={() => onNavigate?.("security")} />
            <SettingsRow icon="phone-portrait-outline" title="Cihaz Oturumları" subtitle="Web, Android ve iOS oturumlarını takip edin." />
          </PanelCard>

          <PanelCard title="Bildirimler">
            <SettingsRow icon="notifications-outline" title="Randevu Hatırlatma" subtitle="Yaklaşan randevular için bildirim ayarları." badge="Planlı" />
            <SettingsRow icon="logo-whatsapp" title="WhatsApp Mesajları" subtitle="Hazır mesaj şablonları ve müşteri hatırlatmaları." badge="Hazır" />
            <SettingsRow icon="card-outline" title="Ödeme Hatırlatma" subtitle="Borcu olan müşterilere manuel hatırlatma." badge="Hazır" />
          </PanelCard>
        </View>
      </View>
      <ModalShell
        visible={Boolean(legalModal)}
        title="Bilgilendirme"
        onClose={() => setLegalModal(null)}
      >
        {legalModal ? <LegalContent type={legalModal} /> : null}
      </ModalShell>
    </View>
  );
}

const languageOptions: Array<{ label: string; value: AppLanguage }> = [
  { label: "Türkçe", value: "tr" },
  { label: "English", value: "en" },
  { label: "العربية", value: "ar" }
];

const themeOptions: Array<{ labelKey: "light" | "dark" | "system"; value: AppThemeMode }> = [
  { labelKey: "light", value: "light" },
  { labelKey: "dark", value: "dark" },
  { labelKey: "system", value: "system" }
];

function PreferenceBlock({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <View style={styles.preferenceBlock}>
      <View style={styles.preferenceText}>
        <Text style={styles.preferenceTitle}>{title}</Text>
        <Text style={styles.preferenceSubtitle}>{subtitle}</Text>
      </View>
      <View style={styles.preferenceOptions}>{children}</View>
    </View>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoBox}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionGap: {
    gap: 16
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
  },
  infoBox: {
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.softBorder,
    backgroundColor: colors.card,
    padding: 12
  },
  infoLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700"
  },
  infoValue: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
    marginTop: 4
  },
  resetAction: {
    alignItems: "flex-start"
  },
  preferenceBlock: {
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.softBorder,
    backgroundColor: colors.card,
    padding: 12,
    gap: 12
  },
  preferenceText: {
    gap: 4
  },
  preferenceTitle: {
    color: colors.text,
    fontWeight: "800",
    fontSize: 16
  },
  preferenceSubtitle: {
    color: colors.muted,
    lineHeight: 19
  },
  preferenceOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  planCard: {
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.gold,
    backgroundColor: colors.ink,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap"
  },
  planKicker: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  planTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "800",
    marginTop: 5
  },
  planDescription: {
    color: "#d8c8ac",
    marginTop: 5,
    lineHeight: 19
  },
  planPrice: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "800"
  }
});
