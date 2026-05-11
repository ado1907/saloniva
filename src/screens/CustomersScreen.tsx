import { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { CustomerCard } from "../components/CustomerCard";
import { CustomerDetail } from "../components/CustomerDetail";
import { EmptyState } from "../components/EmptyState";
import { ModalShell } from "../components/ModalShell";
import { PanelCard } from "../components/PanelCard";
import { Pill } from "../components/Pill";
import { ScreenIntro } from "../components/ScreenIntro";
import { useSalonStore } from "../state/SalonStore";
import { colors } from "../theme/colors";
import { radius } from "../theme/spacing";
import type { Customer } from "../types";

export function CustomersScreen() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Tümü");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const { customers } = useSalonStore();
  const filteredCustomers = customers
    .filter((customer) =>
      `${customer.name} ${customer.phone} ${customer.note}`.toLowerCase().includes(query.toLowerCase())
    )
    .filter((customer) => {
      if (activeFilter === "Borcu olanlar") {
        return customer.debt > 0;
      }

      if (activeFilter === "Paketi olanlar") {
        return customer.packageLabel !== "Aktif paket yok";
      }

      if (activeFilter === "Uzun süredir gelmeyenler") {
        return customer.lastVisit !== "Bugün" && customer.lastVisit !== "Yeni kayıt";
      }

      return true;
    });

  return (
    <View style={styles.sectionGap}>
      <ScreenIntro
        title="Müşteriler"
        description="Müşteri geçmişi, aktif paketler, borçlar ve özel notlar salon hafızası olarak burada tutulur."
        action="Yeni Müşteri"
      />
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Müşteri adı, telefon veya not ara"
        placeholderTextColor="#8f8a86"
        style={styles.searchInput}
      />
      <View style={styles.filterRow}>
        {["Tümü", "Borcu olanlar", "Paketi olanlar", "Uzun süredir gelmeyenler"].map((item) => (
          <Pill key={item} label={item} active={activeFilter === item} onPress={() => setActiveFilter(item)} />
        ))}
      </View>
      <PanelCard title={`${filteredCustomers.length} müşteri`}>
        {filteredCustomers.length > 0 ? (
          filteredCustomers.map((customer) => (
            <CustomerCard key={customer.id} customer={customer} onOpenDetails={setSelectedCustomer} />
          ))
        ) : (
          <EmptyState title="Müşteri bulunamadı" description="Arama veya filtre seçimini değiştirerek tekrar deneyin." />
        )}
      </PanelCard>
      <ModalShell
        visible={Boolean(selectedCustomer)}
        title="Müşteri Kartı"
        onClose={() => setSelectedCustomer(null)}
      >
        {selectedCustomer ? <CustomerDetail customer={selectedCustomer} /> : null}
      </ModalShell>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionGap: {
    gap: 16
  },
  searchInput: {
    minHeight: 46,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    color: colors.text
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  }
});
