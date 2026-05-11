import { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ActionButton } from "../components/ActionButton";
import { CompactRow } from "../components/CompactRow";
import { EmptyState } from "../components/EmptyState";
import { PanelCard } from "../components/PanelCard";
import { Pill } from "../components/Pill";
import { ScreenIntro } from "../components/ScreenIntro";
import { SummaryCard } from "../components/SummaryCard";
import { useSalonStore } from "../state/SalonStore";
import { colors } from "../theme/colors";
import { radius } from "../theme/spacing";
import { formatCurrency } from "../utils/format";
import { sendPaymentReminder, sendWinbackMessage } from "../utils/whatsapp";

const segments = ["Uzun süredir gelmeyenler", "Borcu olanlar", "Paketi olanlar"] as const;

export function CampaignsScreen() {
  const { customers } = useSalonStore();
  const [segment, setSegment] = useState<(typeof segments)[number]>("Uzun süredir gelmeyenler");

  const targetCustomers = useMemo(() => {
    if (segment === "Borcu olanlar") {
      return customers.filter((customer) => customer.debt > 0);
    }

    if (segment === "Paketi olanlar") {
      return customers.filter((customer) => customer.packageLabel !== "Aktif paket yok");
    }

    return customers.filter((customer) => customer.lastVisit !== "Bugün" && customer.lastVisit !== "Yeni kayıt");
  }, [customers, segment]);

  const totalDebt = targetCustomers.reduce((sum, customer) => sum + customer.debt, 0);

  return (
    <View style={styles.sectionGap}>
      <ScreenIntro
        title="Kampanyalar"
        description="Müşteri segmentleri oluşturun, geri kazanım ve ödeme hatırlatma mesajlarını hızlıca gönderin."
        action="Kampanya Oluştur"
      />

      <View style={styles.segmentRow}>
        {segments.map((item) => (
          <Pill key={item} label={item} active={segment === item} onPress={() => setSegment(item)} />
        ))}
      </View>

      <View style={styles.summaryGrid}>
        <SummaryCard label="Hedef Müşteri" value={`${targetCustomers.length}`} detail={segment} />
        <SummaryCard label="Açık Borç" value={formatCurrency(totalDebt)} detail="Seçili segment toplamı" warning={totalDebt > 0} />
        <SummaryCard label="Mesaj Kanalı" value="WhatsApp" detail="Manuel hazır mesaj akışı" />
      </View>

      <PanelCard title="Hazır Mesaj Şablonu">
        <View style={styles.templateBox}>
          <Text style={styles.templateTitle}>{getTemplateTitle(segment)}</Text>
          <Text style={styles.templateText}>{getTemplateText(segment)}</Text>
        </View>
      </PanelCard>

      <PanelCard title={`${targetCustomers.length} hedef müşteri`}>
        {targetCustomers.length > 0 ? (
          targetCustomers.map((customer) => (
            <View key={customer.id} style={styles.customerRow}>
              <CompactRow
                title={customer.name}
                subtitle={`${customer.phone} • ${customer.packageLabel}`}
                badge={customer.debt > 0 ? formatCurrency(customer.debt) : "Uygun"}
              />
              <View style={styles.actions}>
                <ActionButton
                  icon="logo-whatsapp"
                  label={segment === "Borcu olanlar" ? "Borç Hatırlat" : "Mesaj Gönder"}
                  onPress={() => {
                    if (segment === "Borcu olanlar") {
                      sendPaymentReminder(customer.phone, customer.name, formatCurrency(customer.debt));
                    } else {
                      sendWinbackMessage(customer.phone, customer.name);
                    }
                  }}
                />
              </View>
            </View>
          ))
        ) : (
          <EmptyState title="Hedef müşteri yok" description="Bu segment için uygun müşteri bulunamadı." />
        )}
      </PanelCard>
    </View>
  );
}

function getTemplateTitle(segment: string) {
  if (segment === "Borcu olanlar") {
    return "Ödeme hatırlatma";
  }

  if (segment === "Paketi olanlar") {
    return "Paket seans hatırlatma";
  }

  return "Geri kazanım mesajı";
}

function getTemplateText(segment: string) {
  if (segment === "Borcu olanlar") {
    return "Merhaba, salon kaydınızda bekleyen ödeme görünmektedir. Uygun olduğunuzda bizimle iletişime geçebilirsiniz.";
  }

  if (segment === "Paketi olanlar") {
    return "Merhaba, aktif paketiniz için yeni randevu oluşturmak isterseniz size yardımcı olabiliriz.";
  }

  return "Merhaba, sizi yeniden salonumuzda görmek isteriz. Size uygun bir bakım randevusu oluşturabiliriz.";
}

const styles = StyleSheet.create({
  sectionGap: {
    gap: 16
  },
  segmentRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12
  },
  templateBox: {
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.softBorder,
    backgroundColor: colors.card,
    padding: 12
  },
  templateTitle: {
    color: colors.text,
    fontWeight: "800"
  },
  templateText: {
    color: colors.muted,
    lineHeight: 20,
    marginTop: 4
  },
  customerRow: {
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.softBorder,
    backgroundColor: colors.card,
    padding: 10,
    gap: 10
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  }
});
