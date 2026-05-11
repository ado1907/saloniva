import { Pressable, StyleSheet, Text } from "react-native";
import { colors } from "../theme/colors";
import { radius } from "../theme/spacing";

type Props = {
  label: string;
  active?: boolean;
  onPress?: () => void;
};

export function Pill({ label, active, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={[styles.pill, active ? styles.active : null]}>
      <Text style={[styles.text, active ? styles.activeText : null]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 13,
    paddingVertical: 9
  },
  active: {
    backgroundColor: colors.accent,
    borderColor: colors.sage
  },
  text: {
    color: colors.mutedDark,
    fontWeight: "800"
  },
  activeText: {
    color: colors.white
  }
});
