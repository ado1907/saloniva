import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { radius } from "../theme/spacing";
import type { SalonivaAiInsight, SalonivaSignal } from "../utils/salonivaAiInsights";

type Props = {
  insights: SalonivaAiInsight[];
  isWide: boolean;
  score: number;
  signals: SalonivaSignal[];
};

export function SalonivaIntelligencePanel({ insights, isWide, score, signals }: Props) {
  return (
    <View style={[styles.shell, isWide ? styles.shellWide : null]}>
      <View style={styles.heroBlock}>
        <Text style={styles.kicker}>Saloniva AI Demo</Text>
        <Text style={styles.title}>Satış demosu için akıllı karar vitrini</Text>
        <Text style={styles.copy}>
          ZIP paketlerindeki AI, UI ve grafik fikirleri Expo uyumlu, yerel ve güvenli bir demo katmanına çevrildi.
        </Text>
        <View style={styles.scoreRow}>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreValue}>%{score}</Text>
            <Text style={styles.scoreLabel}>demo hazır</Text>
          </View>
          <View style={styles.scoreCopy}>
            <Text style={styles.scoreTitle}>Sahibin ilk bakacağı yer hazır.</Text>
            <Text style={styles.scoreText}>Tahsilat, randevu, stok ve satış fırsatları tek panelde özetlenir.</Text>
          </View>
        </View>
      </View>

      <View style={styles.signalBlock}>
        <Text style={styles.blockTitle}>Canlı sinyal haritası</Text>
        {signals.map((signal) => (
          <View key={signal.id} style={styles.signalRow}>
            <View style={styles.signalHeader}>
              <Text style={styles.signalLabel}>{signal.label}</Text>
              <Text style={styles.signalValue}>%{signal.value}</Text>
            </View>
            <View style={styles.track}>
              <View style={[styles.trackFill, { width: `${Math.max(signal.value, 8)}%` }]} />
            </View>
            <Text style={styles.signalHint}>{signal.hint}</Text>
          </View>
        ))}
      </View>

      <View style={styles.insightBlock}>
        <Text style={styles.blockTitle}>Önerilen aksiyonlar</Text>
        {insights.map((insight) => (
          <View key={insight.id} style={styles.insightRow}>
            <View style={[styles.dot, getToneDotStyle(insight.tone)]} />
            <View style={styles.insightCopy}>
              <Text style={styles.insightMeta}>{insight.label}</Text>
              <Text style={styles.insightTitle}>{insight.title}</Text>
              <Text style={styles.insightText}>{insight.detail}</Text>
            </View>
            <Text style={styles.action}>{insight.action}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}


function getToneDotStyle(tone: SalonivaAiInsight["tone"]) {
  if (tone === "risk") {
    return styles.riskDot;
  }

  if (tone === "growth") {
    return styles.growthDot;
  }

  if (tone === "flow") {
    return styles.flowDot;
  }

  return styles.careDot;
}
const styles = StyleSheet.create({
  shell: {
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: "rgba(64, 89, 71, 0.18)",
    backgroundColor: colors.card,
    padding: 16,
    gap: 14,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3
  },
  shellWide: {
    flexDirection: "row",
    alignItems: "stretch"
  },
  heroBlock: {
    flex: 1.1,
    borderRadius: radius.sm,
    backgroundColor: colors.ink,
    padding: 16,
    gap: 10
  },
  kicker: {
    color: colors.goldSoft,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  title: {
    color: colors.white,
    fontSize: 24,
    fontWeight: "900",
    lineHeight: 30
  },
  copy: {
    color: colors.goldSoft,
    fontSize: 14,
    lineHeight: 21
  },
  scoreRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    marginTop: 4
  },
  scoreBadge: {
    width: 96,
    borderRadius: radius.sm,
    backgroundColor: colors.accent,
    paddingVertical: 12,
    alignItems: "center"
  },
  scoreValue: {
    color: colors.white,
    fontSize: 24,
    fontWeight: "900"
  },
  scoreLabel: {
    color: colors.goldSoft,
    fontSize: 11,
    fontWeight: "900"
  },
  scoreCopy: {
    flex: 1,
    gap: 3
  },
  scoreTitle: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "900"
  },
  scoreText: {
    color: colors.goldSoft,
    fontSize: 12,
    lineHeight: 17
  },
  signalBlock: {
    flex: 1,
    borderRadius: radius.sm,
    backgroundColor: colors.accentSofter,
    padding: 14,
    gap: 10
  },
  blockTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "900"
  },
  signalRow: {
    gap: 6
  },
  signalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8
  },
  signalLabel: {
    color: colors.mutedDark,
    fontSize: 12,
    fontWeight: "900"
  },
  signalValue: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: "900"
  },
  track: {
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.softBorder,
    overflow: "hidden"
  },
  trackFill: {
    height: "100%",
    borderRadius: radius.pill,
    backgroundColor: colors.accent
  },
  signalHint: {
    color: colors.muted,
    fontSize: 11,
    lineHeight: 15
  },
  insightBlock: {
    flex: 1.2,
    gap: 10
  },
  insightRow: {
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.softBorder,
    backgroundColor: colors.surface,
    padding: 12,
    gap: 8
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: radius.pill
  },
  riskDot: {
    backgroundColor: colors.danger
  },
  growthDot: {
    backgroundColor: colors.gold
  },
  flowDot: {
    backgroundColor: colors.accent
  },
  careDot: {
    backgroundColor: colors.sage
  },
  insightCopy: {
    gap: 3
  },
  insightMeta: {
    color: colors.champagne,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  insightTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "900"
  },
  insightText: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17
  },
  action: {
    alignSelf: "flex-start",
    borderRadius: radius.pill,
    backgroundColor: colors.accentSoft,
    color: colors.accent,
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 11,
    fontWeight: "900"
  }
});