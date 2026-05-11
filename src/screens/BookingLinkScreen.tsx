import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ActionButton } from "../components/ActionButton";
import { CompactRow } from "../components/CompactRow";
import { FormError, formStyles, LabeledInput } from "../components/forms/FormFields";
import { PanelCard } from "../components/PanelCard";
import { Pill } from "../components/Pill";
import { ScreenIntro } from "../components/ScreenIntro";
import { useSalonStore } from "../state/SalonStore";
import { colors } from "../theme/colors";
import { radius } from "../theme/spacing";
import { formatCurrency } from "../utils/format";

const bookingUrl = "https://saloniva.app/s/saloniva-guzellik";

export function BookingLinkScreen() {
  const { addBookingRequest, approveBookingRequest, bookingRequests, rejectBookingRequest, salonServices } = useSalonStore();
  const [customer, setCustomer] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("");
  const [preferredTime, setPreferredTime] = useState("14:30");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submitRequest = () => {
    if (!customer.trim()) {
      setError("Talep için ad soyad gerekli.");
      return;
    }

    if (!phone.trim()) {
      setError("Talep için telefon gerekli.");
      return;
    }

    if (!service.trim()) {
      setError("Talep için hizmet seçilmeli.");
      return;
    }

    addBookingRequest({
      id: `br-${Date.now()}`,
      customer: customer.trim(),
      phone: phone.trim(),
      service,
      preferredTime: preferredTime.trim() || "Saat belirtilmedi",
      note: note.trim() || "Not eklenmedi.",
      status: "Onay Bekliyor"
    });

    setCustomer("");
    setPhone("");
    setService("");
    setPreferredTime("14:30");
    setNote("");
    setError(null);
  };

  return (
    <View style={styles.sectionGap}>
      <ScreenIntro
        title="Online Randevu Linki"
        description="Müşterilerinize paylaşabileceğiniz, salon vitrini ve hizmet sayfalarından gelen talepleri onay akışına düşüren rezervasyon sayfası."
        action="Linki Paylaş"
      />

      <View style={styles.preview}>
        <Text style={styles.previewBrand}>Saloniva Güzellik</Text>
        <Text style={styles.previewTitle}>Randevu oluşturun</Text>
        <Text style={styles.previewText}>Hizmet seçin, uygun saatleri görün ve salon ekibinin onaylaması için talep gönderin.</Text>
        <View style={styles.urlBox}>
          <Text style={styles.urlText}>{bookingUrl}</Text>
        </View>
        <View style={styles.actions}>
          <ActionButton icon="copy-outline" label="Linki Kopyala" primary />
          <ActionButton icon="logo-whatsapp" label="WhatsApp ile Paylaş" />
        </View>
      </View>

      <PanelCard title="Müşteriye Görünecek Hizmetler">
        {salonServices
          .filter((service) => service.active)
          .slice(0, 5)
          .map((service) => (
            <CompactRow
              key={service.id}
              title={service.name}
              subtitle={`${service.durationMinutes} dk • ${service.category}`}
              badge={formatCurrency(service.price)}
            />
          ))}
      </PanelCard>

      <PanelCard title="Müşteri Talep Formu">
        <View style={formStyles.form}>
          <FormError message={error} />
          <View style={styles.pillRow}>
            {salonServices
              .filter((item) => item.active)
              .slice(0, 4)
              .map((item) => (
                <Pill
                  key={item.id}
                  label={item.name}
                  active={service === item.name}
                  onPress={() => {
                    setService(item.name);
                    setError(null);
                  }}
                />
              ))}
          </View>
          <View style={formStyles.row}>
            <View style={formStyles.grow}>
              <LabeledInput label="Ad soyad" value={customer} onChangeText={(value) => { setCustomer(value); setError(null); }} placeholder="Ayşe Yılmaz" />
            </View>
            <View style={formStyles.grow}>
              <LabeledInput label="Telefon" value={phone} onChangeText={(value) => { setPhone(value); setError(null); }} placeholder="0532 000 00 00" keyboardType="phone-pad" />
            </View>
          </View>
          <View style={formStyles.row}>
            <View style={formStyles.grow}>
              <LabeledInput label="Tercih edilen saat" value={preferredTime} onChangeText={setPreferredTime} placeholder="14:30" />
            </View>
            <View style={formStyles.grow}>
              <LabeledInput label="Not" value={note} onChangeText={setNote} placeholder="Özel talep veya açıklama" />
            </View>
          </View>
          <View style={formStyles.actions}>
            <ActionButton icon="send-outline" label="Talep Oluştur" primary onPress={submitRequest} />
          </View>
        </View>
      </PanelCard>

      <PanelCard title="Onay Bekleyen Talepler">
        {bookingRequests.length > 0 ? (
          bookingRequests.map((request) => (
            <View key={request.id} style={styles.requestCard}>
              <CompactRow
                title={`${request.preferredTime} - ${request.customer}`}
                subtitle={`${request.service} • ${request.phone}`}
                badge={request.status}
              />
              <Text style={styles.requestNote}>{request.note}</Text>
              {request.status === "Onay Bekliyor" ? (
                <View style={styles.actions}>
                  <ActionButton icon="checkmark-circle-outline" label="Onayla" primary onPress={() => approveBookingRequest(request.id)} />
                  <ActionButton icon="close-circle-outline" label="Reddet" onPress={() => rejectBookingRequest(request.id)} />
                </View>
              ) : null}
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>Henüz online randevu talebi yok.</Text>
        )}
      </PanelCard>

      <PanelCard title="Rezervasyon Akışı">
        <CompactRow title="1. Hizmet seçimi" subtitle="Müşteri hizmet ve süreyi görür." badge="Hazır" />
        <CompactRow title="2. İletişim bilgisi" subtitle="Ad, telefon ve not bırakır." badge="Planlı" />
        <CompactRow title="3. Salon vitrini CTA" subtitle="Vitrin ekranındaki talep butonları bu listeye müşteri talebi ekler." badge="Hazır" />
        <CompactRow title="4. Salon onayı" subtitle="Talep takvime onay bekliyor olarak düşer." badge="Hazır" />
      </PanelCard>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionGap: {
    gap: 16
  },
  preview: {
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 18,
    gap: 10
  },
  previewBrand: {
    color: colors.accent,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  previewTitle: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "800"
  },
  previewText: {
    color: colors.muted,
    lineHeight: 21
  },
  urlBox: {
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.softBorder,
    backgroundColor: colors.card,
    padding: 12
  },
  urlText: {
    color: colors.text,
    fontWeight: "800"
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  emptyText: {
    color: colors.muted,
    lineHeight: 20
  },
  requestCard: {
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.softBorder,
    backgroundColor: colors.card,
    padding: 10,
    gap: 10
  },
  requestNote: {
    color: colors.muted,
    lineHeight: 19
  }
});
