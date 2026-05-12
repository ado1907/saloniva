import { useState } from "react";
import { View } from "react-native";
import { ActionButton } from "../ActionButton";
import { useSalonStore } from "../../state/SalonStore";
import { FormError, formStyles, LabeledInput } from "./FormFields";

type Props = {
  onDone: () => void;
};

export function NewCustomerForm({ onDone }: Props) {
  const { addCustomer } = useSalonStore();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    const cleanPhone = phone.trim().replace(/\D/g, "");

    if (!name.trim()) {
      setError("Müşteri kartı oluşturmak için ad soyad bilgisini girin.");
      return;
    }

    if (!phone.trim()) {
      setError("Randevu hatırlatmaları için müşterinin telefon numarasını girin.");
      return;
    }

    if (cleanPhone.length < 10) {
      setError("Telefon numarası eksik görünüyor. Örnek format: 0532 000 00 00.");
      return;
    }

    addCustomer({
      id: `c-${Date.now()}`,
      name: name.trim() || "Yeni Müşteri",
      phone: phone.trim() || "Telefon eklenmedi",
      lastVisit: "Yeni kayıt",
      totalSpent: 0,
      debt: 0,
      packageLabel: "Aktif paket yok",
      note: note.trim() || "Not eklenmedi."
    });
    setError(null);
    onDone();
  };

  return (
    <View style={formStyles.form}>
      <FormError message={error} />
      <LabeledInput label="Ad soyad" value={name} onChangeText={(value) => { setName(value); setError(null); }} placeholder="Ayşe Yılmaz" />
      <LabeledInput label="Telefon" value={phone} onChangeText={(value) => { setPhone(value); setError(null); }} placeholder="0532 000 00 00" keyboardType="phone-pad" />
      <LabeledInput label="Not" value={note} onChangeText={(value) => { setNote(value); setError(null); }} placeholder="Tercih, hassasiyet veya özel not" />
      <View style={formStyles.actions}>
        <ActionButton icon="checkmark-circle-outline" label="Müşteriyi Kaydet" primary onPress={submit} />
      </View>
    </View>
  );
}
