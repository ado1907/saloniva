import { useState } from "react";
import { View } from "react-native";
import { ActionButton } from "../ActionButton";
import { Pill } from "../Pill";
import { useSalonStore } from "../../state/SalonStore";
import type { PaymentMethod, PaymentStatus } from "../../types";
import { FormError, formStyles, LabeledInput } from "./FormFields";

type Props = {
  onDone: () => void;
  initialCustomer?: string;
  initialService?: string;
  initialRemaining?: number;
};

const methods: PaymentMethod[] = ["Nakit", "Kart", "Havale", "Diğer"];
const statuses: PaymentStatus[] = ["Ödendi", "Kısmi Ödendi", "Bekliyor"];

export function NewPaymentForm({ onDone, initialCustomer = "", initialService = "", initialRemaining }: Props) {
  const { addPackagePayment, addPayment, customers } = useSalonStore();
  const [customer, setCustomer] = useState(initialCustomer);
  const [service, setService] = useState(initialService);
  const [amount, setAmount] = useState("");
  const [remaining, setRemaining] = useState(initialRemaining !== undefined ? String(initialRemaining) : "");
  const [method, setMethod] = useState<PaymentMethod>("Kart");
  const [status, setStatus] = useState<PaymentStatus>("Ödendi");
  const [error, setError] = useState<string | null>(null);

  const selectCustomer = (customerName: string) => {
    const selectedCustomer = customers.find((item) => item.name === customerName);
    setCustomer(customerName);
    setRemaining(selectedCustomer?.debt ? String(selectedCustomer.debt) : "0");
    setError(null);
  };

  const updateAmount = (value: string) => {
    setAmount(value);
    setError(null);
    const selectedCustomer = customers.find((item) => item.name === customer);
    const baseRemaining = initialRemaining ?? selectedCustomer?.debt;
    if (baseRemaining !== undefined) {
      const nextRemaining = Math.max(0, baseRemaining - parseMoney(value));
      setRemaining(String(nextRemaining));
      setStatus(nextRemaining > 0 ? "Kısmi Ödendi" : "Ödendi");
    }
  };

  const submit = () => {
    const numericAmount = parseMoney(amount);
    const numericRemaining = parseMoney(remaining);

    if (!customer.trim()) {
      setError("Tahsilatı kaydetmek için müşteri seçin veya müşteri adını yazın.");
      return;
    }

    if (!service.trim()) {
      setError("Tahsilatın hangi hizmet ya da paket için alındığını belirtin.");
      return;
    }

    if (numericAmount <= 0) {
      setError("Alınan tutar 0 TL'den büyük olmalı.");
      return;
    }

    if (numericRemaining < 0) {
      setError("Kalan ödeme negatif olamaz. Tutarı tekrar kontrol edin.");
      return;
    }

    addPayment({
      id: `pay-${Date.now()}`,
      customer: customer.trim() || "Yeni Müşteri",
      service: service.trim() || "Genel ödeme",
      date: "Bugün",
      amount: numericAmount,
      method,
      status,
      remaining: numericRemaining
    });
    addPackagePayment(service.trim(), customer.trim(), numericAmount);
    setError(null);
    onDone();
  };

  return (
    <View style={formStyles.form}>
      <FormError message={error} />
      <View style={formStyles.row}>
        {customers.slice(0, 4).map((item) => (
          <Pill key={item.id} label={item.name} active={customer === item.name} onPress={() => selectCustomer(item.name)} />
        ))}
      </View>
      <View style={formStyles.row}>
        <View style={formStyles.grow}>
          <LabeledInput label="Müşteri" value={customer} onChangeText={(value) => { setCustomer(value); setError(null); }} placeholder="Ayşe Yılmaz" />
        </View>
        <View style={formStyles.grow}>
          <LabeledInput label="Hizmet / Paket" value={service} onChangeText={(value) => { setService(value); setError(null); }} placeholder="Cilt Bakımı" />
        </View>
      </View>
      <View style={formStyles.row}>
        <View style={formStyles.grow}>
          <LabeledInput label="Alınan tutar" value={amount} onChangeText={updateAmount} placeholder="1200" keyboardType="numeric" />
        </View>
        <View style={formStyles.grow}>
          <LabeledInput label="Kalan ödeme" value={remaining} onChangeText={(value) => { setRemaining(value); setError(null); }} placeholder="0" keyboardType="numeric" />
        </View>
      </View>
      <View style={formStyles.row}>
        {methods.map((item) => (
          <Pill key={item} label={item} active={method === item} onPress={() => setMethod(item)} />
        ))}
      </View>
      <View style={formStyles.row}>
        {statuses.map((item) => (
          <Pill key={item} label={item} active={status === item} onPress={() => setStatus(item)} />
        ))}
      </View>
      <View style={formStyles.actions}>
        <ActionButton icon="cash-outline" label="Ödemeyi Kaydet" primary onPress={submit} />
      </View>
    </View>
  );
}

function parseMoney(value: string) {
  const normalized = value.replace(/\./g, "").replace(",", ".").trim();
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}
