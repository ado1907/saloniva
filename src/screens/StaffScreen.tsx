import { useState } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import { CompactRow } from "../components/CompactRow";
import { ModalShell } from "../components/ModalShell";
import { PanelCard } from "../components/PanelCard";
import { Pill } from "../components/Pill";
import { ScreenIntro } from "../components/ScreenIntro";
import { StaffCard } from "../components/StaffCard";
import { StaffDetail } from "../components/StaffDetail";
import { SummaryCard } from "../components/SummaryCard";
import { useSalonStore } from "../state/SalonStore";
import type { StaffMember } from "../types";
import { formatCurrency } from "../utils/format";

export function StaffScreen() {
  const { width } = useWindowDimensions();
  const isWide = width >= 900;
  const [filter, setFilter] = useState("Tümü");
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const { staffMembers } = useSalonStore();

  const filteredStaff =
    filter === "Tümü"
      ? staffMembers
      : staffMembers.filter((member) => (filter === "Aktif" ? member.active : !member.active));
  const activeCount = staffMembers.filter((member) => member.active).length;
  const totalAppointments = staffMembers.reduce((sum, member) => sum + member.appointmentsToday, 0);
  const totalRevenue = staffMembers.reduce((sum, member) => sum + member.monthlyRevenue, 0);

  return (
    <View style={styles.sectionGap}>
      <ScreenIntro
        title="Personel Yönetimi"
        description="Personel yoğunluğu, yetkinlikleri ve gelir katkısını tek yerden takip edin."
        action="Personel Ekle"
      />

      <View style={styles.summaryGrid}>
        <SummaryCard label="Aktif Personel" value={`${activeCount}`} detail="Bugün çalışabilir durumda" />
        <SummaryCard label="Bugünkü Randevu" value={`${totalAppointments}`} detail="Personel bazlı toplam" />
        <SummaryCard label="Aylık Katkı" value={formatCurrency(totalRevenue)} detail="Personel gelir toplamı" />
      </View>

      <View style={styles.filterRow}>
        {["Tümü", "Aktif", "Pasif"].map((item) => (
          <Pill key={item} label={item} active={filter === item} onPress={() => setFilter(item)} />
        ))}
      </View>

      <View style={[styles.columns, isWide ? styles.columnsWide : null]}>
        <PanelCard title={`${filteredStaff.length} personel`} style={styles.mainColumn}>
          {filteredStaff.map((member) => (
            <StaffCard key={member.id} member={member} onOpenDetails={setSelectedStaff} />
          ))}
        </PanelCard>
        <View style={styles.sideColumn}>
          <PanelCard title="Bugünkü Yoğunluk">
            {staffMembers
              .filter((member) => member.active)
              .map((member) => (
                <CompactRow
                  key={member.id}
                  title={member.name}
                  subtitle={member.nextAppointment}
                  badge={`${member.appointmentsToday} randevu`}
                />
              ))}
          </PanelCard>
          <PanelCard title="Yetkinlik Haritası">
            <CompactRow title="Lazer" subtitle="1 uzman" badge="Elif" />
            <CompactRow title="Tırnak" subtitle="1 uzman" badge="Nur" />
            <CompactRow title="Kaş/Kirpik" subtitle="1 uzman" badge="Seda" />
          </PanelCard>
        </View>
      </View>
      <ModalShell
        visible={Boolean(selectedStaff)}
        title="Personel Detayı"
        onClose={() => setSelectedStaff(null)}
      >
        {selectedStaff ? <StaffDetail member={selectedStaff} /> : null}
      </ModalShell>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionGap: {
    gap: 16
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  columns: {
    gap: 14
  },
  columnsWide: {
    flexDirection: "row",
    alignItems: "flex-start"
  },
  mainColumn: {
    flex: 1.5
  },
  sideColumn: {
    flex: 1,
    gap: 14
  }
});
