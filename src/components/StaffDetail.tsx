import { StyleSheet, Text, View } from "react-native";
import { ActionButton } from "./ActionButton";
import { CompactRow } from "./CompactRow";
import { PanelCard } from "./PanelCard";
import { SmallStat } from "./SmallStat";
import { useSalonStore } from "../state/SalonStore";
import { colors } from "../theme/colors";
import type { StaffMember } from "../types";
import { formatCurrency } from "../utils/format";

type Props = {
  member: StaffMember;
};

export function StaffDetail({ member }: Props) {
  const { appointments, salonServices } = useSalonStore();
  const firstName = member.name.split(" ")[0];
  const memberAppointments = appointments.filter((appointment) => appointment.staff === firstName);
  const relatedServices = salonServices.filter((service) => service.staff.includes(firstName));

  return (
    <View style={styles.wrap}>
      <View>
        <Text style={styles.title}>{member.name}</Text>
        <Text style={styles.meta}>
          {member.role} • {member.phone} • {member.active ? "Aktif" : "Pasif"}
        </Text>
      </View>

      <View style={styles.stats}>
        <SmallStat label="Bugünkü randevu" value={`${member.appointmentsToday}`} />
        <SmallStat label="Aylık gelir" value={formatCurrency(member.monthlyRevenue)} />
        <SmallStat label="Sıradaki" value={member.nextAppointment} />
      </View>

      <View style={styles.actions}>
        <ActionButton icon="calendar-outline" label="Randevularını Gör" primary />
        <ActionButton icon="create-outline" label="Personeli Düzenle" />
        <ActionButton icon={member.active ? "pause-circle-outline" : "play-circle-outline"} label={member.active ? "Pasif Yap" : "Aktif Yap"} />
      </View>

      <PanelCard title="Yetkinlikler">
        {member.services.map((service) => (
          <CompactRow key={service} title={service} subtitle="Personel yetkinliği" badge="Aktif" />
        ))}
      </PanelCard>

      <PanelCard title="Bugünkü Randevular">
        {memberAppointments.length > 0 ? (
          memberAppointments.map((appointment) => (
            <CompactRow
              key={appointment.id}
              title={`${appointment.time} - ${appointment.customer}`}
              subtitle={`${appointment.service} • ${appointment.status}`}
              badge={formatCurrency(appointment.price)}
            />
          ))
        ) : (
          <Text style={styles.note}>Bu personel için bugün kayıtlı randevu yok.</Text>
        )}
      </PanelCard>

      <PanelCard title="Atanmış Hizmetler">
        {relatedServices.length > 0 ? (
          relatedServices.map((service) => (
            <CompactRow
              key={service.id}
              title={service.name}
              subtitle={`${service.durationMinutes} dk • ${service.category}`}
              badge={formatCurrency(service.price)}
            />
          ))
        ) : (
          <Text style={styles.note}>Bu personele atanmış hizmet bulunamadı.</Text>
        )}
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
