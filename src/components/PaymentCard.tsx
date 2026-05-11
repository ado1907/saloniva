import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { radius } from "../theme/spacing";
import type { Payment, PaymentStatus } from "../types";
import { formatCurrency } from "../utils/format";
import { MiniButton } from "./MiniButton";

type Props = {
  payment: Payment;
  onOpenDetails?: (payment: Payment) => void;
};

export function PaymentCard({ payment, onOpenDetails }: Props) {
  return (
    <Pressable onPress={() => onOpenDetails?.(payment)} style={styles.card}>
      <View style={styles.rowBetween}>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>{payment.customer}</Text>
          <Text style={styles.subtitle}>
            {payment.service} • {payment.date} • {payment.method}
          </Text>
        </View>
        <PaymentStatusBadge status={payment.status} />
      </View>
      <View style={styles.amountRow}>
        <View>
          <Text style={styles.label}>Alınan</Text>
          <Text style={styles.amount}>{formatCurrency(payment.amount)}</Text>
        </View>
        <View>
          <Text style={styles.label}>Kalan</Text>
          <Text style={[styles.amount, payment.remaining > 0 ? styles.warning : null]}>
            {formatCurrency(payment.remaining)}
          </Text>
        </View>
      </View>
      <View style={styles.actions}>
        <MiniButton icon="cash-outline" label="Ödeme Al" />
        <MiniButton icon="logo-whatsapp" label="Hatırlat" />
        <MiniButton icon="document-text-outline" label="Detay" />
      </View>
      <Text style={styles.openHint}>Ödeme detayını aç</Text>
    </Pressable>
  );
}

function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const styleByStatus: Record<PaymentStatus, object> = {
    Ödendi: styles.green,
    "Kısmi Ödendi": styles.amber,
    Bekliyor: styles.red,
    İade: styles.gray
  };

  return (
    <View style={[styles.badge, styleByStatus[status]]}>
      <Text style={styles.badgeText}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.softBorder,
    backgroundColor: colors.card,
    padding: 13,
    gap: 12
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    flexWrap: "wrap"
  },
  titleWrap: {
    flex: 1
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800"
  },
  subtitle: {
    color: "#706762",
    lineHeight: 20,
    marginTop: 2
  },
  badge: {
    borderRadius: radius.pill,
    paddingHorizontal: 9,
    paddingVertical: 5
  },
  badgeText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "800"
  },
  green: {
    backgroundColor: colors.green
  },
  amber: {
    backgroundColor: colors.champagneSoft
  },
  red: {
    backgroundColor: colors.red
  },
  gray: {
    backgroundColor: colors.gray
  },
  amountRow: {
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap"
  },
  label: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700"
  },
  amount: {
    color: colors.text,
    fontSize: 19,
    fontWeight: "800",
    marginTop: 3
  },
  warning: {
    color: colors.danger
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  openHint: {
    color: colors.accent,
    fontWeight: "800",
    fontSize: 12
  }
});
