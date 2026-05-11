import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { radius } from "../theme/spacing";
import type { Customer } from "../types";
import { formatCurrency } from "../utils/format";
import { sendWinbackMessage } from "../utils/whatsapp";
import { MiniButton } from "./MiniButton";
import { SmallStat } from "./SmallStat";

type Props = {
  customer: Customer;
  onOpenDetails?: (customer: Customer) => void;
};

export function CustomerCard({ customer, onOpenDetails }: Props) {
  return (
    <Pressable onPress={() => onOpenDetails?.(customer)} style={styles.card}>
      <View style={styles.rowBetween}>
        <View>
          <Text style={styles.title}>{customer.name}</Text>
          <Text style={styles.subtitle}>
            {customer.phone} • Son ziyaret: {customer.lastVisit}
          </Text>
        </View>
        <MiniButton icon="logo-whatsapp" label="WhatsApp" onPress={() => sendWinbackMessage(customer.phone, customer.name)} />
      </View>
      <View style={styles.stats}>
        <SmallStat label="Toplam" value={formatCurrency(customer.totalSpent)} />
        <SmallStat label="Borç" value={formatCurrency(customer.debt)} warning={customer.debt > 0} />
        <SmallStat label="Paket" value={customer.packageLabel} />
      </View>
      <Text style={styles.note}>{customer.note}</Text>
      <Text style={styles.openHint}>Müşteri kartını aç</Text>
    </Pressable>
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
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800"
  },
  subtitle: {
    color: "#706762",
    lineHeight: 20
  },
  stats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  note: {
    color: "#706762",
    lineHeight: 20
  },
  openHint: {
    color: colors.accent,
    fontWeight: "800",
    fontSize: 12
  }
});
