import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { radius } from "../theme/spacing";

type Props = {
  title: string;
  subtitle: string;
  badge: string;
  onPress?: () => void;
};

export function CompactRow({ title, subtitle, badge, onPress }: Props) {
  const Container = onPress ? Pressable : View;

  return (
    <Container onPress={onPress} style={styles.row}>
      <View style={styles.textWrap}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <Text style={styles.badge}>{badge}</Text>
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
    justifyContent: "space-between",
    gap: 10
  },
  textWrap: {
    flex: 1
  },
  title: {
    color: colors.text,
    fontWeight: "700"
  },
  subtitle: {
    color: colors.muted,
    marginTop: 4,
    lineHeight: 19
  },
  badge: {
    color: colors.accent,
    fontWeight: "700"
  }
});
