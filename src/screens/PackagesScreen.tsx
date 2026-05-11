import { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { NewPackageForm } from "../components/forms/NewPackageForm";
import { ModalShell } from "../components/ModalShell";
import { EmptyState } from "../components/EmptyState";
import { PackageCard } from "../components/PackageCard";
import { PackageDetail } from "../components/PackageDetail";
import { PanelCard } from "../components/PanelCard";
import { Pill } from "../components/Pill";
import { ScreenIntro } from "../components/ScreenIntro";
import { useSalonStore } from "../state/SalonStore";
import type { ServicePackage } from "../types";

type Props = {
  onTakePayment?: (payload: { customer: string; service: string; remaining: number }) => void;
};

export function PackagesScreen({ onTakePayment }: Props) {
  const { packages, usePackageSession } = useSalonStore();
  const [selectedPackage, setSelectedPackage] = useState<ServicePackage | null>(null);
  const [showNewPackage, setShowNewPackage] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Aktif");
  const activeSelectedPackage = useMemo(
    () => packages.find((item) => item.id === selectedPackage?.id) ?? selectedPackage,
    [packages, selectedPackage]
  );
  const filteredPackages = packages.filter((item) => {
    const remainingSessions = item.totalSessions - item.usedSessions;
    const remainingPayment = item.totalPrice - item.paid;

    if (activeFilter === "Ödemesi kalan") {
      return remainingPayment > 0;
    }

    if (activeFilter === "Seansı biten") {
      return remainingSessions === 0;
    }

    if (activeFilter === "Tamamlanan") {
      return remainingSessions === 0 && remainingPayment === 0;
    }

    return remainingSessions > 0;
  });

  return (
    <View style={styles.sectionGap}>
      <ScreenIntro
        title="Paket ve Seanslar"
        description="Kalan seansları, paket tahsilatlarını ve tekrar satış fırsatlarını düzenli takip edin."
        action="Paket Ekle"
        onActionPress={() => setShowNewPackage(true)}
      />
      <View style={styles.filterRow}>
        {["Aktif", "Ödemesi kalan", "Seansı biten", "Tamamlanan"].map((item) => (
          <Pill key={item} label={item} active={activeFilter === item} onPress={() => setActiveFilter(item)} />
        ))}
      </View>
      <PanelCard title={`${filteredPackages.length} paket`}>
        {filteredPackages.length > 0 ? (
          filteredPackages.map((item) => (
            <PackageCard
              key={item.id}
              item={item}
              onUseSession={usePackageSession}
              onOpenDetails={setSelectedPackage}
            />
          ))
        ) : (
          <EmptyState title="Paket bulunamadı" description="Bu filtreye uygun paket veya seans kaydı yok." />
        )}
      </PanelCard>
      <ModalShell
        visible={Boolean(selectedPackage)}
        title="Paket Detayı"
        onClose={() => setSelectedPackage(null)}
      >
        {activeSelectedPackage ? (
          <PackageDetail
            item={activeSelectedPackage}
            onClose={() => setSelectedPackage(null)}
            onTakePayment={(payload) => {
              setSelectedPackage(null);
              onTakePayment?.(payload);
            }}
          />
        ) : null}
      </ModalShell>
      <ModalShell visible={showNewPackage} title="Paket Ekle" onClose={() => setShowNewPackage(false)}>
        <NewPackageForm onDone={() => setShowNewPackage(false)} />
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
  }
});
