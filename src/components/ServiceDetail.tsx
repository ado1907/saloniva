import { StyleSheet, Text, View } from "react-native";
import { ActionButton } from "./ActionButton";
import { CompactRow } from "./CompactRow";
import { PanelCard } from "./PanelCard";
import { SmallStat } from "./SmallStat";
import { useSalonStore } from "../state/SalonStore";
import { colors } from "../theme/colors";
import type { SalonService } from "../types";
import { formatCurrency } from "../utils/format";

type Props = {
  service: SalonService;
};

export function ServiceDetail({ service }: Props) {
  const { appointments, staffMembers } = useSalonStore();
  const serviceAppointments = appointments.filter((appointment) => appointment.service === service.name);
  const serviceRevenue = serviceAppointments.reduce((sum, appointment) => sum + appointment.price, 0);
  const matchedStaff = staffMembers.filter((member) =>
    service.staff.some((staffName) => member.name.startsWith(staffName))
  );

  return (
    <View style={styles.wrap}>
      <View>
        <Text style={styles.title}>{service.name}</Text>
        <Text style={styles.meta}>
          {service.category} • {service.durationMinutes} dk • {service.active ? "Aktif" : "Pasif"}
        </Text>
      </View>

      <View style={styles.stats}>
        <SmallStat label="Liste fiyatı" value={formatCurrency(service.price)} />
        <SmallStat label="Randevu sayısı" value={`${serviceAppointments.length}`} />
        <SmallStat label="Gelir" value={formatCurrency(serviceRevenue)} />
      </View>

      <View style={styles.actions}>
        <ActionButton icon="create-outline" label="Hizmeti Düzenle" primary />
        <ActionButton icon="calendar-outline" label="Randevu Oluştur" />
        <ActionButton icon={service.active ? "pause-circle-outline" : "play-circle-outline"} label={service.active ? "Pasif Yap" : "Aktif Yap"} />
      </View>

      <PanelCard title="Randevuya Etkisi">
        <CompactRow title={`${service.durationMinutes} dakika`} subtitle="Takvimde otomatik süre önerisi" badge="Hazır" />
        <CompactRow title={formatCurrency(service.price)} subtitle="Randevu ve ödeme formuna otomatik fiyat" badge="Hazır" />
        <CompactRow title={service.staff.join(", ")} subtitle="Hizmete atanmış personel" badge={`${service.staff.length}`} />
      </PanelCard>

      <PanelCard title="Uygun Personel">
        {matchedStaff.length > 0 ? (
          matchedStaff.map((member) => (
            <CompactRow
              key={member.id}
              title={member.name}
              subtitle={`${member.role} • ${member.appointmentsToday} randevu bugün`}
              badge={member.active ? "Aktif" : "Pasif"}
            />
          ))
        ) : (
          <Text style={styles.note}>Bu hizmete bağlı uzman personel bulunamadı.</Text>
        )}
      </PanelCard>

      <PanelCard title="Son Randevular">
        {serviceAppointments.length > 0 ? (
          serviceAppointments.slice(0, 4).map((appointment) => (
            <CompactRow
              key={appointment.id}
              title={`${appointment.time} - ${appointment.customer}`}
              subtitle={`${appointment.staff} • ${appointment.status}`}
              badge={formatCurrency(appointment.price)}
            />
          ))
        ) : (
          <Text style={styles.note}>Bu hizmet için henüz randevu kaydı yok.</Text>
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
