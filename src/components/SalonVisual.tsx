import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { radius } from "../theme/spacing";

export function SalonVisual() {
  return (
    <View style={styles.visual}>
      <View style={styles.wall}>
        <View style={styles.logoMark}>
          <Text style={styles.logoText}>S</Text>
        </View>
        <View style={styles.shelf}>
          <View style={[styles.bottle, styles.bottleTall]} />
          <View style={styles.bottle} />
          <View style={[styles.bottle, styles.bottleSmall]} />
        </View>
      </View>
      <View style={styles.counter}>
        <View style={styles.bowl} />
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Bugün</Text>
          <Text style={styles.cardMetric}>18 randevu</Text>
        </View>
      </View>
      <View style={styles.caption}>
        <Text style={styles.captionTitle}>Premium salon yönetimi</Text>
        <Text style={styles.captionText}>Randevu, müşteri, seans ve ödeme akışı tek panelde.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  visual: {
    minHeight: 280,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    overflow: "hidden"
  },
  wall: {
    flex: 1,
    minHeight: 150,
    backgroundColor: colors.champagneSoft,
    alignItems: "center",
    justifyContent: "center"
  },
  logoMark: {
    width: 78,
    height: 78,
    borderRadius: radius.sm,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center"
  },
  logoText: {
    color: colors.white,
    fontSize: 34,
    fontWeight: "800"
  },
  shelf: {
    position: "absolute",
    right: 26,
    bottom: 22,
    width: 96,
    minHeight: 54,
    borderBottomWidth: 3,
    borderBottomColor: colors.sage,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 8
  },
  bottle: {
    width: 18,
    height: 42,
    borderRadius: 5,
    backgroundColor: colors.sage
  },
  bottleTall: {
    height: 54,
    backgroundColor: colors.accent
  },
  bottleSmall: {
    height: 30,
    backgroundColor: colors.champagne
  },
  counter: {
    minHeight: 72,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18
  },
  bowl: {
    width: 74,
    height: 28,
    borderRadius: 999,
    backgroundColor: colors.sageSoft,
    borderWidth: 1,
    borderColor: colors.border
  },
  card: {
    minWidth: 120,
    borderRadius: radius.sm,
    backgroundColor: colors.accentSoft,
    paddingHorizontal: 12,
    paddingVertical: 9
  },
  cardTitle: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700"
  },
  cardMetric: {
    color: colors.text,
    fontWeight: "800",
    marginTop: 3
  },
  caption: {
    padding: 14,
    gap: 4,
    backgroundColor: colors.card
  },
  captionTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "800"
  },
  captionText: {
    color: colors.muted,
    lineHeight: 20
  }
});
