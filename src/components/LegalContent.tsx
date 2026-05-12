import { StyleSheet, Text, View } from "react-native";
import { productConfig } from "../config/productConfig";
import { colors } from "../theme/colors";
import { radius } from "../theme/spacing";

type LegalType = "privacy" | "terms" | "support" | "delete";

type Props = {
  type: LegalType;
};

const content: Record<LegalType, { title: string; paragraphs: string[] }> = {
  privacy: {
    title: "Gizlilik Politikası",
    paragraphs: [
      "Saloniva; salon adı, kullanıcı e-postası, müşteri adı, telefon, randevu, paket, seans, ödeme ve not bilgilerini salon yönetimi amacıyla işler.",
      "Demo modda veriler cihazda saklanabilir. Supabase modda veriler salon bazlı yetkilendirme ve RLS politikalarıyla korunur.",
      "Müşteri verileri satış veya reklam amacıyla üçüncü taraflarla paylaşılmaz. WhatsApp mesajı kullanıcı onayıyla cihazdaki bağlantı üzerinden açılır.",
      `Gizlilik sayfası: ${productConfig.privacyUrl}`,
      "Kullanıcılar ayarlar bölümünden hesap silme talebi ve destek süreci hakkında bilgi alabilir."
    ]
  },
  terms: {
    title: "Kullanım Koşulları",
    paragraphs: [
      "Saloniva, güzellik salonlarının randevu, müşteri, paket, personel ve ödeme süreçlerini yönetmesine yardımcı olan bir işletme aracıdır.",
      "Kullanıcı, sisteme eklediği müşteri verilerinin doğruluğundan ve bu verileri yasal izinlerle işlediğinden sorumludur.",
      "Fiyatlandırma, abonelik planı ve destek kapsamı web sitesinde veya satış sözleşmesinde ayrıca belirtilir.",
      `Kullanım koşulları: ${productConfig.termsUrl}`,
      "Demo veriler temsilidir; gerçek finansal kayıt veya muhasebe belgesi yerine geçmez."
    ]
  },
  support: {
    title: "Destek İletişimi",
    paragraphs: [
      `Destek e-postası: ${productConfig.supportEmail}`,
      `Destek sayfası: ${productConfig.supportUrl}`,
      "Destek kapsamı: kurulum, hesap erişimi, veri yönetimi, mağaza sürümü, hata bildirimi ve kullanım soruları.",
      "Mağaza yayın sürecinde App Store ve Google Play inceleme ekipleri için demo hesap bilgileri sağlanmalıdır."
    ]
  },
  delete: {
    title: "Hesap Silme Talebi",
    paragraphs: [
      "Salon sahibi, ayarlar bölümünden hesap ve salon verilerinin silinmesi için talep oluşturabilmelidir.",
      "Silme talebi; salon hesabı, kullanıcı hesabı, müşteri kayıtları, randevular, paketler, ödeme kayıtları ve notları kapsar.",
      `Hesap silme web linki: ${productConfig.deleteAccountUrl}`,
      "Canlı sürümde silme talebi destek ekibine iletilmeli, işlem durumu kullanıcıya e-posta ile bildirilmelidir.",
      "Demo modda 'Demo Veriye Sıfırla' butonu yerel demo verileri temizlemek veya boş bulut salonunu demo verilerle doldurmak için kullanılır."
    ]
  }
};

export function LegalContent({ type }: Props) {
  const selected = content[type];

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{selected.title}</Text>
      {selected.paragraphs.map((paragraph) => (
        <View key={paragraph} style={styles.paragraphBox}>
          <Text style={styles.paragraph}>{paragraph}</Text>
        </View>
      ))}
    </View>
  );
}

export type { LegalType };

const styles = StyleSheet.create({
  wrap: {
    gap: 10
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "800"
  },
  paragraphBox: {
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.softBorder,
    backgroundColor: colors.card,
    padding: 12
  },
  paragraph: {
    color: colors.muted,
    lineHeight: 21
  }
});

