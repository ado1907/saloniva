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
      <View style={styles.textWrap}>
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
    backgroundColor: colors.surface,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap"
  },
  textWrap: {
    flex: 1,
    minWidth: 230
  },
  title: {
    color: colors.text,
    fontSize: typography.screenTitle,
    fontWeight: "700"
  },
  description: {
    color: colors.muted,
    marginTop: 6,
    lineHeight: typography.lineHeightRelaxed
  }
});
