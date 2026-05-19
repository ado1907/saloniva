import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { radius } from "../theme/spacing";
import { typography } from "../theme/typography";
import { ActionButton } from "./ActionButton";

type Props = {
  title: string;
  description: string;
  action?: string;
  onActionPress?: () => void;
};

export function ScreenIntro({ title, description, action, onActionPress }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.accentLine} />
      <View style={styles.textWrap}>
        <Text style={styles.eyebrow}>Saloniva Studio</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      {action ? <ActionButton icon="add-circle-outline" label={action} primary onPress={onActionPress} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    padding: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
    flexWrap: "wrap",
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2
  },
  accentLine: {
    width: 4,
    alignSelf: "stretch",
    borderRadius: 999,
    backgroundColor: colors.gold
  },
  textWrap: {
    flex: 1,
    minWidth: 230
  },
  eyebrow: {
    color: colors.champagne,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  title: {
    color: colors.text,
    fontSize: typography.screenTitle,
    fontWeight: "900",
    marginTop: 4
  },
  description: {
    color: colors.muted,
    marginTop: 7,
    lineHeight: typography.lineHeightRelaxed
  }
});
