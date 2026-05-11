import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { radius } from "../theme/spacing";

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  text: string;
  tone?: "default" | "warning" | "success";
};

export function InsightCard({ icon, title, text, tone = "default" }: Props) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconBox, tone === "warning" ? styles.warningBox : null, tone === "success" ? styles.successBox : null]}>
        <Ionicons name={icon} size={18} color={tone === "warning" ? colors.danger : colors.accent} />
      </View>
      <View style={styles.textWrap}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.softBorder,
    backgroundColor: colors.card,
    padding: 12,
    flexDirection: "row",
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
  warningBox: {
    backgroundColor: colors.red
  },
  successBox: {
    backgroundColor: colors.green
  },
  textWrap: {
    flex: 1
  },
  title: {
    color: colors.text,
    fontWeight: "800"
  },
  text: {
    color: colors.muted,
    marginTop: 3,
    lineHeight: 19
  }
});
