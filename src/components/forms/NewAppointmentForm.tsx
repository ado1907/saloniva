import { useState } from "react";
import { Text, View } from "react-native";
import { ActionButton } from "../ActionButton";
import { Pill } from "../Pill";
import { useSalonStore } from "../../state/SalonStore";
import type { AppointmentStatus } from "../../types";
import { FormError, formStyles, LabeledInput } from "./FormFields";

type Props = {
  onDone: () => void;
};

const statuses: AppointmentStatus[] = ["Planlandı", "Geldi", "Tamamlandı"];

export function NewAppointmentForm({ onDone }: Props) {
  const { addAppointment, appointments, customers, salonServices, staffMembers } = useSalonStore();
  const [customer, setCustomer] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("");
  const [staff, setStaff] = useState("");
  const [time, setTime] = useState("");
  const [end, setEnd] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState<AppointmentStatus>("Planlandı");
  const [error, setError] = useState<string | null>(null);

  const selectCustomer = (customerName: string) => {
    const selectedCustomer = customers.find((item) => item.name === customerName);
    setCustomer(customerName);
    setPhone(selectedCustomer?.phone ?? "");
    setError(null);
  };

  const selectService = (serviceName: string) => {
    const selectedService = salonServices.find((item) => item.name === serviceName);
    setService(serviceName);
    setError(null);
    setPrice(selectedService ? String(selectedService.price) : "");
    if (selectedService && time) {
      setEnd(addMinutesToTime(time, selectedService.durationMinutes));
    }
    if (selectedService?.staff[0]) {
      setStaff(selectedService.staff[0]);
    }
  };

  const updateTime = (value: string) => {
    setTime(value);
    setError(null);
    const selectedService = salonServices.find((item) => item.name === service);
    if (selectedService) {
      setEnd(addMinutesToTime(value, selectedService.durationMinutes));
    }
  };

  const submit = () => {
    const startTime = normalizeTimeInput(time);
    const endTime = normalizeTimeInput(end || "10:00");

    if (!customer.trim()) {
      setError("Randevu kaydetmek için müşteri adı gerekli.");
      return;
    }

    if (!service.trim()) {
      setError("Randevu kaydetmek için hizmet seçilmeli veya yazılmalı.");
      return;
    }

    if (!isValidTime(startTime)) {
      setError("Başlangıç saati 14:30 gibi geçerli bir formatta olmalı.");
      return;
    }

    if (!isValidTime(endTime)) {
      setError("Bitiş saati 15:30 gibi geçerli bir formatta olmalı.");
      return;
    }

    if (timeToMinutes(endTime) <= timeToMinutes(startTime)) {
      setError("Bitiş saati başlangıç saatinden sonra olmalı.");
      return;
    }

    const hasConflict = appointments.some((appointment) => {
      if (appointment.staff !== (staff.trim() || "Atanmadı")) {
        return false;
      }

      return timeRangesOverlap(startTime, endTime, appointment.time, appointment.end);
    });

    if (hasConflict) {
      setError(`${staff.trim() || "Seçili personel"} için bu saat aralığında başka bir randevu var.`);
      return;
    }

    if (price && Number(price) < 0) {
      setError("Ücret negatif olamaz.");
      return;
    }

    addAppointment({
      id: `a-${Date.now()}`,
      time: startTime,
      end: endTime,
      customer: customer.trim() || "Yeni Müşteri",
      phone: phone.trim().replace(/\D/g, "") || "905320000000",
      service: service.trim() || "Genel Hizmet",
      staff: staff.trim() || "Atanmadı",
      price: Number(price) || 0,
      status
    });
    setError(null);
    onDone();
  };

  return (
    <View style={formStyles.form}>
      <FormError message={error} />
      <View style={formStyles.row}>
        {customers.slice(0, 3).map((item) => (
          <Pill key={item.id} label={item.name} active={customer === item.name} onPress={() => selectCustomer(item.name)} />
        ))}
      </View>
      <View style={formStyles.row}>
        <View style={formStyles.grow}>
          <LabeledInput label="Müşteri" value={customer} onChangeText={(value) => { setCustomer(value); setError(null); }} placeholder="Ayşe Yılmaz" />
        </View>
        <View style={formStyles.grow}>
          <LabeledInput label="Telefon" value={phone} onChangeText={(value) => { setPhone(value); setError(null); }} placeholder="0532 000 00 00" keyboardType="phone-pad" />
        </View>
      </View>
      <View style={formStyles.row}>
        {salonServices
          .filter((item) => item.active)
          .slice(0, 4)
          .map((item) => (
            <Pill key={item.id} label={item.name} active={service === item.name} onPress={() => selectService(item.name)} />
          ))}
      </View>
      <View style={formStyles.row}>
        <View style={formStyles.grow}>
          <LabeledInput label="Hizmet" value={service} onChangeText={(value) => { setService(value); setError(null); }} placeholder="Cilt Bakımı" />
        </View>
        <View style={formStyles.grow}>
          <LabeledInput label="Personel" value={staff} onChangeText={(value) => { setStaff(value); setError(null); }} placeholder="Elif" />
        </View>
      </View>
      <View style={formStyles.row}>
        {staffMembers
          .filter((item) => item.active)
          .slice(0, 3)
          .map((item) => (
            <Pill key={item.id} label={item.name.split(" ")[0]} active={staff === item.name.split(" ")[0]} onPress={() => setStaff(item.name.split(" ")[0])} />
          ))}
      </View>
      {staff && time && end ? (
        <Text style={formStyles.helperText}>
          {staff} için {time} - {end} aralığı kontrol edilecek.
        </Text>
      ) : null}
      <View style={formStyles.row}>
        <View style={formStyles.grow}>
          <LabeledInput label="Başlangıç" value={time} onChangeText={updateTime} placeholder="14:30" />
        </View>
        <View style={formStyles.grow}>
          <LabeledInput label="Bitiş" value={end} onChangeText={(value) => { setEnd(value); setError(null); }} placeholder="15:30" />
        </View>
        <View style={formStyles.grow}>
          <LabeledInput label="Ücret" value={price} onChangeText={(value) => { setPrice(value); setError(null); }} placeholder="1200" keyboardType="numeric" />
        </View>
      </View>
      <View style={formStyles.row}>
        {statuses.map((item) => (
          <Pill key={item} label={item} active={status === item} onPress={() => setStatus(item)} />
        ))}
      </View>
      <View style={formStyles.actions}>
        <ActionButton icon="calendar-outline" label="Randevuyu Kaydet" primary onPress={submit} />
      </View>
    </View>
  );
}

