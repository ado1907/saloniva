import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { CompactRow } from "../components/CompactRow";
import { PanelCard } from "../components/PanelCard";
import { ScreenIntro } from "../components/ScreenIntro";
import { activeAgentCount, agentWorkflow, agentWorkflowOrder } from "../config/agentWorkflow";
import { colors } from "../theme/colors";
import { radius } from "../theme/spacing";

export function AgentWorkflowScreen() {
  return (
    <View style={styles.sectionGap}>
      <ScreenIntro
        title="Ajan Çalışma Merkezi"
        description="Saloniva'yı her adımda aynı sırayla geliştirmek için ürün, arayüz, teknik hata, güvenlik, mağaza ve test ajanları burada takip edilir."
      />

      <View style={styles.hero}>
        <View style={styles.heroIcon}>
          <Ionicons name="git-branch-outline" size={30} color={colors.gold} />
        </View>
        <View style={styles.heroText}>
          <Text style={styles.kicker}>Systematic build flow</Text>
          <Text style={styles.heroTitle}>Ajanlar sıraya bağlandı</Text>
          <Text style={styles.heroCopy}>
            Her geliştirme turunda önce satış değeri, sonra ürün akışı, premium arayüz, teknik sağlamlık, güvenlik ve mağaza hazırlığı kontrol edilir.
          </Text>
        </View>
        <View style={styles.heroMetric}>
          <Text style={styles.metricValue}>{activeAgentCount}</Text>
          <Text style={styles.metricLabel}>aktif ajan</Text>
        </View>
      </View>

      <View style={styles.columns}>
        <View style={styles.mainColumn}>
          <PanelCard title="Ajanlar ve Görevleri">
            {agentWorkflow.map((agent, index) => (
              <View key={agent.id} style={styles.agentCard}>
                <View style={styles.agentHeader}>
                  <View style={styles.agentIcon}>
                    <Ionicons name={agent.icon} size={20} color={colors.sage} />
                  </View>
                  <View style={styles.agentTitleWrap}>
                    <Text style={styles.agentStep}>Adım {index + 1}</Text>
                    <Text style={styles.agentName}>{agent.name}</Text>
                  </View>
                  <Text style={[styles.status, agent.status === "Kritik" ? styles.statusCritical : null]}>
                    {agent.status}
                  </Text>
                </View>
                <Text style={styles.agentMission}>{agent.mission}</Text>
                <Text style={styles.agentOutput}>{agent.output}</Text>
              </View>
            ))}
          </PanelCard>
        </View>

        <View style={styles.sideColumn}>
          <PanelCard title="Çalışma Sırası">
            {agentWorkflowOrder.map((item) => (
              <CompactRow
                key={item.title}
                title={`${item.step}. ${item.title}`}
                subtitle="Bu ajan kendi kontrolünü tamamlamadan sonraki kalite adımına geçilmez."
                badge={item.status}
              />
            ))}
          </PanelCard>

          <PanelCard title="Kontrol Noktaları">
            {agentWorkflow.slice(0, 4).map((agent) => (
              <View key={agent.id} style={styles.checkBlock}>
                <Text style={styles.checkTitle}>{agent.name}</Text>
                {agent.checks.map((check) => (
                  <View key={check} style={styles.checkRow}>
                    <Ionicons name="checkmark-circle-outline" size={16} color={colors.sage} />
                    <Text style={styles.checkText}>{check}</Text>
                  </View>
                ))}
              </View>
            ))}
          </PanelCard>
        </View>
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
    padding: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    alignItems: "center"
  },
  heroIcon: {
    width: 58,
    height: 58,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.sage,
    backgroundColor: "#332d26",
    alignItems: "center",
    justifyContent: "center"
  },
  heroText: {
    flex: 1,
    minWidth: 240
  },
  kicker: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  heroTitle: {
    color: colors.white,
    fontSize: 23,
    fontWeight: "800",
    marginTop: 5
  },
  heroCopy: {
    color: "#d9d2c5",
    marginTop: 6,
    lineHeight: 21
  },
  heroMetric: {
    minWidth: 96,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.gold,
    backgroundColor: "#3b332b",
    padding: 12,
    alignItems: "center"
  },
  metricValue: {
    color: colors.white,
    fontSize: 28,
    fontWeight: "800"
  },
  metricLabel: {
    color: "#d9d2c5",
    fontWeight: "700",
    marginTop: 2
  },
  columns: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    alignItems: "flex-start"
  },
  mainColumn: {
    flex: 1.35,
    minWidth: 300
  },
  sideColumn: {
    flex: 1,
    minWidth: 280,
    gap: 14
  },
  agentCard: {
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.softBorder,
    backgroundColor: colors.card,
    padding: 12,
    gap: 8
  },
  agentHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  agentIcon: {
    width: 38,
    height: 38,
    borderRadius: radius.sm,
    backgroundColor: colors.sageSoft,
    alignItems: "center",
    justifyContent: "center"
  },
  agentTitleWrap: {
    flex: 1
  },
  agentStep: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  agentName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
    marginTop: 2
  },
  status: {
    color: colors.accent,
    fontWeight: "800"
  },
  statusCritical: {
    color: colors.danger
  },
  agentMission: {
    color: colors.mutedDark,
    lineHeight: 20
  },
  agentOutput: {
    color: colors.muted,
    lineHeight: 19
  },
  checkBlock: {
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.softBorder,
    backgroundColor: colors.card,
    padding: 12,
    gap: 8
  },
  checkTitle: {
    color: colors.text,
    fontWeight: "800"
  },
  checkRow: {
    flexDirection: "row",
    gap: 7,
    alignItems: "flex-start"
  },
  checkText: {
    flex: 1,
    color: colors.muted,
    lineHeight: 19
  }
});
