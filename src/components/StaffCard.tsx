import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { radius } from "../theme/spacing";
import type { StaffMember } from "../types";
import { formatCurrency } from "../utils/format";
import { MiniButton } from "./MiniButton";
import { SmallStat } from "./SmallStat";

type Props = {
  member: StaffMember;
  onOpenDetails?: (member: StaffMember) => void;
};

export function StaffCard({ member, onOpenDetails }: Props) {
  return (
    <Pressable onPress={() => onOpenDetails?.(member)} style={styles.card}>
      <View style={styles.rowBetween}>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>{member.name}</Text>
          <Text style={styles.subtitle}>
            {member.role} • {member.phone}
          </Text>
        </View>
        <View style={[styles.badge, member.active ? styles.active : styles.passive]}>
          <Text style={styles.badgeText}>{member.active ? "Aktif" : "Pasif"}</Text>
        </View>
      </View>
      <Text style={styles.services}>{member.services.join(" • ")}</Text>
      <View style={styles.stats}>
        <SmallStat label="Bugünkü randevu" value={`${member.appointmentsToday}`} />
        <SmallStat label="Aylık gelir" value={formatCurrency(member.monthlyRevenue)} />
        <SmallStat label="Sıradaki" value={member.nextAppointment} />
      </View>
      <View style={styles.actions}>
        <MiniButton icon="calendar-outline" label="Randevuları" />
        <MiniButton icon="create-outline" label="Düzenle" />
        <MiniButton icon={member.active ? "pause-circle-outline" : "play-circle-outline"} label={member.active ? "Pasif Yap" : "Aktif Yap"} />
      </View>
      <Text style={styles.openHint}>Personel detayını aç</Text>
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
  services: {
    color: colors.muted,
    lineHeight: 20
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
  stats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
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
