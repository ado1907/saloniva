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
    <Pressable
      accessibilityRole="button"
      onPress={handlePress}
      style={({ pressed }) => [styles.button, primary ? styles.primary : null, pressed ? styles.pressed : null]}
    >
      <Ionicons name={icon} size={18} color={primary ? colors.white : colors.accent} />
      <Text style={[styles.text, primary ? styles.primaryText : null]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 42,
    borderRadius: radius.sm,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: colors.softBorder,
    backgroundColor: colors.card,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2
  },
  primary: {
    borderColor: colors.accent,
    backgroundColor: colors.accent
  },
  pressed: {
    transform: [{ translateY: 1 }],
    opacity: 0.9
  },
  text: {
    color: colors.accent,
    fontWeight: "900",
    fontSize: 13
  },
  primaryText: {
    color: colors.white
  }
});
