import { useState } from "react";
import { View } from "react-native";
import { ActionButton } from "../ActionButton";
import { Pill } from "../Pill";
import { useSalonStore } from "../../state/SalonStore";
import { FormError, formStyles, LabeledInput } from "./FormFields";

type Props = {
  onDone: () => void;
};

const categories = ["Cilt Bakımı", "Lazer", "Tırnak", "Kaş/Kirpik", "Saç", "Kalıcı Makyaj"];

export function NewServiceForm({ onDone }: Props) {
  const { addSalonService, staffMembers } = useSalonStore();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Cilt Bakımı");
  const [durationMinutes, setDurationMinutes] = useState("60");
  const [price, setPrice] = useState("");
  const [staff, setStaff] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const toggleStaff = (staffName: string) => {
    setStaff((current) =>
      current.includes(staffName) ? current.filter((item) => item !== staffName) : [...current, staffName]
    );
    setError(null);
  };

  const submit = () => {
    const duration = Number(durationMinutes);
    const numericPrice = Number(price);

    if (!name.trim()) {
      setError("Hizmet adı gerekli.");
      return;
    }

    if (!duration || duration <= 0) {
      setError("Hizmet süresi 0'dan büyük olmalı.");
      return;
    }

    if (!numericPrice || numericPrice <= 0) {
      setError("Hizmet fiyatı 0'dan büyük olmalı.");
      return;
    }

    if (staff.length === 0) {
      setError("En az bir personel seçilmeli.");
      return;
    }

    addSalonService({
      id: `s-${Date.now()}`,
      name: name.trim(),
      category,
      durationMinutes: duration,
      price: numericPrice,
      active: true,
      staff
    });
    onDone();
  };

  return (
    <View style={formStyles.form}>
      <FormError message={error} />
      <View style={formStyles.row}>
        {categories.map((item) => (
          <Pill key={item} label={item} active={category === item} onPress={() => { setCategory(item); setError(null); }} />
        ))}
      </View>
      <View style={formStyles.row}>
        <View style={formStyles.grow}>
          <LabeledInput label="Hizmet adı" value={name} onChangeText={(value) => { setName(value); setError(null); }} placeholder="Cilt Bakımı" />
        </View>
        <View style={formStyles.grow}>
          <LabeledInput label="Süre (dk)" value={durationMinutes} onChangeText={(value) => { setDurationMinutes(value); setError(null); }} keyboardType="numeric" />
        </View>
        <View style={formStyles.grow}>
          <LabeledInput label="Fiyat" value={price} onChangeText={(value) => { setPrice(value); setError(null); }} placeholder="1200" keyboardType="numeric" />
        </View>
      </View>
      <View style={formStyles.row}>
        {staffMembers
          .filter((member) => member.active)
          .map((member) => {
            const firstName = member.name.split(" ")[0];
            return (
              <Pill
                key={member.id}
                label={firstName}
                active={staff.includes(firstName)}
                onPress={() => toggleStaff(firstName)}
              />
            );
          })}
      </View>
      <View style={formStyles.actions}>
        <ActionButton icon="pricetag-outline" label="Hizmeti Kaydet" primary onPress={submit} />
      </View>
    </View>
  );
}
