import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import { ActionButton } from "../components/ActionButton";
import { CompactRow } from "../components/CompactRow";
import { FormError, formStyles, LabeledInput } from "../components/forms/FormFields";
import { PanelCard } from "../components/PanelCard";
import { ScreenIntro } from "../components/ScreenIntro";
import { visualAssets } from "../config/visualAssets";
import { branches, services } from "../data/demoData";
import { useSalonStore } from "../state/SalonStore";
import { colors } from "../theme/colors";
import { radius } from "../theme/spacing";
import { formatCurrency } from "../utils/format";

const showcaseServices = [
  {
    title: "Kadın Bakım Hizmetleri",
    description: "Cilt bakımı, lazer, tırnak, kaş-kirpik ve saç bakımını tek premium vitrinde sunun.",
    icon: "sparkles-outline",
    badge: "Popüler"
  },
  {
    title: "Erkek Bakım Hizmetleri",
    description: "Saç, sakal, cilt ve bakım hizmetleri için ayrı kategori deneyimi oluşturun.",
    icon: "cut-outline",
    badge: "Yeni"
  },
  {
    title: "Çift Hizmetleri",
    description: "Manikür, pedikür, facial ve bakım paketlerini iki kişilik deneyim olarak pazarlayın.",
    icon: "people-outline",
    badge: "Premium"
  },
  {
    title: "Evde Salon Hizmeti",
    description: "Müşterinin konfor alanına giden bakım hizmetlerini ayrı satış kanalı olarak gösterin.",
    icon: "home-outline",
    badge: "Satış"
  }
] as const;

const packages = [
  ["Işıltılı Cilt Paketi", "Facial, serum bakımı ve cilt yenileme önerisi.", "3 seans"],
  ["Çift Spa Deneyimi", "İki kişilik pedikür, manikür ve bakım ritüeli.", "2 kişi"],
  ["Hair Reborn", "Keratin, onarım ve parlaklık odaklı saç bakım paketi.", "Premium"],
  ["Nail Couture", "Protez tırnak, kalıcı oje ve el bakım kombinasyonu.", "Trend"]
];

const reviewSignals = [
  ["4.9", "Google puanı"],
  ["2 şube", "Aktif lokasyon"],
  ["24 saat", "Talep dönüş hedefi"]
];

