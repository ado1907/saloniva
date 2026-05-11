import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { radius } from "../theme/spacing";

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  badge?: string;
  danger?: boolean;
  onPress?: () => void;
};

export function SettingsRow({ icon, title, subtitle, badge, danger, onPress }: Props) {
  const Container = onPress ? Pressable : View;

  return (
    <Container onPress={onPress} style={styles.row}>
      <View style={[styles.iconBox, danger ? styles.dangerBox : null]}>
        <Ionicons name={icon} size={18} color={danger ? colors.danger : colors.accent} />
      </View>
      <View style={styles.textWrap}>
        <Text style={[styles.title, danger ? styles.dangerText : null]}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      {badge ? <Text style={styles.badge}>{badge}</Text> : null}
    </Container>
  );
}

const styles = StyleSheet.create({
  row: {
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.softBorder,
    backgroundColor: colors.card,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center"
  },
  dangerBox: {
    backgroundColor: colors.red
  },
  textWrap: {
    flex: 1
  },
  title: {
    color: colors.text,
    fontWeight: "800"
  },
  dangerText: {
    color: colors.danger
  },
  subtitle: {
    color: colors.muted,
    marginTop: 3,
    lineHeight: 19
  },
  badge: {
    color: colors.accent,
    fontWeight: "800"
  }
});
