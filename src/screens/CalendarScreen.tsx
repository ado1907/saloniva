import { StyleSheet, View } from "react-native";
import { AppointmentCard } from "../components/AppointmentCard";
import { AppointmentDetail } from "../components/AppointmentDetail";
import { EmptyState } from "../components/EmptyState";
import { ModalShell } from "../components/ModalShell";
import { PanelCard } from "../components/PanelCard";
import { Pill } from "../components/Pill";
import { ScreenIntro } from "../components/ScreenIntro";
import { useSalonStore } from "../state/SalonStore";
import { useState } from "react";
import { TextInput } from "react-native";
import type { Appointment } from "../types";
import { appointmentPaymentId, createPaymentFromAppointment } from "../utils/appointmentPayment";
import { colors } from "../theme/colors";
import { radius } from "../theme/spacing";

export function CalendarScreen() {
  const { addPayment, appointments, markAppointmentCompleted, payments } = useSalonStore();
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [activeStatus, setActiveStatus] = useState("Tümü");
  const [query, setQuery] = useState("");
  const filteredAppointments = appointments
    .filter((appointment) =>
      `${appointment.customer} ${appointment.service} ${appointment.staff}`.toLowerCase().includes(query.toLowerCase())
    )
    .filter((appointment) => (activeStatus === "Tümü" ? true : appointment.status === activeStatus));

  const handleTakePayment = (appointment: Appointment) => {
    if (!payments.some((payment) => payment.id === appointmentPaymentId(appointment))) {
      addPayment(createPaymentFromAppointment(appointment));
    }

    markAppointmentCompleted(appointment.id);
  };

  return (
    <View style={styles.sectionGap}>
      <ScreenIntro
        title="Randevu Takvimi"
        description="Günlük akışı, personel yoğunluğunu ve randevu durumlarını tek ekranda yönetin."
        action="Yeni Randevu"
      />
      <View style={styles.filterRow}>
        {["Bugün", "Gün", "Hafta", "Ay"].map((item, index) => (
          <Pill key={item} label={item} active={index === 0} />
        ))}
      </View>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Müşteri, hizmet veya personel ara"
        placeholderTextColor="#8f8a86"
        style={styles.searchInput}
      />
      <View style={styles.filterRow}>
        {["Tümü", "Planlandı", "Geldi", "Tamamlandı", "Gelmedi", "İptal"].map((item) => (
          <Pill key={item} label={item} active={activeStatus === item} onPress={() => setActiveStatus(item)} />
        ))}
      </View>
      <PanelCard title="9 Mayıs Cumartesi">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
            onOpenDetails={setSelectedAppointment}
              onTakePayment={handleTakePayment}
          />
          ))
        ) : (
          <EmptyState title="Randevu bulunamadı" description="Arama veya durum filtresini değiştirerek tekrar deneyin." />
        )}
      </PanelCard>
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
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  searchInput: {
    minHeight: 46,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    color: colors.text
  }
});
