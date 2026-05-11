import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, type GestureResponderEvent } from "react-native";
import { colors } from "../theme/colors";
import { radius } from "../theme/spacing";

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  primary?: boolean;
  onPress?: () => void;
};

export function ActionButton({ icon, label, primary, onPress }: Props) {
  const handlePress = (event: GestureResponderEvent) => {
    event.stopPropagation();
    onPress?.();
  };

  return (
    <Pressable onPress={handlePress} style={[styles.button, primary ? styles.primary : null]}>
      <Ionicons name={icon} size={18} color={primary ? colors.white : colors.accent} />
      <Text style={[styles.text, primary ? styles.primaryText : null]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 40,
    borderRadius: radius.sm,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.softBorder,
    backgroundColor: colors.card,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1
  },
  primary: {
    borderColor: colors.sage,
    backgroundColor: colors.accent
  },
  text: {
    color: colors.accent,
    fontWeight: "800",
    fontSize: 13
  },
  primaryText: {
    color: colors.white
  }
});
