import { StyleSheet, View } from "react-native";
import { CompactRow } from "../components/CompactRow";
import { PanelCard } from "../components/PanelCard";
import { ScreenIntro } from "../components/ScreenIntro";
import type { TabKey } from "../types";

type Props = {
  onNavigate: (tab: TabKey) => void;
};

const managementItems: Array<[string, string, string, TabKey]> = [
  ["Paketler", "Seans takibi, kalan ödeme ve paket yenileme fırsatları.", "Aç", "packages"],
  ["Hizmetler", "Hizmet süreleri, fiyatlar ve kategoriler.", "Aç", "services"],
  ["Personel", "Randevu yoğunluğu ve personel performansı.", "Aç", "staff"],
  ["Raporlar", "Günlük gelir, aylık tahsilat ve popüler hizmetler.", "Aç", "reports"],
  ["Ayarlar", "Salon bilgileri, destek, gizlilik ve hesap silme.", "Aç", "settings"],
  ["Kurulum Sihirbazı", "Yeni salonun profil, hizmet, personel, vitrin ve ödeme kurulumunu takip edin.", "Aç", "onboarding"],
  ["Ajan Çalışma Merkezi", "Ürün, arayüz, teknik hata, güvenlik, mağaza ve test ajanlarını sırayla yönetin.", "Aç", "agents"],
  ["Pilot Satış Paketi", "Salonlara demo göstermek, pilot teklif sunmak ve görüşme sonrası takip yapmak için hazır satış paketi.", "Aç", "pilot"],
  ["Canlı Ürün Hazırlığı", "Backend, tenant, ödeme, mağaza, hukuki linkler ve gerçek test adımlarını sırayla takip edin.", "Aç", "production"],
  ["Güvenlik ve Yetki Merkezi", "Salon sahibi, yönetici ve personel erişimlerini satışa uygun güvenlik modeliyle izleyin.", "Aç", "security"],
  ["Abonelik ve Ödeme", "Plan seçimi, deneme süresi ve lisans hazırlığı.", "Aç", "billing"],
  ["Salon Vitrini", "Hizmetleri, paketleri, yorum güvenini ve şubeleri müşteriye gösteren profesyonel sayfa.", "Aç", "showcase"],
  ["Satış Fırsatları", "Vitrin ve online talepleri gelir potansiyeline göre takip edin.", "Aç", "opportunities"],
  ["Online Randevu Linki", "Müşterilerin kendi randevusunu oluşturacağı paylaşılabilir sayfa.", "Aç", "booking"],
  ["Kampanyalar", "Eski müşterileri geri çağırmak için hazır mesaj ve segmentler.", "Aç", "campaigns"],
  ["Stok Takibi", "Bakım ürünleri ve sarf malzemeler için stok uyarıları.", "Aç", "inventory"],
  ["Çok Şube", "Birden fazla salonun tek hesapla yönetilmesi.", "Aç", "branches"],
  ["Mobil Müşteri Uygulaması", "Müşterinin randevu, paket ve sadakat deneyimini gösteren demo.", "Aç", "clientApp"],
  ["Kalite Merkezi", "Güvenlik, mağaza, tasarım ve test hazırlığını tek ekranda izleyin.", "Aç", "quality"],
  ["Satışa Çıkış Merkezi", "Backend, abonelik, mağaza ve test eksiklerini sırayla takip edin.", "Aç", "launch"]
];

const futureItems = [["Otomatik bildirim motoru", "Randevu, borç ve paket yenileme mesajlarının kurallara göre otomatik gönderimi."]];

export function MoreScreen({ onNavigate }: Props) {
  return (
    <View style={styles.sectionGap}>
      <ScreenIntro
        title="Daha Fazla"
        description="Web panelde detaylı, mobilde hızlı kullanılacak yönetim alanları."
      />
      <PanelCard title="Yönetim Modülleri">
        {managementItems.map(([title, subtitle, badge, tab]) => (
          <CompactRow key={title} title={title} subtitle={subtitle} badge={badge} onPress={() => onNavigate(tab)} />
        ))}
      </PanelCard>
      <PanelCard title="Sonraki Aşama Modülleri">
        {futureItems.map(([title, subtitle]) => (
          <CompactRow key={title} title={title} subtitle={subtitle} badge="Planlı" />
        ))}
      </PanelCard>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionGap: {
    gap: 16
  }
});
