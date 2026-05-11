import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { CompactRow } from "../components/CompactRow";
import { PanelCard } from "../components/PanelCard";
import { ScreenIntro } from "../components/ScreenIntro";
import { SettingsRow } from "../components/SettingsRow";
import { colors } from "../theme/colors";
import { radius } from "../theme/spacing";

const readiness = [
  { label: "Mağaza uyumu", value: 86 },
  { label: "Güvenlik hazırlığı", value: 74 },
  { label: "Tasarım sistemi", value: 91 },
  { label: "Test edilebilirlik", value: 68 }
];

export function QualityCenterScreen() {
  return (
    <View style={styles.sectionGap}>
      <ScreenIntro
        title="Kalite Merkezi"
        description="skills-main içindeki güvenlik, tasarım ve test yaklaşımından alınan profesyonel kontrol merkezi."
      />

      <View style={styles.hero}>
        <View style={styles.heroIcon}>
          <Ionicons name="shield-checkmark-outline" size={30} color={colors.gold} />
        </View>
        <View style={styles.heroText}>
          <Text style={styles.kicker}>Professional release desk</Text>
          <Text style={styles.heroTitle}>Yayın öncesi kalite görünümü</Text>
          <Text style={styles.heroCopy}>
            Uygulama mağazaya çıkmadan önce güvenlik, veri, tasarım ve test başlıkları burada takip edilir.
          </Text>
        </View>
      </View>

      <View style={styles.scoreGrid}>
        {readiness.map((item) => (
          <ScoreCard key={item.label} label={item.label} value={item.value} />
        ))}
      </View>

      <View style={styles.columns}>
        <View style={styles.mainColumn}>
          <PanelCard title="Güvenlik ve Veri Kontrolleri">
            <SettingsRow
              icon="lock-closed-outline"
              title="Hassas müşteri verisi"
              subtitle="Telefon, ödeme, not ve randevu verileri açıkça sınıflandırıldı."
              badge="Takipte"
            />
            <SettingsRow
              icon="key-outline"
              title="Rol bazlı erişim"
              subtitle="Salon sahibi, yönetici ve personel rolleri ürün planında ayrıldı."
              badge="Planlı"
            />
            <SettingsRow
              icon="trash-outline"
              title="Hesap silme akışı"
              subtitle="Mağaza gereksinimleri için ayarlarda hesap silme talebi görünür."
              badge="Hazır"
            />
          </PanelCard>

          <PanelCard title="Tasarım Sistemi Kontrolleri">
            <CompactRow title="Premium renk paleti" subtitle="Krem, ink, altın ve bordo tonları merkezi temada." badge="Hazır" />
            <CompactRow title="Koyu mod" subtitle="Ayarlar üzerinden koyu görünüm destekleniyor." badge="Hazır" />
            <CompactRow title="Mobil navigasyon" subtitle="Web sidebar, mobil alt menü ve Daha Fazla yapısı ayrıldı." badge="Hazır" />
          </PanelCard>
        </View>

        <View style={styles.sideColumn}>
          <PanelCard title="Mağaza Hazırlığı">
            <CompactRow title="Demo hesap" subtitle="İnceleme için demo kullanıcı akışı var." badge="Hazır" />
            <CompactRow title="Gizlilik metni" subtitle="Ayarlar içinde gizlilik ve kullanım koşulları modalları var." badge="Hazır" />
            <CompactRow title="Ekran görüntüsü adayları" subtitle="Panel, raporlar, müşteri uygulaması ve kalite merkezi." badge="Güçlü" />
          </PanelCard>

          <PanelCard title="Test Planı">
            <CompactRow title="Web açılış kontrolü" subtitle="localhost bağlantısı ve Metro hata akışı izlenir." badge="Manuel" />
            <CompactRow title="Kritik formlar" subtitle="Randevu, müşteri, ödeme ve paket formları denenmeli." badge="Sırada" />
            <CompactRow title="Tema ve dil" subtitle="Türkçe, İngilizce, Arapça ve koyu mod görüntüsü kontrol edilmeli." badge="Sırada" />
          </PanelCard>
        </View>
      </View>
    </View>
  );
}

function ScoreCard({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.scoreCard}>
      <Text style={styles.scoreLabel}>{label}</Text>
      <Text style={styles.scoreValue}>%{value}</Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${value}%` }]} />
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
    borderColor: colors.gold,
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
    borderColor: colors.gold,
    backgroundColor: "#211b17",
    alignItems: "center",
    justifyContent: "center"
  },
  heroText: {
    flex: 1,
    minWidth: 220
  },
  kicker: {
    color: colors.gold,
    fontWeight: "800",
    fontSize: 12,
    textTransform: "uppercase"
  },
  heroTitle: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "800",
    marginTop: 4
  },
  heroCopy: {
    color: "#d8c8ac",
    marginTop: 5,
    lineHeight: 20
  },
  scoreGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12
  },
  scoreCard: {
    flex: 1,
    minWidth: 180,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 14
  },
  scoreLabel: {
    color: colors.muted,
    fontWeight: "800"
  },
  scoreValue: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "800",
    marginTop: 6
  },
  track: {
    height: 8,
    borderRadius: 8,
    backgroundColor: colors.mutedSurface,
    overflow: "hidden",
    marginTop: 10
  },
  fill: {
    height: "100%",
    borderRadius: 8,
    backgroundColor: colors.accent
  },
  columns: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    gap: 14
  },
  mainColumn: {
    flex: 1.35,
    minWidth: 280,
    gap: 14
  },
  sideColumn: {
    flex: 1,
    minWidth: 270,
    gap: 14
  }
});
