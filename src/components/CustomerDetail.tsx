import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { CompactRow } from "./CompactRow";
import { ActionButton } from "./ActionButton";
import { PanelCard } from "./PanelCard";
import { SmallStat } from "./SmallStat";
import { useSalonStore } from "../state/SalonStore";
import { colors } from "../theme/colors";
import type { Customer } from "../types";
import { formatCurrency } from "../utils/format";
import { sendWinbackMessage } from "../utils/whatsapp";

type Props = {
  customer: Customer;
};

export function CustomerDetail({ customer }: Props) {
  const { addCustomerNote, appointments, customers, packages, payments } = useSalonStore();
  const [noteText, setNoteText] = useState("");
  const activeCustomer = customers.find((item) => item.id === customer.id) ?? customer;
  const customerAppointments = appointments.filter((item) => item.customer === customer.name);
  const customerPackages = packages.filter((item) => item.customer === customer.name);
  const customerPayments = payments.filter((item) => item.customer === customer.name);

  const submitNote = () => {
    if (!noteText.trim()) {
      return;
    }

    addCustomerNote(activeCustomer.id, noteText.trim());
    setNoteText("");
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <View>
          <Text style={styles.name}>{customer.name}</Text>
          <Text style={styles.meta}>
            {customer.phone} • Son ziyaret: {customer.lastVisit}
          </Text>
        </View>
      </View>

      <View style={styles.stats}>
        <SmallStat label="Toplam harcama" value={formatCurrency(activeCustomer.totalSpent)} />
        <SmallStat label="Açık borç" value={formatCurrency(activeCustomer.debt)} warning={activeCustomer.debt > 0} />
        <SmallStat label="Paket" value={activeCustomer.packageLabel} />
      </View>

      <View style={styles.actions}>
        <ActionButton icon="logo-whatsapp" label="Geri Kazanım Mesajı" onPress={() => sendWinbackMessage(activeCustomer.phone, activeCustomer.name)} />
      </View>

      <PanelCard title="Notlar">
        <Text style={styles.note}>{activeCustomer.note}</Text>
        <TextInput
          value={noteText}
          onChangeText={setNoteText}
          placeholder="Yeni müşteri notu ekle"
          placeholderTextColor="#8f8a86"
          style={styles.noteInput}
        />
        <View style={styles.actions}>
          <ActionButton icon="add-circle-outline" label="Not Ekle" onPress={submitNote} />
        </View>
        {(activeCustomer.notes ?? []).map((note) => (
          <CompactRow key={note.id} title={note.date} subtitle={note.text} badge="Not" />
        ))}
      </PanelCard>

      <PanelCard title="Randevular">
        {customerAppointments.length > 0 ? (
          customerAppointments.map((item) => (
            <CompactRow
              key={item.id}
              title={`${item.time} - ${item.service}`}
              subtitle={`${item.staff} • ${item.status}`}
              badge={formatCurrency(item.price)}
            />
          ))
        ) : (
          <EmptyText text="Bu müşteri için kayıtlı randevu yok." />
        )}
      </PanelCard>

      <PanelCard title="Paketler ve Seanslar">
        {customerPackages.length > 0 ? (
          customerPackages.map((item) => (
            <CompactRow
              key={item.id}
              title={item.title}
              subtitle={`${item.usedSessions}/${item.totalSessions} seans kullanıldı`}
              badge={`${item.totalSessions - item.usedSessions} kaldı`}
            />
          ))
        ) : (
          <EmptyText text="Bu müşterinin aktif paketi yok." />
        )}
      </PanelCard>

      <PanelCard title="Ödemeler">
        {customerPayments.length > 0 ? (
          customerPayments.map((item) => (
            <CompactRow
              key={item.id}
              title={item.service}
              subtitle={`${item.date} • ${item.method} • ${item.status}`}
              badge={formatCurrency(item.amount)}
            />
          ))
        ) : (
          <EmptyText text="Bu müşteri için ödeme kaydı yok." />
        )}
      </PanelCard>
    </View>
  );
}

function EmptyText({ text }: { text: string }) {
  return <Text style={styles.empty}>{text}</Text>;
}

const styles = StyleSheet.create({
  wrap: {
    gap: 12
  },
  header: {
    gap: 4
  },
  name: {
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
  },
  noteInput: {
    minHeight: 44,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    color: colors.text
  },
  empty: {
    color: colors.muted,
    lineHeight: 20
  }
});
