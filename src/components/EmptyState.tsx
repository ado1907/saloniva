import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { radius } from "../theme/spacing";

type Props = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: Props) {
  return (
    <View style={styles.empty}>
      <View style={styles.iconBox}>
        <Ionicons name="search-outline" size={20} color={colors.accent} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  empty: {
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.softBorder,
    backgroundColor: colors.card,
    padding: 18,
    alignItems: "center",
    gap: 7
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: radius.sm,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    color: colors.text,
    fontWeight: "800",
    fontSize: 16,
    textAlign: "center"
  },
  description: {
    color: colors.muted,
    textAlign: "center",
    lineHeight: 20
  }
});