function addMinutesToTime(value: string, minutes: number) {
  const [rawHour, rawMinute] = value.split(":");
  const hour = Number(rawHour);
  const minute = Number(rawMinute);

  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    return "";
  }

  const date = new Date(2026, 4, 9, hour, minute + minutes);
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function isValidTime(value: string) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

function normalizeTimeInput(value: string) {
  const cleaned = value
    .trim()
    .replace(/[：٫؛;]/g, ":")
    .replace(".", ":")
    .replace(/\s/g, "");

  if (/^\d{3,4}$/.test(cleaned)) {
    const minute = cleaned.slice(-2);
    const hour = cleaned.slice(0, -2).padStart(2, "0");
    return `${hour}:${minute}`;
  }

  const match = cleaned.match(/^(\d{1,2}):(\d{1,2})$/);
  if (!match) {
    return cleaned;
  }

  return `${match[1].padStart(2, "0")}:${match[2].padStart(2, "0")}`;
}

function timeToMinutes(value: string) {
  const [hour, minute] = normalizeTimeInput(value).split(":").map(Number);
  return hour * 60 + minute;
}

function timeRangesOverlap(startA: string, endA: string, startB: string, endB: string) {
  return timeToMinutes(startA) < timeToMinutes(endB) && timeToMinutes(startB) < timeToMinutes(endA);
}
