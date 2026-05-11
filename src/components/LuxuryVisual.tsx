import { ImageBackground, StyleSheet, Text, View } from "react-native";
import { visualAssets } from "../config/visualAssets";
import { colors } from "../theme/colors";
import { radius } from "../theme/spacing";

export function LuxuryProductScene() {
  return (
    <View style={styles.scene}>
      <ImageBackground source={{ uri: visualAssets.salonInterior }} style={styles.photoPanel} imageStyle={styles.photo}>
        <View style={styles.photoOverlay}>
          <Text style={styles.photoKicker}>Luxury spa interior</Text>
          <Text style={styles.photoTitle}>Premium bakım atmosferi</Text>
        </View>
      </ImageBackground>
      <View style={styles.infoCard}>
        <Text style={styles.kicker}>Premium care</Text>
        <Text style={styles.title}>Lüks salon operasyonu</Text>
        <Text style={styles.text}>Randevu, müşteri, seans ve ödeme akışı zarif bir yönetim panelinde birleşir.</Text>
      </View>
    </View>
  );
}

export function LuxuryMiniScene() {
  return (
    <View style={styles.mini}>
      <View style={styles.miniBottle} />
      <View style={styles.miniText}>
        <Text style={styles.miniTitle}>Premium salon akışı</Text>
        <Text style={styles.miniCopy}>Bugünkü öncelikler düzenlendi.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scene: {
    minHeight: 310,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    overflow: "hidden"
  },
  photoPanel: {
    minHeight: 190,
    justifyContent: "flex-end",
    backgroundColor: colors.ink
  },
  photo: {
    resizeMode: "cover"
  },
  photoOverlay: {
    minHeight: 190,
    justifyContent: "flex-end",
    padding: 16,
    backgroundColor: "rgba(43, 37, 31, 0.34)"
  },
  photoKicker: {
    color: colors.sageSoft,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase"
  },
  photoTitle: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "700",
    marginTop: 5
  },
  infoCard: {
    padding: 16,
    backgroundColor: colors.card,
    gap: 5
  },
  kicker: {
    color: colors.gold,
    fontWeight: "800",
    textTransform: "uppercase",
    fontSize: 12
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "700"
  },
  text: {
    color: colors.muted,
    lineHeight: 20
  },
  mini: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    borderRadius: radius.sm,
    backgroundColor: colors.goldSoft,
    padding: 10
  },
  miniBottle: {
    width: 42,
    height: 62,
    borderRadius: 9,
    backgroundColor: colors.ink,
    borderWidth: 2,
    borderColor: colors.gold
  },
  miniText: {
    flex: 1
  },
  miniTitle: {
    color: colors.text,
    fontWeight: "700",
    fontSize: 16
  },
  miniCopy: {
    color: colors.muted,
    lineHeight: 19,
    marginTop: 4
  }
});
