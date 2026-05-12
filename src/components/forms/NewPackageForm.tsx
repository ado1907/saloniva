import { useState } from "react";
import { View } from "react-native";
import { ActionButton } from "../ActionButton";
import { Pill } from "../Pill";
import { useSalonStore } from "../../state/SalonStore";
import { FormError, formStyles, LabeledInput } from "./FormFields";

type Props = {
  onDone: () => void;
};

const packageSuggestions = [
  "Lazer Epilasyon Paketi",
  "Cilt Bakımı Paketi",
  "Bölgesel İncelme Paketi",
  "Kalıcı Makyaj Rötuş Paketi"
];

export function NewPackageForm({ onDone }: Props) {
  const { addPackage, customers } = useSalonStore();
  const [customer, setCustomer] = useState("");
  const [title, setTitle] = useState("");
  const [totalSessions, setTotalSessions] = useState("8");
  const [totalPrice, setTotalPrice] = useState("");
  const [paid, setPaid] = useState("0");
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    const sessions = Number(totalSessions);
    const price = parseMoney(totalPrice);
    const paidAmount = parseMoney(paid);

    if (!customer.trim()) {
      setError("Paket tanımlamak için müşteri seçin veya müşteri adını yazın.");
      return;
    }

    if (!title.trim()) {
      setError("Paketin satışta görünecek adını girin.");
      return;
    }

    if (!sessions || sessions <= 0) {
      setError("Toplam seans sayısı 0'dan büyük olmalı.");
      return;
    }

    if (!price || price <= 0) {
      setError("Paket ücreti 0 TL'den büyük olmalı.");
      return;
    }

    if (paidAmount < 0 || paidAmount > price) {
      setError("İlk ödeme paket ücretinden yüksek olamaz.");
      return;
    }

    addPackage({
      id: `p-${Date.now()}`,
      customer: customer.trim(),
      title: title.trim(),
      totalSessions: sessions,
      usedSessions: 0,
      totalPrice: price,
      paid: paidAmount
    });
    onDone();
  };

  return (
    <View style={formStyles.form}>
      <FormError message={error} />
      <View style={formStyles.row}>
        {customers.slice(0, 4).map((item) => (
          <Pill
            key={item.id}
            label={item.name}
            active={customer === item.name}
            onPress={() => {
              setCustomer(item.name);
              setError(null);
            }}
          />
        ))}
      </View>
      <View style={formStyles.row}>
        {packageSuggestions.map((item) => (
          <Pill
            key={item}
            label={item}
            active={title === item}
            onPress={() => {
              setTitle(item);
              setError(null);
            }}
          />
        ))}
      </View>
      <View style={formStyles.row}>
        <View style={formStyles.grow}>
          <LabeledInput label="Müşteri" value={customer} onChangeText={(value) => { setCustomer(value); setError(null); }} placeholder="Ayşe Yılmaz" />
        </View>
        <View style={formStyles.grow}>
          <LabeledInput label="Paket adı" value={title} onChangeText={(value) => { setTitle(value); setError(null); }} placeholder="Lazer Epilasyon Paketi" />
        </View>
      </View>
      <View style={formStyles.row}>
        <View style={formStyles.grow}>
          <LabeledInput label="Toplam seans" value={totalSessions} onChangeText={(value) => { setTotalSessions(value); setError(null); }} keyboardType="numeric" />
        </View>
        <View style={formStyles.grow}>
          <LabeledInput label="Paket ücreti" value={totalPrice} onChangeText={(value) => { setTotalPrice(value); setError(null); }} placeholder="6000" keyboardType="numeric" />
        </View>
        <View style={formStyles.grow}>
          <LabeledInput label="İlk ödeme" value={paid} onChangeText={(value) => { setPaid(value); setError(null); }} placeholder="0" keyboardType="numeric" />
        </View>
      </View>
      <View style={formStyles.actions}>
        <ActionButton icon="layers-outline" label="Paketi Kaydet" primary onPress={submit} />
      </View>
    </View>
  );
}

function parseMoney(value: string) {
  const normalized = value.replace(/\./g, "").replace(",", ".").trim();
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}
