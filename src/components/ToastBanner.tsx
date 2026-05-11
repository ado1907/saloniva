import { useEffect } from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSalonStore } from "../state/SalonStore";
import { colors } from "../theme/colors";
import { radius } from "../theme/spacing";

export function ToastBanner() {
  const { notice, clearNotice } = useSalonStore();
  const { width } = useWindowDimensions();
  const isWide = width >= 900;

  useEffect(() => {
    if (!notice) {
      return;
    }

    const timer = setTimeout(clearNotice, 2600);
    return () => clearTimeout(timer);
  }, [clearNotice, notice]);

  if (!notice) {
    return null;
  }

  return (
    <View style={[styles.toast, isWide ? styles.toastWide : null]}>
      <Ionicons name="checkmark-circle-outline" size={19} color={colors.white} />
      <Text style={styles.text}>{notice}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    left: 18,
    right: 18,
    bottom: 92,
    maxWidth: 520,
    alignSelf: "center",
    borderRadius: radius.sm,
    backgroundColor: colors.accent,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8
  },
  toastWide: {
    bottom: 24
  },
  text: {
    color: colors.white,
    fontWeight: "800",
    textAlign: "center"
  }
});
