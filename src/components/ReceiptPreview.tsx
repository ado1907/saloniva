import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { radius } from "../theme/spacing";
import type { Payment } from "../types";
import { formatCurrency } from "../utils/format";

type Props = {
  payment: Payment;
  salonName?: string;
};

export function ReceiptPreview({ payment, salonName = "Saloniva Güzellik" }: Props) {
  return (
    <View style={styles.receipt}>
      <View style={styles.header}>
        <Text style={styles.salon}>{salonName}</Text>
        <Text style={styles.receiptNo}>Makbuz #{payment.id.toUpperCase()}</Text>
      </View>

      <View style={styles.divider} />

      <Row label="Müşteri" value={payment.customer} />
      <Row label="İşlem" value={payment.service} />
      <Row label="Tarih" value={payment.date} />
      <Row label="Yöntem" value={payment.method} />
      <Row label="Durum" value={payment.status} />

      <View style={styles.divider} />

      <Row label="Alınan Tutar" value={formatCurrency(payment.amount)} strong />
      <Row label="Kalan Ödeme" value={formatCurrency(payment.remaining)} warning={payment.remaining > 0} />

      <Text style={styles.note}>
        Bu önizleme demo amaçlıdır. Resmi muhasebe belgesi yerine geçmez.
      </Text>
    </View>
  );
}

function Row({ label, value, strong, warning }: { label: string; value: string; strong?: boolean; warning?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, strong ? styles.strong : null, warning ? styles.warning : null]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  receipt: {
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.softBorder,
    backgroundColor: colors.card,
    padding: 16,
    gap: 10
  },
  header: {
    gap: 4
  },
  salon: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "800"
  },
  receiptNo: {
    color: colors.muted,
    fontWeight: "700"
  },
  divider: {
    height: 1,
    backgroundColor: colors.softBorder,
    marginVertical: 4
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12
  },
  label: {
    color: colors.muted,
    fontWeight: "700"
  },
  value: {
    color: colors.text,
    fontWeight: "800",
    textAlign: "right",
    flex: 1
  },
  strong: {
    fontSize: 17
  },
  warning: {
    color: colors.danger
  },
  note: {
    color: colors.muted,
    lineHeight: 19,
    marginTop: 4
  }
});
