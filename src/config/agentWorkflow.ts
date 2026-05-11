import { Ionicons } from "@expo/vector-icons";

export type AgentStatus = "Aktif" | "Hazır" | "Sırada" | "Kritik";

export type AgentWorkflowItem = {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  status: AgentStatus;
  skillSource: string;
  mission: string;
  output: string;
  checks: string[];
};

export const agentWorkflow: AgentWorkflowItem[] = [
  {
    id: "business-planner",
    name: "Business App Planner",
    icon: "briefcase-outline",
    status: "Aktif",
    skillSource: "codex-skills/business-app-planner",
    mission: "Uygulamanin salon sahibine satilabilir degerini ve siradaki ticari onceligi belirler.",
    output: "Gelir etkisi, demo mesaji, MVP siniri ve risk listesi.",
    checks: ["Gelir etkisi net mi?", "Bes dakikalik demo guclu mu?", "Ozellik isletme sahibine para kazandiriyor mu?"]
  },
  {
    id: "saloniva-builder",
    name: "Saloniva App Builder",
    icon: "construct-outline",
    status: "Aktif",
    skillSource: "codex-skills/saloniva-app-builder",
    mission: "Ekranlari, veri akisini ve dokumani Saloniva urun standardina gore tamamlar.",
    output: "Calisan modul, demo veri akisi, dokuman ve sonraki teknik adim.",
    checks: ["Web, Android ve iOS dusunuldu mu?", "Ekran demo icin kullanilabilir mi?", "Dokuman guncellendi mi?"]
  },
  {
    id: "premium-ui",
    name: "Premium UI Designer",
    icon: "sparkles-outline",
    status: "Aktif",
    skillSource: "codex-skills/premium-ui-designer",
    mission: "Arayuzu luks, sade, soft kahve ve sage yesil agirlikli profesyonel stile tasir.",
    output: "Okunabilir ekran, tutarli renk, klas tipografi ve magazaya uygun gorunum.",
    checks: ["Renkler tek duze degil mi?", "Mobilde yazilar tasiyor mu?", "Gorsel urunu daha guclu gosteriyor mu?"]
  },
  {
    id: "expo-troubleshooter",
    name: "Expo Troubleshooter",
    icon: "terminal-outline",
    status: "Hazır",
    skillSource: "codex-skills/expo-troubleshooter",
    mission: "Expo, npm, localhost ve Metro hatalarinda ilk kirilan noktayi bulur.",
    output: "Kisa cozum, yeniden acma adimi ve kontrol edilecek hata satiri.",
    checks: ["Sunucu calisiyor mu?", "Ilk kirmizi hata duzeldi mi?", "Paket surumleri Expo ile uyumlu mu?"]
  },
  {
    id: "security-data",
    name: "Security and Data Agent",
    icon: "shield-checkmark-outline",
    status: "Hazır",
    skillSource: "production security rules",
    mission: "Rol yetkisi, salon bazli veri ayrimi, hesap silme ve hassas veri kurallarini sertlestirir.",
    output: "Yetki matrisi, veri siniflandirmasi, backend gereksinimleri ve log plani.",
    checks: ["Her salon sadece kendi verisini goruyor mu?", "Personel odeme ve ayar verisine sinirli mi?", "Hesap silme ve disari aktarma plani var mi?"]
  },
  {
    id: "store-readiness",
    name: "Store Readiness Agent",
    icon: "rocket-outline",
    status: "Aktif",
    skillSource: "docs/store-readiness.md",
    mission: "App Store, Google Play ve web satis sayfasi icin yayin eksiklerini siralar.",
    output: "Ekran goruntusu listesi, destek/gizlilik linkleri, build ve abonelik kontrolu.",
    checks: ["Gizlilik linki hazir mi?", "Ekran goruntuleri guclu mu?", "Abonelik modeli magaza kurallarina uygun mu?"]
  },
  {
    id: "qa-agent",
    name: "QA Agent",
    icon: "checkmark-done-outline",
    status: "Aktif",
    skillSource: "quality checklist",
    mission: "Kritik randevu, musteri, paket, odeme, tema ve dil akisini test planina baglar.",
    output: "Kabul kriterleri, manuel test listesi ve kalan riskler.",
    checks: ["Randevu akisi tamam mi?", "Odeme ve paket hesabinda tutarsizlik var mi?", "Tema ve dil degisimleri bozmuyor mu?"]
  }
];

export const activeAgentCount = agentWorkflow.filter((agent) => agent.status === "Aktif").length;

export const agentWorkflowOrder = agentWorkflow.map((agent, index) => ({
  step: index + 1,
  title: agent.name,
  status: agent.status
}));
