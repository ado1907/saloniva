import { StyleSheet, Text, View } from "react-native";
import { BrandMark } from "../components/BrandMark";
import { colors } from "../theme/colors";
import type { TabKey } from "../types";
import { NavItem } from "./NavItem";

type Props = {
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;
};

export function Sidebar({ activeTab, setActiveTab }: Props) {
  return (
    <View style={styles.sidebar}>
      <BrandMark dark />
      <Text style={styles.brandName}>Saloniva</Text>
      <Text style={styles.brandSubtitle}>Salon yönetimi</Text>
      <View style={styles.nav}>
        <NavItem icon="grid-outline" label="Panel" tab="panel" activeTab={activeTab} setActiveTab={setActiveTab} />
        <NavItem icon="calendar-outline" label="Takvim" tab="calendar" activeTab={activeTab} setActiveTab={setActiveTab} />
        <NavItem icon="people-outline" label="Müşteriler" tab="customers" activeTab={activeTab} setActiveTab={setActiveTab} />
        <NavItem icon="layers-outline" label="Paketler" tab="packages" activeTab={activeTab} setActiveTab={setActiveTab} />
        <NavItem icon="card-outline" label="Ödemeler" tab="payments" activeTab={activeTab} setActiveTab={setActiveTab} />
        <NavItem icon="pricetags-outline" label="Hizmetler" tab="services" activeTab={activeTab} setActiveTab={setActiveTab} />
        <NavItem icon="person-circle-outline" label="Personel" tab="staff" activeTab={activeTab} setActiveTab={setActiveTab} />
        <NavItem icon="bar-chart-outline" label="Raporlar" tab="reports" activeTab={activeTab} setActiveTab={setActiveTab} />
        <NavItem icon="settings-outline" label="Ayarlar" tab="settings" activeTab={activeTab} setActiveTab={setActiveTab} />
        <NavItem icon="ellipsis-horizontal-circle-outline" label="Daha Fazla" tab="more" activeTab={activeTab} setActiveTab={setActiveTab} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 248,
    paddingHorizontal: 22,
    paddingVertical: 26,
    backgroundColor: colors.ink,
    borderRightWidth: 1,
    borderRightColor: colors.gold
  },
  brandName: {
    marginTop: 12,
    fontSize: 24,
    fontWeight: "800",
    color: colors.white
  },
  brandSubtitle: {
    color: "#d9d2c5",
    marginTop: 3
  },
  nav: {
    gap: 8,
    marginTop: 34
  }
});
