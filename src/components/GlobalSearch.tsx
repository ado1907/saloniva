import { useMemo, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { CompactRow } from "./CompactRow";
import { EmptyState } from "./EmptyState";
import { PanelCard } from "./PanelCard";
import { useSalonStore } from "../state/SalonStore";
import { colors } from "../theme/colors";
import { radius } from "../theme/spacing";
import { formatCurrency } from "../utils/format";

type Result = {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
};

export function GlobalSearch() {
  const { appointments, customers, packages, payments, salonServices } = useSalonStore();
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return [];
    }

    const customerResults: Result[] = customers
      .filter((item) => `${item.name} ${item.phone} ${item.note}`.toLowerCase().includes(normalized))
      .map((item) => ({
        id: `customer-${item.id}`,
        title: item.name,
        subtitle: `${item.phone} • ${item.packageLabel}`,
        badge: item.debt > 0 ? formatCurrency(item.debt) : "Müşteri"
      }));

    const appointmentResults: Result[] = appointments
      .filter((item) => `${item.customer} ${item.service} ${item.staff}`.toLowerCase().includes(normalized))
      .map((item) => ({
        id: `appointment-${item.id}`,
        title: `${item.time} - ${item.customer}`,
        subtitle: `${item.service} • ${item.staff}`,
        badge: item.status
      }));

    const packageResults: Result[] = packages
      .filter((item) => `${item.customer} ${item.title}`.toLowerCase().includes(normalized))
      .map((item) => ({
        id: `package-${item.id}`,
        title: item.title,
        subtitle: item.customer,
        badge: `${item.totalSessions - item.usedSessions} seans`
      }));

    const paymentResults: Result[] = payments
      .filter((item) => `${item.customer} ${item.service} ${item.method} ${item.status}`.toLowerCase().includes(normalized))
      .map((item) => ({
        id: `payment-${item.id}`,
        title: item.customer,
        subtitle: `${item.service} • ${item.method}`,
        badge: formatCurrency(item.amount)
      }));

    const serviceResults: Result[] = salonServices
      .filter((item) => `${item.name} ${item.category}`.toLowerCase().includes(normalized))
      .map((item) => ({
        id: `service-${item.id}`,
        title: item.name,
        subtitle: `${item.category} • ${item.durationMinutes} dk`,
        badge: formatCurrency(item.price)
      }));

    return [...customerResults, ...appointmentResults, ...packageResults, ...paymentResults, ...serviceResults].slice(0, 12);
  }, [appointments, customers, packages, payments, query, salonServices]);

  return (
    <View style={styles.wrap}>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Müşteri, telefon, hizmet, randevu veya ödeme ara"
        placeholderTextColor="#8f8a86"
        style={styles.input}
        autoFocus
      />
      <PanelCard title={query ? `${results.length} sonuç` : "Arama"}>
        {query ? (
          results.length > 0 ? (
            results.map((result) => (
              <CompactRow key={result.id} title={result.title} subtitle={result.subtitle} badge={result.badge} />
            ))
          ) : (
            <EmptyState title="Sonuç bulunamadı" description="Farklı bir müşteri, hizmet veya telefon bilgisi deneyin." />
          )
        ) : (
          <Text style={styles.hint}>Arama yapmak için en az bir kelime yazın.</Text>
        )}
      </PanelCard>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 12
  },
  input: {
    minHeight: 46,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    paddingHorizontal: 14,
    color: colors.text
  },
  hint: {
    color: colors.muted,
    lineHeight: 20
  }
});
