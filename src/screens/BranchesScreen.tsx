import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { BranchCard } from "../components/BranchCard";
import { CompactRow } from "../components/CompactRow";
import { EmptyState } from "../components/EmptyState";
import { PanelCard } from "../components/PanelCard";
import { Pill } from "../components/Pill";
import { ScreenIntro } from "../components/ScreenIntro";
import { SummaryCard } from "../components/SummaryCard";
import { branches } from "../data/demoData";
import { formatCurrency } from "../utils/format";

export function BranchesScreen() {
  const [filter, setFilter] = useState("Tümü");
  const filteredBranches = branches.filter((branch) => (filter === "Tümü" ? true : branch.status === filter));
  const activeCount = branches.filter((branch) => branch.status === "Aktif").length;
  const totalRevenue = branches.reduce((sum, branch) => sum + branch.monthlyRevenue, 0);
  const totalAppointments = branches.reduce((sum, branch) => sum + branch.appointmentsToday, 0);

  return (
    <View style={styles.sectionGap}>
      <ScreenIntro
        title="Çok Şube"
        description="Birden fazla salon şubesini aynı hesap altında izlemek için yönetim taslağı."
        action="Şube Ekle"
      />

      <View style={styles.summaryGrid}>
        <SummaryCard label="Aktif Şube" value={`${activeCount}`} detail="Hizmet veren şube" />
        <SummaryCard label="Bugünkü Randevu" value={`${totalAppointments}`} detail="Tüm şubeler toplamı" />
        <SummaryCard label="Aylık Gelir" value={formatCurrency(totalRevenue)} detail="Şube toplamı" />
      </View>

      <View style={styles.filterRow}>
        {["Tümü", "Aktif", "Kurulumda"].map((item) => (
          <Pill key={item} label={item} active={filter === item} onPress={() => setFilter(item)} />
        ))}
      </View>

      <PanelCard title={`${filteredBranches.length} şube`}>
        {filteredBranches.length > 0 ? (
          filteredBranches.map((branch) => <BranchCard key={branch.id} branch={branch} />)
        ) : (
          <EmptyState title="Şube bulunamadı" description="Seçili duruma uygun şube kaydı yok." />
        )}
      </PanelCard>

      <PanelCard title="Şube Karşılaştırması">
        {branches
          .filter((branch) => branch.status === "Aktif")
          .map((branch) => (
            <CompactRow
              key={branch.id}
              title={branch.name}
              subtitle={`${branch.appointmentsToday} randevu • ${branch.staffCount} personel`}
              badge={formatCurrency(branch.monthlyRevenue)}
            />
          ))}
      </PanelCard>
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
  }
});
