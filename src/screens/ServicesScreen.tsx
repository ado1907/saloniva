import { useMemo, useState } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import { CompactRow } from "../components/CompactRow";
import { NewServiceForm } from "../components/forms/NewServiceForm";
import { ModalShell } from "../components/ModalShell";
import { PanelCard } from "../components/PanelCard";
import { Pill } from "../components/Pill";
import { ScreenIntro } from "../components/ScreenIntro";
import { ServiceCard } from "../components/ServiceCard";
import { ServiceDetail } from "../components/ServiceDetail";
import { SummaryCard } from "../components/SummaryCard";
import { useSalonStore } from "../state/SalonStore";
import type { SalonService } from "../types";
import { formatCurrency } from "../utils/format";

export function ServicesScreen() {
  const { width } = useWindowDimensions();
  const isWide = width >= 900;
  const [activeCategory, setActiveCategory] = useState("Tümü");
  const [selectedService, setSelectedService] = useState<SalonService | null>(null);
  const [showNewService, setShowNewService] = useState(false);
  const { salonServices, toggleSalonService } = useSalonStore();

  const categories = useMemo(() => ["Tümü", ...Array.from(new Set(salonServices.map((service) => service.category)))], []);
  const filteredServices =
    activeCategory === "Tümü"
      ? salonServices
      : salonServices.filter((service) => service.category === activeCategory);
  const activeServices = salonServices.filter((service) => service.active);
  const averagePrice = activeServices.reduce((sum, service) => sum + service.price, 0) / activeServices.length;

  return (
    <View style={styles.sectionGap}>
      <ScreenIntro
        title="Hizmet ve Fiyat Listesi"
        description="Randevu oluştururken süre ve fiyatın otomatik gelmesi için salon hizmetlerinizi düzenleyin."
        action="Hizmet Ekle"
        onActionPress={() => setShowNewService(true)}
      />

      <View style={styles.summaryGrid}>
        <SummaryCard label="Aktif Hizmet" value={`${activeServices.length}`} detail="Randevuda seçilebilir" />
        <SummaryCard label="Ortalama Fiyat" value={formatCurrency(averagePrice)} detail="Aktif hizmet ortalaması" />
        <SummaryCard label="Kategori" value={`${categories.length - 1}`} detail="Salon hizmet grubu" />
      </View>

      <View style={styles.filterRow}>
        {categories.map((category) => (
          <Pill
            key={category}
            label={category}
            active={activeCategory === category}
            onPress={() => setActiveCategory(category)}
          />
        ))}
      </View>

      <View style={[styles.columns, isWide ? styles.columnsWide : null]}>
        <PanelCard title={`${filteredServices.length} hizmet`} style={styles.mainColumn}>
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onOpenDetails={setSelectedService}
              onToggleActive={toggleSalonService}
            />
          ))}
        </PanelCard>
        <View style={styles.sideColumn}>
          <PanelCard title="Kategori Özeti">
            {categories
              .filter((category) => category !== "Tümü")
              .map((category) => {
                const count = salonServices.filter((service) => service.category === category).length;
                return <CompactRow key={category} title={category} subtitle={`${count} hizmet`} badge="Aktif" />;
              })}
          </PanelCard>
          <PanelCard title="Randevu Etkisi">
            <CompactRow title="Otomatik Süre" subtitle="Hizmet seçilince takvime süre gelir." badge="Hazır" />
            <CompactRow title="Otomatik Fiyat" subtitle="Randevu ve ödeme ekranına fiyat taşınır." badge="Hazır" />
            <CompactRow title="Personel Uygunluğu" subtitle="Hizmete uygun personel listelenir." badge="Planlı" />
          </PanelCard>
        </View>
      </View>
      <ModalShell
        visible={Boolean(selectedService)}
        title="Hizmet Detayı"
        onClose={() => setSelectedService(null)}
      >
        {selectedService ? <ServiceDetail service={selectedService} /> : null}
      </ModalShell>
      <ModalShell visible={showNewService} title="Hizmet Ekle" onClose={() => setShowNewService(false)}>
        <NewServiceForm onDone={() => setShowNewService(false)} />
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
