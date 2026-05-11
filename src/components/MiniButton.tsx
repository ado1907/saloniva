import type { GestureResponderEvent } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text } from "react-native";
import { colors } from "../theme/colors";
import { radius } from "../theme/spacing";

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
};

export function MiniButton({ icon, label, onPress }: Props) {
  const handlePress = (event: GestureResponderEvent) => {
    event.stopPropagation();
    onPress?.();
  };

  return (
    <Pressable onPress={handlePress} style={styles.button}>
      <Ionicons name={icon} size={15} color={colors.accent} />
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 31,
    borderRadius: radius.sm,
    paddingHorizontal: 10,
    backgroundColor: colors.accentSofter,
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  text: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: "800"
  }
});
