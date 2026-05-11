import { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { CompactRow } from "../components/CompactRow";
import { EmptyState } from "../components/EmptyState";
import { InventoryCard } from "../components/InventoryCard";
import { PanelCard } from "../components/PanelCard";
import { Pill } from "../components/Pill";
import { ScreenIntro } from "../components/ScreenIntro";
import { SummaryCard } from "../components/SummaryCard";
import { useSalonStore } from "../state/SalonStore";
import { formatCurrency } from "../utils/format";

export function InventoryScreen() {
  const { adjustInventoryQuantity, inventoryItems } = useSalonStore();
  const [filter, setFilter] = useState("Tümü");
  const categories = useMemo(() => ["Tümü", "Düşük Stok", ...Array.from(new Set(inventoryItems.map((item) => item.category)))], []);
  const filteredItems = inventoryItems.filter((item) => {
    if (filter === "Tümü") {
      return true;
    }

    if (filter === "Düşük Stok") {
      return item.quantity <= item.minQuantity;
    }

    return item.category === filter;
  });
  const lowStockCount = inventoryItems.filter((item) => item.quantity <= item.minQuantity).length;
  const stockValue = inventoryItems.reduce((sum, item) => sum + item.quantity * item.cost, 0);

  return (
    <View style={styles.sectionGap}>
      <ScreenIntro
        title="Stok Takibi"
        description="Bakım ürünleri ve sarf malzemeleri takip edin, düşük stokları erken görün."
        action="Ürün Ekle"
      />

      <View style={styles.summaryGrid}>
        <SummaryCard label="Ürün" value={`${inventoryItems.length}`} detail="Takip edilen kalem" />
        <SummaryCard label="Düşük Stok" value={`${lowStockCount}`} detail="Sipariş gerektirebilir" warning={lowStockCount > 0} />
        <SummaryCard label="Stok Değeri" value={formatCurrency(stockValue)} detail="Tahmini maliyet" />
      </View>

      <View style={styles.filterRow}>
        {categories.map((item) => (
          <Pill key={item} label={item} active={filter === item} onPress={() => setFilter(item)} />
        ))}
      </View>

      <PanelCard title={`${filteredItems.length} stok kalemi`}>
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <InventoryCard key={item.id} item={item} onAdjust={adjustInventoryQuantity} />
          ))
        ) : (
          <EmptyState title="Stok bulunamadı" description="Seçili filtreye uygun ürün veya sarf malzeme yok." />
        )}
      </PanelCard>

      <PanelCard title="Sipariş Önerileri">
        {inventoryItems
          .filter((item) => item.quantity <= item.minQuantity)
          .map((item) => (
            <CompactRow
              key={item.id}
              title={item.name}
              subtitle={`${item.supplier} • minimum ${item.minQuantity} ${item.unit}`}
              badge={`${item.quantity} ${item.unit}`}
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
