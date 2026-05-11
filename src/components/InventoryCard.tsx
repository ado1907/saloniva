import { StyleSheet, Text, View } from "react-native";
import { MiniButton } from "./MiniButton";
import { SmallStat } from "./SmallStat";
import { colors } from "../theme/colors";
import { radius } from "../theme/spacing";
import type { InventoryItem } from "../types";
import { formatCurrency } from "../utils/format";

type Props = {
  item: InventoryItem;
  onAdjust?: (itemId: string, delta: number) => void;
};

export function InventoryCard({ item, onAdjust }: Props) {
  const lowStock = item.quantity <= item.minQuantity;
  const value = item.quantity * item.cost;

  return (
    <View style={styles.card}>
      <View style={styles.rowBetween}>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.subtitle}>
            {item.category} • {item.supplier}
          </Text>
        </View>
        <View style={[styles.badge, lowStock ? styles.warningBadge : styles.okBadge]}>
          <Text style={styles.badgeText}>{lowStock ? "Düşük Stok" : "Yeterli"}</Text>
        </View>
      </View>

      <View style={styles.stats}>
        <SmallStat label="Stok" value={`${item.quantity} ${item.unit}`} warning={lowStock} />
        <SmallStat label="Minimum" value={`${item.minQuantity} ${item.unit}`} />
        <SmallStat label="Stok değeri" value={formatCurrency(value)} />
      </View>

      <View style={styles.actions}>
        <MiniButton icon="add-circle-outline" label="Stok Ekle" onPress={() => onAdjust?.(item.id, 1)} />
        <MiniButton icon="remove-circle-outline" label="Kullanım" onPress={() => onAdjust?.(item.id, -1)} />
        <MiniButton icon="create-outline" label="Düzenle" />
      </View>
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
    flex: 1,
    minWidth: 190
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800"
  },
  subtitle: {
    color: colors.muted,
    lineHeight: 20,
    marginTop: 2
  },
  badge: {
    borderRadius: radius.pill,
    paddingHorizontal: 9,
    paddingVertical: 5
  },
  warningBadge: {
    backgroundColor: colors.red
  },
  okBadge: {
    backgroundColor: colors.green
  },
  badgeText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "800"
  },
  stats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  }
});
