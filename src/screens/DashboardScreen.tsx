import { StyleSheet, View } from "react-native";
import { AlertCenter } from "../components/AlertCenter";
import { AppointmentCard } from "../components/AppointmentCard";
import { BusinessSnapshot } from "../components/BusinessSnapshot";
import { CinematicSalonHero, VisualMoodBoard } from "../components/CinematicSalonHero";
import { CompactRow } from "../components/CompactRow";
import { PanelCard } from "../components/PanelCard";
import { PremiumTrendCard } from "../components/PremiumTrendCard";
import { services, staff } from "../data/demoData";
import { useSalonStore } from "../state/SalonStore";
import { formatCurrency } from "../utils/format";
import { useState } from "react";
import type { Appointment } from "../types";
import { ModalShell } from "../components/ModalShell";
import { AppointmentDetail } from "../components/AppointmentDetail";

type Props = {
  isWide: boolean;
};

export function DashboardScreen({ isWide }: Props) {
  const { appointments, markAppointmentCompleted, totals, updateAppointmentStatus } = useSalonStore();
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  return (
    <View style={styles.sectionGap}>
      <CinematicSalonHero />
      <BusinessSnapshot />
      <VisualMoodBoard />
      <View style={[styles.metricsGrid, isWide ? styles.metricsGridWide : null]}>
        <PremiumTrendCard title="Bugünkü Randevu" value="18" detail={`${totals.completedAppointments} tamamlandı, 14 bekliyor`} points={[38, 52, 66, 82, 74, 92]} />
        <PremiumTrendCard title="Bugünkü Gelir" value={formatCurrency(totals.expectedRevenue)} detail="Tahmini toplam" points={[30, 46, 42, 70, 78, 88]} tone="gold" />
        <PremiumTrendCard title="Bekleyen Ödeme" value={formatCurrency(totals.debt)} detail="Açık müşteri ödemesi" points={[78, 68, 55, 44, 38, 30]} />
        <PremiumTrendCard title="Gelmedi / İptal" value={`${totals.missedAppointments}`} detail="Bugünkü kayıp randevu" points={[18, 24, 15, 22, 12, 10]} tone="gold" />
      </View>
      <View style={[styles.columns, isWide ? styles.columnsWide : null]}>
        <PanelCard title="Bugünün Randevuları" action="Tümünü gör" style={styles.mainColumn}>
          {appointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onComplete={markAppointmentCompleted}
              onStatusChange={updateAppointmentStatus}
              onOpenDetails={setSelectedAppointment}
            />
          ))}
        </PanelCard>
        <View style={styles.sideColumn}>
          <AlertCenter />
          <PanelCard title="Yaklaşanlar">
            {appointments.slice(1, 4).map((appointment) => (
              <CompactRow
                key={appointment.id}
                title={`${appointment.time} - ${appointment.customer}`}
                subtitle={`${appointment.service} • ${appointment.staff}`}
                badge={appointment.status}
              />
            ))}
          </PanelCard>
          <PanelCard title="En Çok Yapılan Hizmetler">
            {services.map((service) => (
              <CompactRow
                key={service.name}
                title={service.name}
                subtitle={`${service.count} işlem`}
                badge={formatCurrency(service.revenue)}
              />
            ))}
          </PanelCard>
          <PanelCard title="Personel Performansı">
            {staff.map((member) => (
              <CompactRow
                key={member.name}
                title={member.name}
                subtitle={`${member.count} randevu`}
                badge={formatCurrency(member.revenue)}
              />
            ))}
          </PanelCard>
        </View>
      </View>
      <ModalShell
        visible={Boolean(selectedAppointment)}
        title="Randevu Detayı"
        onClose={() => setSelectedAppointment(null)}
      >
        {selectedAppointment ? (
          <AppointmentDetail appointment={selectedAppointment} onClose={() => setSelectedAppointment(null)} />
        ) : null}
      </ModalShell>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionGap: {
    gap: 16
  },
  metricsGrid: {
    gap: 12
  },
  metricsGridWide: {
    flexDirection: "row"
  },
  columns: {
    gap: 14
  },
  columnsWide: {
    flexDirection: "row",
    alignItems: "flex-start"
  },
  mainColumn: {
    flex: 1.7
  },
  sideColumn: {
    flex: 1,
    gap: 14
  }
});
