import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ActionButton } from "./ActionButton";
import { CompactRow } from "./CompactRow";
import { PanelCard } from "./PanelCard";
import { ReceiptPreview } from "./ReceiptPreview";
import { SmallStat } from "./SmallStat";
import { useSalonStore } from "../state/SalonStore";
import { colors } from "../theme/colors";
import type { Payment } from "../types";
import { formatCurrency } from "../utils/format";
import { sendPaymentReminder } from "../utils/whatsapp";

type Props = {
  payment: Payment;
};

export function PaymentDetail({ payment }: Props) {
  const [showReceipt, setShowReceipt] = useState(false);
  const { customers, packages } = useSalonStore();
  const customer = customers.find((item) => item.name === payment.customer);
  const customerPackages = packages.filter((item) => item.customer === payment.customer);

  return (
    <View style={styles.wrap}>
      <View>
        <Text style={styles.title}>{payment.customer}</Text>
        <Text style={styles.meta}>
          {payment.service} • {payment.date} • {payment.method}
        </Text>
      </View>

      <View style={styles.stats}>
        <SmallStat label="Alınan" value={formatCurrency(payment.amount)} />
        <SmallStat label="Kalan" value={formatCurrency(payment.remaining)} warning={payment.remaining > 0} />
        <SmallStat label="Durum" value={payment.status} warning={payment.status !== "Ödendi"} />
      </View>

      <View style={styles.actions}>
        <ActionButton icon="cash-outline" label="Ek Ödeme Al" primary />
        <ActionButton
          icon="logo-whatsapp"
          label="Borç Hatırlat"
          onPress={() =>
            sendPaymentReminder(customer?.phone ?? "905320000000", payment.customer, formatCurrency(payment.remaining))
          }
        />
        <ActionButton icon="document-text-outline" label="Makbuz Önizle" onPress={() => setShowReceipt((value) => !value)} />
      </View>

      {showReceipt ? <ReceiptPreview payment={payment} /> : null}

      <PanelCard title="Müşteri Özeti">
        {customer ? (
          <>
            <CompactRow title={customer.phone} subtitle="Telefon" badge="Kayıtlı" />
            <CompactRow title={customer.packageLabel} subtitle="Paket durumu" badge={formatCurrency(customer.debt)} />
            <Text style={styles.note}>{customer.note}</Text>
          </>
        ) : (
          <Text style={styles.note}>Bu ödeme için müşteri kartı bulunamadı.</Text>
        )}
      </PanelCard>

      <PanelCard title="İlgili Paketler">
        {customerPackages.length > 0 ? (
          customerPackages.map((item) => (
            <CompactRow
              key={item.id}
              title={item.title}
              subtitle={`${item.usedSessions}/${item.totalSessions} seans kullanıldı`}
              badge={formatCurrency(item.totalPrice - item.paid)}
            />
          ))
        ) : (
          <Text style={styles.note}>Bu müşteriye bağlı paket kaydı yok.</Text>
        )}
      </PanelCard>

      <PanelCard title="Tahsilat Yorumu">
        <CompactRow
          title={payment.remaining > 0 ? "Açık ödeme var" : "Ödeme tamamlandı"}
          subtitle={payment.remaining > 0 ? "Müşteriye ödeme hatırlatması gönderilebilir." : "Bu işlem için bekleyen borç görünmüyor."}
          badge={payment.remaining > 0 ? "Takip" : "Tamam"}
        />
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
