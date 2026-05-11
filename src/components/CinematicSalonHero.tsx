import { ImageBackground, StyleSheet, Text, View } from "react-native";
import { visualAssets } from "../config/visualAssets";
import { colors } from "../theme/colors";
import { radius } from "../theme/spacing";

const heroStats = [
  ["%92", "doluluk"],
  ["18", "randevu"],
  ["4.9", "memnuniyet"]
];

export function CinematicSalonHero() {
  return (
    <ImageBackground source={{ uri: visualAssets.treatmentRoom }} style={styles.hero} imageStyle={styles.image}>
      <View style={styles.overlay}>
        <View style={styles.copy}>
          <Text style={styles.kicker}>Saloniva premium cockpit</Text>
          <Text style={styles.title}>Lüks salon deneyimi, güçlü işletme kontrolü</Text>
          <Text style={styles.text}>
            Randevu, gelir, müşteri sadakati ve satış fırsatları tek sahnede birleşir. Demo sunumunda ilk bakışta premium ürün hissi verir.
          </Text>
        </View>
        <View style={styles.stats}>
          {heroStats.map(([value, label]) => (
            <View key={label} style={styles.statCard}>
              <Text style={styles.statValue}>{value}</Text>
              <Text style={styles.statLabel}>{label}</Text>
            </View>
          ))}
        </View>
      </View>
    </ImageBackground>
  );
}

export function VisualMoodBoard() {
  return (
    <View style={styles.moodGrid}>
      <ImageTile image={visualAssets.salonInterior} label="İç mekan" />
      <ImageTile image={visualAssets.skincare} label="Bakım" />
      <ImageTile image={visualAssets.salonTools} label="Detay" />
    </View>
  );
}

function ImageTile({ image, label }: { image: string; label: string }) {
  return (
    <ImageBackground source={{ uri: image }} style={styles.tile} imageStyle={styles.tileImage}>
      <View style={styles.tileOverlay}>
        <Text style={styles.tileLabel}>{label}</Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  hero: {
    minHeight: 310,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.sage,
    overflow: "hidden",
    backgroundColor: colors.ink
  },
  image: {
    resizeMode: "cover"
  },
  overlay: {
    minHeight: 310,
    padding: 18,
    backgroundColor: "rgba(25, 24, 18, 0.46)",
    justifyContent: "space-between",
    gap: 18
  },
  copy: {
    maxWidth: 680,
    gap: 8
  },
  kicker: {
    color: colors.goldSoft,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  title: {
    color: colors.white,
    fontSize: 31,
    fontWeight: "800",
    lineHeight: 38
  },
  text: {
    color: "#f2eadb",
    fontSize: 15,
    lineHeight: 22
  },
  stats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  statCard: {
    minWidth: 118,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: "rgba(245, 231, 204, 0.50)",
    backgroundColor: "rgba(255, 250, 241, 0.18)",
    padding: 12
  },
  statValue: {
    color: colors.white,
    fontSize: 24,
    fontWeight: "800"
  },
  statLabel: {
    color: "#f2eadb",
    fontWeight: "700",
    marginTop: 3
  },
  moodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  tile: {
    flex: 1,
    minWidth: 140,
    height: 118,
    borderRadius: radius.sm,
    overflow: "hidden",
    backgroundColor: colors.ink
  },
  tileImage: {
    resizeMode: "cover"
  },
  tileOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 10,
    backgroundColor: "rgba(43, 37, 31, 0.30)"
  },
  tileLabel: {
    color: colors.white,
    fontWeight: "800"
  }
});
