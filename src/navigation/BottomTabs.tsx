import { StyleSheet, View } from "react-native";
import { colors } from "../theme/colors";
import { radius } from "../theme/spacing";
import type { TabKey } from "../types";
import { NavItem } from "./NavItem";

type Props = {
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;
};

export function BottomTabs({ activeTab, setActiveTab }: Props) {
  return (
    <View style={styles.tabs}>
      <NavItem compact icon="grid-outline" label="Panel" tab="panel" activeTab={activeTab} setActiveTab={setActiveTab} />
      <NavItem compact icon="calendar-outline" label="Takvim" tab="calendar" activeTab={activeTab} setActiveTab={setActiveTab} />
      <NavItem compact icon="people-outline" label="Müşteri" tab="customers" activeTab={activeTab} setActiveTab={setActiveTab} />
      <NavItem compact icon="card-outline" label="Ödeme" tab="payments" activeTab={activeTab} setActiveTab={setActiveTab} />
      <NavItem compact icon="menu-outline" label="Diğer" tab="more" activeTab={activeTab} setActiveTab={setActiveTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  tabs: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 14,
    minHeight: 66,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 6
  }
});