export function ServiceShowcaseScreen() {
  const { addBookingRequest, bookingRequests } = useSalonStore();
  const [selectedService, setSelectedService] = useState("Çift Spa Deneyimi");
  const [customer, setCustomer] = useState("Demo Müşteri");
  const [phone, setPhone] = useState("0532 000 00 00");
  const [preferredTime, setPreferredTime] = useState("15:30");
  const [error, setError] = useState<string | null>(null);

  const createShowcaseRequest = (serviceName = selectedService) => {
    if (!customer.trim() || !phone.trim()) {
      setError("Randevu talebi için ad soyad ve telefon gerekli.");
      return;
    }

    addBookingRequest({
      id: `showcase-${Date.now()}`,
      customer: customer.trim(),
      phone: phone.trim(),
      service: serviceName,
      preferredTime: preferredTime.trim() || "15:30",
      note: "Salon vitrini üzerinden gelen talep.",
      status: "Onay Bekliyor"
    });
    setSelectedService(serviceName);
    setError(null);
  };

  return (
    <View style={styles.sectionGap}>
      <ScreenIntro
        title="Salon Vitrini"
        description="Salonun müşteriye görünen profesyonel hizmet sayfası: hizmetler, paketler, yorum gücü, şubeler ve hızlı randevu çağrıları."
      />

      <View style={styles.hero}>
        <View style={styles.heroContent}>
          <Text style={styles.kicker}>Premium salon showcase</Text>
          <Text style={styles.heroTitle}>Hizmetleri satışa dönüştüren vitrin</Text>
          <Text style={styles.heroCopy}>
            Müşteri sadece fiyat listesi görmez; uzmanlık, paket değeri, yorum güveni ve hızlı iletişim akışıyla randevuya yönlenir.
          </Text>
          <View style={styles.heroActions}>
            <ActionButton icon="calendar-outline" label="Randevu Talebi Oluştur" primary onPress={() => createShowcaseRequest()} />
            <ActionButton icon="logo-whatsapp" label="WhatsApp CTA" />
          </View>
        </View>
        <ImageBackground source={{ uri: visualAssets.skincare }} style={styles.visualCard} imageStyle={styles.visualImage}>
          <View style={styles.visualOverlay}>
            <View style={styles.photoBadge}>
              <Ionicons name="camera-outline" size={16} color={colors.goldSoft} />
              <Text style={styles.photoBadgeText}>Gerçek salon vitrini</Text>
            </View>
          </View>
          <View style={styles.serviceTile}>
            <Text style={styles.serviceTileTitle}>Couple Care</Text>
            <Text style={styles.serviceTileText}>Manikür • Pedikür • Facial</Text>
          </View>
        </ImageBackground>
      </View>

      <View style={styles.signalGrid}>
        {reviewSignals.map(([value, label]) => (
          <View key={label} style={styles.signalCard}>
            <Text style={styles.signalValue}>{value}</Text>
            <Text style={styles.signalLabel}>{label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.serviceGrid}>
        {showcaseServices.map((item) => (
          <View key={item.title} style={styles.showcaseCard}>
            <View style={styles.iconBox}>
              <Ionicons name={item.icon} size={22} color={colors.gold} />
            </View>
            <Text style={styles.cardBadge}>{item.badge}</Text>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardCopy}>{item.description}</Text>
            <ActionButton
              icon="calendar-outline"
              label="Talep Al"
              onPress={() => createShowcaseRequest(item.title)}
            />
          </View>
        ))}
      </View>

      <PanelCard title="Vitrinden Randevu Talebi">
        <View style={formStyles.form}>
          <FormError message={error} />
          <View style={formStyles.row}>
            <View style={formStyles.grow}>
              <LabeledInput label="Müşteri adı" value={customer} onChangeText={(value) => { setCustomer(value); setError(null); }} />
            </View>
            <View style={formStyles.grow}>
              <LabeledInput label="Telefon" value={phone} onChangeText={(value) => { setPhone(value); setError(null); }} keyboardType="phone-pad" />
            </View>
          </View>
          <View style={formStyles.row}>
            <View style={formStyles.grow}>
              <LabeledInput label="Seçilen hizmet" value={selectedService} onChangeText={setSelectedService} />
            </View>
            <View style={formStyles.grow}>
              <LabeledInput label="Tercih edilen saat" value={preferredTime} onChangeText={setPreferredTime} />
            </View>
          </View>
          <View style={formStyles.actions}>
            <ActionButton icon="send-outline" label="Vitrinden Talep Oluştur" primary onPress={() => createShowcaseRequest()} />
          </View>
        </View>
      </PanelCard>

      <View style={styles.columns}>
        <PanelCard title="Paket Vitrini" style={styles.columnCard}>
          {packages.map(([title, subtitle, badge]) => (
            <CompactRow key={title} title={title} subtitle={subtitle} badge={badge} />
          ))}
        </PanelCard>

        <PanelCard title="En Çok Kazandıran Hizmetler" style={styles.columnCard}>
          {services.map((service) => (
            <CompactRow
              key={service.name}
              title={service.name}
              subtitle={`${service.count} işlem ile vitrinde öne çıkarılabilir`}
              badge={formatCurrency(service.revenue)}
            />
          ))}
        </PanelCard>
      </View>

      <PanelCard title="Şube ve İletişim Alanı">
        {branches.slice(0, 2).map((branch) => (
          <CompactRow
            key={branch.id}
            title={branch.name}
            subtitle={`${branch.address} • ${branch.manager}`}
            badge={`${branch.appointmentsToday} randevu`}
          />
        ))}
      </PanelCard>

      <PanelCard title="Vitrinden Gelen Son Talepler">
        {bookingRequests.slice(0, 3).length > 0 ? (
          bookingRequests.slice(0, 3).map((request) => (
            <CompactRow
              key={request.id}
              title={`${request.preferredTime} - ${request.customer}`}
              subtitle={`${request.service} • ${request.phone}`}
              badge={request.status}
            />
          ))
        ) : (
          <Text style={styles.emptyText}>Henüz vitrin üzerinden randevu talebi oluşturulmadı.</Text>
        )}
      </PanelCard>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionGap: {
    gap: 16
  },
  hero: {
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.sage,
    backgroundColor: colors.ink,
    padding: 18,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 18,
    alignItems: "stretch"
  },
  heroContent: {
    flex: 1.15,
    minWidth: 260,
    gap: 10
  },
  kicker: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  heroTitle: {
    color: colors.white,
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 34
  },
  heroCopy: {
    color: "#d9d2c5",
    lineHeight: 21,
    fontSize: 15
  },
  heroActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 4
  },
  visualCard: {
    flex: 0.85,
    minWidth: 230,
    minHeight: 210,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: "#5e6654",
    backgroundColor: "#332d26",
    overflow: "hidden"
  },
  visualImage: {
    resizeMode: "cover"
  },
  visualOverlay: {
    flex: 1,
    minHeight: 210,
    padding: 14,
    backgroundColor: "rgba(43, 37, 31, 0.26)"
  },
  photoBadge: {
    alignSelf: "flex-start",
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: "rgba(240, 229, 207, 0.42)",
    backgroundColor: "rgba(43, 37, 31, 0.56)",
    paddingHorizontal: 10,
    paddingVertical: 7,
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  photoBadgeText: {
    color: colors.goldSoft,
    fontWeight: "800",
    fontSize: 12
  },
  serviceTile: {
    position: "absolute",
    bottom: 18,
    left: 18,
    right: 18,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.gold,
    padding: 12
  },
  serviceTileTitle: {
    color: colors.text,
    fontWeight: "800",
    fontSize: 18
  },
  serviceTileText: {
    color: colors.muted,
    marginTop: 4,
    fontWeight: "700"
  },
  signalGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12
  },
  signalCard: {
    flex: 1,
    minWidth: 150,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 14
  },
  signalValue: {
    color: colors.accent,
    fontWeight: "800",
    fontSize: 24
  },
  signalLabel: {
    color: colors.muted,
    marginTop: 5,
    fontWeight: "700"
  },
  serviceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12
  },
  showcaseCard: {
    flex: 1,
    minWidth: 220,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 14,
    gap: 8
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: radius.sm,
    backgroundColor: colors.ink,
    alignItems: "center",
    justifyContent: "center"
  },
  cardBadge: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  cardTitle: {
    color: colors.text,
    fontWeight: "800",
    fontSize: 18
  },
  cardCopy: {
    color: colors.muted,
    lineHeight: 20
  },
  columns: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14
  },
  columnCard: {
    flex: 1,
    minWidth: 280
  },
  emptyText: {
    color: colors.muted,
    lineHeight: 20
  }
});
