import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { radius } from "../theme/spacing";
import type { SalonService } from "../types";
import { formatCurrency } from "../utils/format";
import { MiniButton } from "./MiniButton";

type Props = {
  service: SalonService;
  onOpenDetails?: (service: SalonService) => void;
  onToggleActive?: (serviceId: string) => void;
};

export function ServiceCard({ service, onOpenDetails, onToggleActive }: Props) {
  return (
    <Pressable onPress={() => onOpenDetails?.(service)} style={styles.card}>
      <View style={styles.rowBetween}>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>{service.name}</Text>
          <Text style={styles.subtitle}>
            {service.category} • {service.durationMinutes} dk • {service.staff.join(", ")}
          </Text>
        </View>
        <View style={[styles.badge, service.active ? styles.active : styles.passive]}>
          <Text style={styles.badgeText}>{service.active ? "Aktif" : "Pasif"}</Text>
        </View>
      </View>
      <View style={styles.priceRow}>
        <View>
          <Text style={styles.label}>Liste fiyatı</Text>
          <Text style={styles.price}>{formatCurrency(service.price)}</Text>
        </View>
        <View style={styles.actions}>
          <MiniButton icon="create-outline" label="Düzenle" />
          <MiniButton icon="calendar-outline" label="Randevu" />
          <MiniButton
            icon={service.active ? "pause-circle-outline" : "play-circle-outline"}
            label={service.active ? "Pasif Yap" : "Aktif Yap"}
            onPress={() => onToggleActive?.(service.id)}
          />
        </View>
      </View>
      <Text style={styles.openHint}>Hizmet detayını aç</Text>
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
  active: {
    backgroundColor: colors.green
  },
  passive: {
    backgroundColor: colors.gray
  },
  badgeText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "800"
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 12,
    flexWrap: "wrap"
  },
  label: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700"
  },
  price: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "800",
    marginTop: 3
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
