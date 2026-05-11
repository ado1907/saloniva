import { StyleSheet, Text, View } from "react-native";
import { ActionButton } from "./ActionButton";
import { CompactRow } from "./CompactRow";
import { PanelCard } from "./PanelCard";
import { SmallStat } from "./SmallStat";
import { useSalonStore } from "../state/SalonStore";
import { colors } from "../theme/colors";
import type { ServicePackage } from "../types";
import { formatCurrency } from "../utils/format";
import { sendPackageReminder } from "../utils/whatsapp";

type Props = {
  item: ServicePackage;
  onClose: () => void;
  onTakePayment?: (payload: { customer: string; service: string; remaining: number }) => void;
};

export function PackageDetail({ item, onClose, onTakePayment }: Props) {
  const { customers, payments, usePackageSession } = useSalonStore();
  const customer = customers.find((entry) => entry.name === item.customer);
  const packagePayments = payments.filter((payment) => payment.customer === item.customer);
  const remainingSessions = item.totalSessions - item.usedSessions;
  const remainingPayment = item.totalPrice - item.paid;

  const handleUseSession = () => {
    usePackageSession(item.id);
    onClose();
  };

  return (
    <View style={styles.wrap}>
      <View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.meta}>{item.customer}</Text>
      </View>

      <View style={styles.stats}>
        <SmallStat label="Toplam seans" value={`${item.totalSessions}`} />
        <SmallStat label="Kullanılan" value={`${item.usedSessions}`} />
        <SmallStat label="Kalan" value={`${remainingSessions}`} warning={remainingSessions <= 1} />
      </View>

      <View style={styles.stats}>
        <SmallStat label="Paket ücreti" value={formatCurrency(item.totalPrice)} />
        <SmallStat label="Ödenen" value={formatCurrency(item.paid)} />
        <SmallStat label="Kalan ödeme" value={formatCurrency(remainingPayment)} warning={remainingPayment > 0} />
      </View>

      <View style={styles.actions}>
        <ActionButton icon="remove-circle-outline" label="Seans Kullan" primary onPress={handleUseSession} />
        <ActionButton
          icon="cash-outline"
          label="Ödeme Al"
          onPress={() =>
            onTakePayment?.({
              customer: item.customer,
              service: item.title,
              remaining: remainingPayment
            })
          }
        />
        <ActionButton
          icon="logo-whatsapp"
          label="WhatsApp Hatırlat"
          onPress={() =>
            sendPackageReminder(customer?.phone ?? "905320000000", item.customer, item.title, remainingSessions)
          }
        />
      </View>

      <PanelCard title="Müşteri Özeti">
        {customer ? (
          <>
            <CompactRow title={customer.phone} subtitle="Telefon" badge="Kayıtlı" />
            <CompactRow title={customer.lastVisit} subtitle="Son ziyaret" badge={formatCurrency(customer.debt)} />
            <Text style={styles.note}>{customer.note}</Text>
          </>
        ) : (
          <Text style={styles.note}>Bu paket için müşteri kartı bulunamadı.</Text>
        )}
      </PanelCard>

      <PanelCard title="Ödeme Geçmişi">
        {packagePayments.length > 0 ? (
          packagePayments.map((payment) => (
            <CompactRow
              key={payment.id}
              title={payment.service}
              subtitle={`${payment.date} • ${payment.method} • ${payment.status}`}
              badge={formatCurrency(payment.amount)}
            />
          ))
        ) : (
          <Text style={styles.note}>Bu paket için ödeme kaydı yok.</Text>
        )}
      </PanelCard>

      <PanelCard title="Seans Planı">
        <CompactRow title="Kullanılan seans" subtitle={`${item.usedSessions} seans tamamlandı`} badge={`${item.usedSessions}/${item.totalSessions}`} />
        <CompactRow title="Kalan seans" subtitle="Sonraki randevular için takip edilir" badge={`${remainingSessions}`} />
        <CompactRow title="Yenileme fırsatı" subtitle={remainingSessions <= 1 ? "Yeni paket önerilebilir" : "Takipte kal"} badge={remainingSessions <= 1 ? "Önemli" : "Normal"} />
      </PanelCard>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 12
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "800"
  },
  meta: {
    color: colors.muted,
    marginTop: 3
  },
  stats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  note: {
    color: colors.muted,
    lineHeight: 20
  }
});
