import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text } from "react-native";
import { colors } from "../theme/colors";
import { radius } from "../theme/spacing";
import type { TabKey } from "../types";

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  tab: TabKey;
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;
  compact?: boolean;
};

export function NavItem({ icon, label, tab, activeTab, setActiveTab, compact }: Props) {
  const active = activeTab === tab;

  return (
    <Pressable
      onPress={() => setActiveTab(tab)}
      style={[
        compact ? styles.bottomItem : styles.item,
        active ? (compact ? styles.active : styles.activeDark) : null,
      ]}
    >
      <Ionicons
        name={icon}
        size={compact ? 20 : 19}
        color={active ? (compact ? colors.accent : colors.goldSoft) : compact ? colors.mutedDark : "#efe4cf"}
      />
      <Text
        style={[
          compact ? styles.bottomLabel : styles.label,
          !compact ? styles.labelDark : null,
          active ? (compact ? styles.activeLabel : styles.activeLabelDark) : null
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    minHeight: 46,
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  active: {
    backgroundColor: colors.sageSoft,
    borderWidth: 1,
    borderColor: colors.sage
  },
  activeDark: {
    backgroundColor: "#344034",
    borderWidth: 1,
    borderColor: colors.sage
  },
  label: {
    fontSize: 15,
    color: colors.mutedDark,
    fontWeight: "600"
  },
  labelDark: {
    color: "#efe4cf"
  },
  activeLabel: {
    color: colors.accent
  },
  activeLabelDark: {
    color: colors.goldSoft
  },
  bottomItem: {
    flex: 1,
    minHeight: 54,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
    gap: 4
  },
  bottomLabel: {
    color: colors.mutedDark,
    fontSize: 11,
    fontWeight: "700"
  }
});
