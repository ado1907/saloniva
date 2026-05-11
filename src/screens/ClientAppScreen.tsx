import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { CompactRow } from "../components/CompactRow";
import { PanelCard } from "../components/PanelCard";
import { ScreenIntro } from "../components/ScreenIntro";
import { useSalonStore } from "../state/SalonStore";
import { colors } from "../theme/colors";
import { radius } from "../theme/spacing";
import { formatCurrency } from "../utils/format";

export function ClientAppScreen() {
  const { appointments, customers, packages } = useSalonStore();
  const featuredCustomer = customers[0];
  const activePackage = packages.find((item) => item.customer === featuredCustomer?.name) ?? packages[0];
  const nextAppointment = appointments.find((item) => item.customer === featuredCustomer?.name) ?? appointments[0];
  const remainingSessions = activePackage.totalSessions - activePackage.usedSessions;
  const paidRate = Math.round((activePackage.paid / activePackage.totalPrice) * 100);

  return (
    <View style={styles.sectionGap}>
      <ScreenIntro
        title="Mobil Müşteri Uygulaması"
        description="Salon müşterisinin randevu, paket, sadakat ve ödeme durumunu görebileceği premium mobil deneyim demosu."
      />

      <View style={styles.columns}>
        <View style={styles.phoneFrame}>
          <View style={styles.phoneTop}>
            <View>
              <Text style={styles.phoneKicker}>Saloniva Client</Text>
              <Text style={styles.phoneTitle}>Merhaba {featuredCustomer.name.split(" ")[0]}</Text>
            </View>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{featuredCustomer.name.charAt(0)}</Text>
            </View>
          </View>

          <View style={styles.heroCard}>
            <Text style={styles.heroLabel}>Sıradaki randevu</Text>
            <Text style={styles.heroTitle}>{nextAppointment.service}</Text>
            <Text style={styles.heroCopy}>
              {nextAppointment.time} • {nextAppointment.staff} ile bakım seansı
            </Text>
          </View>

          <View style={styles.mobileGrid}>
            <MobileStat icon="sparkles-outline" label="Kalan seans" value={`${remainingSessions}`} />
            <MobileStat icon="wallet-outline" label="Ödeme" value={`%${paidRate}`} />
          </View>

          <View style={styles.packageCard}>
            <Text style={styles.packageLabel}>Aktif paket</Text>
            <Text style={styles.packageTitle}>{activePackage.title}</Text>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${(activePackage.usedSessions / activePackage.totalSessions) * 100}%` }]} />
            </View>
            <Text style={styles.packageCopy}>
              {activePackage.usedSessions}/{activePackage.totalSessions} seans kullanıldı
            </Text>
          </View>

          <View style={styles.mobileNav}>
            {["Ana Sayfa", "Randevu", "Paket", "Profil"].map((item, index) => (
              <Text key={item} style={[styles.mobileNavText, index === 0 ? styles.mobileNavActive : null]}>
                {item}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.detailColumn}>
          <PanelCard title="Müşteriye Gösterilen Değer">
            <CompactRow title="Randevu takibi" subtitle="Saat, hizmet ve personel bilgisi tek ekranda." badge="Hazır" />
            <CompactRow title="Paket şeffaflığı" subtitle="Kalan seans ve ödeme yüzdesi müşteriye açık görünür." badge={`${remainingSessions} seans`} />
            <CompactRow title="Sadakat hissi" subtitle="Premium mobil görünüm salon markasını güçlendirir." badge="Premium" />
          </PanelCard>

          <PanelCard title="Salon İçin Satış Etkisi">
            <CompactRow title="Paket yenileme" subtitle="Son seansa yaklaşan müşteriye teklif gösterilebilir." badge={formatCurrency(activePackage.totalPrice)} />
            <CompactRow title="Gelmedi azaltma" subtitle="Müşteri randevusunu uygulamada net görür." badge="Risk düşer" />
            <CompactRow title="Marka bağlılığı" subtitle="Müşteri salonu profesyonel teknolojiyle hatırlar." badge="Güçlü" />
          </PanelCard>

          <View style={styles.noteBox}>
            <Ionicons name="phone-portrait-outline" size={22} color={colors.gold} />
            <Text style={styles.noteText}>
              Bu ekran şimdilik yönetim paneli içindeki demo önizlemedir. Sonraki aşamada ayrı müşteri giriş akışı ve paylaşılabilir mobil deneyime dönüşebilir.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function MobileStat({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) {
  return (
    <View style={styles.mobileStat}>
      <Ionicons name={icon} size={18} color={colors.gold} />
      <Text style={styles.mobileStatValue}>{value}</Text>
      <Text style={styles.mobileStatLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionGap: {
    gap: 16
  },
  columns: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    alignItems: "flex-start"
  },
  phoneFrame: {
    width: 320,
    maxWidth: "100%",
    borderRadius: 28,
    borderWidth: 7,
    borderColor: colors.ink,
    backgroundColor: colors.surface,
    padding: 16,
    gap: 14
  },
  phoneTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12
  },
  phoneKicker: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  phoneTitle: {
    color: colors.text,
    fontSize: 21,
    fontWeight: "800",
    marginTop: 4
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center"
  },
  avatarText: {
    color: colors.white,
    fontWeight: "800",
    fontSize: 18
  },
  heroCard: {
    borderRadius: radius.sm,
    backgroundColor: colors.ink,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.gold
  },
  heroLabel: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: "800"
  },
  heroTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "800",
    marginTop: 5
  },
  heroCopy: {
    color: "#d8c8ac",
    marginTop: 5,
    lineHeight: 19
  },
  mobileGrid: {
    flexDirection: "row",
    gap: 10
  },
  mobileStat: {
    flex: 1,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.softBorder,
    backgroundColor: colors.card,
    padding: 12,
    gap: 4
  },
  mobileStatValue: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "800"
  },
  mobileStatLabel: {
    color: colors.muted,
    fontWeight: "700"
  },
  packageCard: {
    borderRadius: radius.sm,
    backgroundColor: colors.goldSoft,
    padding: 14
  },
  packageLabel: {
    color: colors.mutedDark,
    fontWeight: "800",
    fontSize: 12,
    textTransform: "uppercase"
  },
  packageTitle: {
    color: colors.text,
    fontWeight: "800",
    fontSize: 18,
    marginTop: 5
  },
  progressTrack: {
    height: 8,
    borderRadius: 8,
    backgroundColor: colors.surface,
    overflow: "hidden",
    marginTop: 12
  },
  progressFill: {
    height: "100%",
    borderRadius: 8,
    backgroundColor: colors.accent
  },
  packageCopy: {
    color: colors.mutedDark,
    marginTop: 8,
    fontWeight: "700"
  },
  mobileNav: {
    minHeight: 44,
    borderRadius: radius.sm,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.softBorder,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around"
  },
  mobileNavText: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "800"
  },
  mobileNavActive: {
    color: colors.accent
  },
  detailColumn: {
    flex: 1,
    minWidth: 280,
    gap: 14
  },
  noteBox: {
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.gold,
    backgroundColor: colors.ink,
    padding: 14,
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start"
  },
  noteText: {
    flex: 1,
    color: "#d8c8ac",
    lineHeight: 20,
    fontWeight: "700"
  }
});
