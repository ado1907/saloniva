import type { ReactNode } from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { colors } from "../theme/colors";
import { radius } from "../theme/spacing";
import { typography } from "../theme/typography";

type Props = {
  title: string;
  action?: string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function PanelCard({ title, action, children, style }: Props) {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {action ? <Text style={styles.action}>{action}</Text> : null}
      </View>
      <View style={styles.stack}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.softBorder,
    backgroundColor: colors.card,
    padding: 15,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 7 },
    elevation: 2
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14
  },
  title: {
    color: colors.text,
    fontSize: typography.sectionTitle,
    fontWeight: "700"
  },
  action: {
    color: colors.accent,
    fontWeight: "700"
  },
  stack: {
    gap: 10
  }
});
