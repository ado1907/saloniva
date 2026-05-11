import { StyleSheet, Text, View } from "react-native";
import { CompactRow } from "../components/CompactRow";
import { PanelCard } from "../components/PanelCard";
import { ScreenIntro } from "../components/ScreenIntro";
import {
  demoFlowSteps,
  followUpChecklist,
  pilotOffer,
  pilotQualificationQuestions,
  pilotReadinessAssets,
  pilotSalesPitch
} from "../config/pilotSalesKit";
import { colors } from "../theme/colors";
import { radius } from "../theme/spacing";

export function PilotSalesKitScreen() {
  return (
    <View style={styles.sectionGap}>
      <ScreenIntro
        title="Pilot Satış Paketi"
        description="Saloniva'yı gerçek salonlara demo göstermek, pilot müşteri almak ve satış görüşmesini düzenli yürütmek için hazır paket."
      />

      <View style={styles.hero}>
        <Text style={styles.kicker}>Pilot sales kit</Text>
        <Text style={styles.heroTitle}>Demo artık görüşmeye hazır</Text>
        <Text style={styles.heroCopy}>{pilotSalesPitch.oneLine}</Text>
        <View style={styles.pitchBox}>
          <Text style={styles.pitchTitle}>Kime satılır?</Text>
          <Text style={styles.pitchText}>{pilotSalesPitch.buyer}</Text>
        </View>
        <View style={styles.pitchBox}>
          <Text style={styles.pitchTitle}>Verilen söz</Text>
          <Text style={styles.pitchText}>{pilotSalesPitch.promise}</Text>
        </View>
      </View>

      <PanelCard title="5 Dakikalık Demo Akışı">
        {demoFlowSteps.map((step) => (
          <View key={step.title} style={styles.stepCard}>
            <Text style={styles.stepTitle}>{step.title}</Text>
            <Text style={styles.stepDescription}>{step.description}</Text>
            <Text style={styles.stepProof}>{step.proof}</Text>
          </View>
        ))}
      </PanelCard>

      <View style={styles.columns}>
        <PanelCard title="Pilot Teklif" style={styles.columnCard}>
          {pilotOffer.map((item) => (
            <CompactRow key={item.title} title={item.title} subtitle={item.description} badge={item.badge} />
          ))}
        </PanelCard>

        <PanelCard title="Görüşme Soruları" style={styles.columnCard}>
          {pilotQualificationQuestions.map((question, index) => (
            <CompactRow key={question} title={`${index + 1}. soru`} subtitle={question} badge="Sor" />
          ))}
        </PanelCard>
      </View>

      <View style={styles.columns}>
        <PanelCard title="Takip Listesi" style={styles.columnCard}>
          {followUpChecklist.map((item, index) => (
            <CompactRow key={item} title={`${index + 1}. takip`} subtitle={item} badge="Yap" />
          ))}
        </PanelCard>

        <PanelCard title="Hazır Satış Varlıkları" style={styles.columnCard}>
          {pilotReadinessAssets.map((asset) => (
            <CompactRow key={asset} title="Hazır" subtitle={asset} badge="Demo" />
          ))}
        </PanelCard>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionGap: {
    gap: 16
  },
  hero: {
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.sage,
    backgroundColor: colors.ink,
    padding: 18,
    gap: 10
  },
  kicker: {
    color: colors.goldSoft,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  heroTitle: {
    color: colors.white,
    fontSize: 25,
    fontWeight: "800"
  },
  heroCopy: {
    color: "#f3ead8",
    fontSize: 15,
    lineHeight: 22
  },
  pitchBox: {
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: "rgba(245, 231, 204, 0.24)",
    backgroundColor: "#302b22",
    padding: 12
  },
  pitchTitle: {
    color: colors.goldSoft,
    fontWeight: "800"
  },
  pitchText: {
    color: "#f3ead8",
    lineHeight: 20,
    marginTop: 4
  },
  stepCard: {
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.softBorder,
    backgroundColor: colors.card,
    padding: 12,
    gap: 6
  },
  stepTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800"
  },
  stepDescription: {
    color: colors.mutedDark,
    lineHeight: 20
  },
  stepProof: {
    color: colors.accent,
    fontWeight: "800",
    lineHeight: 19
  },
  columns: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    alignItems: "flex-start"
  },
  columnCard: {
    flex: 1,
    minWidth: 300
  }
});
