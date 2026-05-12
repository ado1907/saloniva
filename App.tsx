import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { ActionButton } from "./src/components/ActionButton";
import { AgentWorkflowScreen } from "./src/screens/AgentWorkflowScreen";
import { ModalShell } from "./src/components/ModalShell";
import { ToastBanner } from "./src/components/ToastBanner";
import { GlobalSearch } from "./src/components/GlobalSearch";
import { NewAppointmentForm } from "./src/components/forms/NewAppointmentForm";
import { NewCustomerForm } from "./src/components/forms/NewCustomerForm";
import { NewPaymentForm } from "./src/components/forms/NewPaymentForm";
import { BottomTabs } from "./src/navigation/BottomTabs";
import { Sidebar } from "./src/navigation/Sidebar";
import { AuthScreen } from "./src/screens/AuthScreen";
import { BillingScreen } from "./src/screens/BillingScreen";
import { BookingLinkScreen } from "./src/screens/BookingLinkScreen";
import { BranchesScreen } from "./src/screens/BranchesScreen";
import { CalendarScreen } from "./src/screens/CalendarScreen";
import { CampaignsScreen } from "./src/screens/CampaignsScreen";
import { ClientAppScreen } from "./src/screens/ClientAppScreen";
import { CustomersScreen } from "./src/screens/CustomersScreen";
import { DashboardScreen } from "./src/screens/DashboardScreen";
import { InventoryScreen } from "./src/screens/InventoryScreen";
import { LaunchReadinessScreen } from "./src/screens/LaunchReadinessScreen";
import { MoreScreen } from "./src/screens/MoreScreen";
import { OnboardingScreen } from "./src/screens/OnboardingScreen";
import { PackagesScreen } from "./src/screens/PackagesScreen";
import { PaymentsScreen } from "./src/screens/PaymentsScreen";
import { PilotSalesKitScreen } from "./src/screens/PilotSalesKitScreen";
import { ProductionReadinessScreen } from "./src/screens/ProductionReadinessScreen";
import { QualityCenterScreen } from "./src/screens/QualityCenterScreen";
import { ReportsScreen } from "./src/screens/ReportsScreen";
import { ServicesScreen } from "./src/screens/ServicesScreen";
import { ServiceShowcaseScreen } from "./src/screens/ServiceShowcaseScreen";
import { SettingsScreen } from "./src/screens/SettingsScreen";
import { SecurityCenterScreen } from "./src/screens/SecurityCenterScreen";
import { SalesOpportunitiesScreen } from "./src/screens/SalesOpportunitiesScreen";
import { StaffScreen } from "./src/screens/StaffScreen";
import { AppPreferencesProvider, useAppPreferences } from "./src/state/AppPreferences";
import { SalonStoreProvider } from "./src/state/SalonStore";
import { createDemoAuthSession, type AuthSession } from "./src/services/authGateway";
import { colors } from "./src/theme/colors";
import { typography } from "./src/theme/typography";
import type { SalonAccount, TabKey } from "./src/types";

type ActiveModal = "appointment" | "customer" | "payment" | null;
type UtilityModal = "search" | null;
type PaymentDraft = { customer: string; service: string; remaining: number } | null;

export default function App() {
  return (
    <AppPreferencesProvider>
      <SalonivaApp />
    </AppPreferencesProvider>
  );
}

function SalonivaApp() {
  const [activeTab, setActiveTab] = useState<TabKey>("panel");
  const [session, setSession] = useState<AuthSession | null>(null);
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [utilityModal, setUtilityModal] = useState<UtilityModal>(null);
  const [paymentDraft, setPaymentDraft] = useState<PaymentDraft>(null);
  const { width } = useWindowDimensions();
  const { isDarkMode } = useAppPreferences();
  const isWide = width >= 900;
  const account = session?.account ?? null;
  const isCloudSession = Boolean(session?.accessToken && session.accessToken !== "demo-access-token");

  const enterDemo = () => {
    setSession(createDemoAuthSession());
  };

  if (!account) {
    return (
      <SafeAreaView style={[styles.safe, isDarkMode ? styles.safeDark : null]}>
        <StatusBar style={isDarkMode ? "light" : "dark"} />
        <AuthScreen onDemoLogin={enterDemo} onCreateSalon={setSession} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, isDarkMode ? styles.safeDark : null]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <SalonStoreProvider session={session}>
        <View style={[styles.shell, isDarkMode ? styles.shellDark : null]}>
          {isWide ? <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} /> : null}
          <View style={[styles.content, isDarkMode ? styles.contentDark : null]}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
              <Header
                account={account}
                isCloudSession={isCloudSession}
                onLogout={() => setSession(null)}
                onNewAppointment={() => setActiveModal("appointment")}
                onNewCustomer={() => setActiveModal("customer")}
                onNewPayment={() => {
                  setPaymentDraft(null);
                  setActiveModal("payment");
                }}
                onSearch={() => setUtilityModal("search")}
              />
              {activeTab === "panel" ? <DashboardScreen isWide={isWide} /> : null}
              {activeTab === "calendar" ? <CalendarScreen /> : null}
              {activeTab === "customers" ? <CustomersScreen /> : null}
              {activeTab === "packages" ? (
                <PackagesScreen
                  onTakePayment={(payload) => {
                    setPaymentDraft(payload);
                    setActiveModal("payment");
                  }}
                />
              ) : null}
              {activeTab === "payments" ? <PaymentsScreen /> : null}
              {activeTab === "services" ? <ServicesScreen /> : null}
              {activeTab === "staff" ? <StaffScreen /> : null}
              {activeTab === "reports" ? <ReportsScreen /> : null}
              {activeTab === "settings" ? <SettingsScreen account={account} onNavigate={setActiveTab} /> : null}
              {activeTab === "booking" ? <BookingLinkScreen /> : null}
              {activeTab === "campaigns" ? <CampaignsScreen /> : null}
              {activeTab === "inventory" ? <InventoryScreen /> : null}
              {activeTab === "branches" ? <BranchesScreen /> : null}
              {activeTab === "clientApp" ? <ClientAppScreen /> : null}
              {activeTab === "quality" ? <QualityCenterScreen /> : null}
              {activeTab === "launch" ? <LaunchReadinessScreen /> : null}
              {activeTab === "billing" ? <BillingScreen /> : null}
              {activeTab === "showcase" ? <ServiceShowcaseScreen /> : null}
              {activeTab === "opportunities" ? <SalesOpportunitiesScreen /> : null}
              {activeTab === "onboarding" ? <OnboardingScreen account={account} /> : null}
              {activeTab === "agents" ? <AgentWorkflowScreen /> : null}
              {activeTab === "security" ? <SecurityCenterScreen account={account} /> : null}
              {activeTab === "production" ? <ProductionReadinessScreen /> : null}
              {activeTab === "pilot" ? <PilotSalesKitScreen /> : null}
              {activeTab === "more" ? <MoreScreen onNavigate={setActiveTab} /> : null}
            </ScrollView>
            {!isWide ? <BottomTabs activeTab={activeTab} setActiveTab={setActiveTab} /> : null}
            <ModalShell
              visible={activeModal === "appointment"}
              title="Yeni Randevu"
              onClose={() => setActiveModal(null)}
            >
              <NewAppointmentForm onDone={() => setActiveModal(null)} />
            </ModalShell>
            <ModalShell visible={activeModal === "customer"} title="Yeni Müşteri" onClose={() => setActiveModal(null)}>
              <NewCustomerForm onDone={() => setActiveModal(null)} />
            </ModalShell>
            <ModalShell visible={activeModal === "payment"} title="Ödeme Al" onClose={() => setActiveModal(null)}>
              <NewPaymentForm
                initialCustomer={paymentDraft?.customer}
                initialService={paymentDraft?.service}
                initialRemaining={paymentDraft?.remaining}
                onDone={() => {
                  setPaymentDraft(null);
                  setActiveModal(null);
                }}
              />
            </ModalShell>
            <ModalShell visible={utilityModal === "search"} title="Genel Arama" onClose={() => setUtilityModal(null)}>
              <GlobalSearch />
            </ModalShell>
            <ToastBanner />
          </View>
        </View>
      </SalonStoreProvider>
    </SafeAreaView>
  );
}

function Header({
  account,
  isCloudSession,
  onLogout,
  onNewAppointment,
  onNewCustomer,
  onNewPayment,
  onSearch
}: {
  account: SalonAccount;
  isCloudSession: boolean;
  onLogout: () => void;
  onNewAppointment: () => void;
  onNewCustomer: () => void;
  onNewPayment: () => void;
  onSearch: () => void;
}) {
  const { isDarkMode, t } = useAppPreferences();

  return (
    <View style={[styles.header, isDarkMode ? styles.headerDark : null]}>
      <View>
        <Text style={[styles.eyebrow, isDarkMode ? styles.eyebrowDark : null]}>{account.salonName}</Text>
        <Text style={[styles.title, isDarkMode ? styles.titleDark : null]}>{t("todayFlow")}</Text>
        <Text style={[styles.subtitle, isDarkMode ? styles.subtitleDark : null]}>
          9 Mayıs 2026 Cumartesi • {account.ownerName} • {account.role} • {isCloudSession ? "Bulut aktif" : "Demo local"}
        </Text>
      </View>
      <View style={styles.headerActions}>
        <ActionButton icon="search-outline" label={t("search")} onPress={onSearch} />
        <ActionButton icon="calendar-outline" label={t("newAppointment")} primary onPress={onNewAppointment} />
        <ActionButton icon="person-add-outline" label={t("addCustomer")} onPress={onNewCustomer} />
        <ActionButton icon="cash-outline" label={t("takePayment")} onPress={onNewPayment} />
        <ActionButton icon="log-out-outline" label={t("logout")} onPress={onLogout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background
  },
  safeDark: {
    backgroundColor: colors.ink
  },
  shell: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: colors.background
  },
  shellDark: {
    backgroundColor: colors.ink
  },
  content: {
    flex: 1,
    backgroundColor: colors.background
  },
  contentDark: {
    backgroundColor: "#2b2a20"
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 108
  },
  header: {
    gap: 16,
    marginBottom: 22,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    flexWrap: "wrap",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.softBorder,
    backgroundColor: colors.card,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 7 },
    elevation: 2
  },
  headerDark: {
    borderRadius: 7,
    borderWidth: 1,
    borderColor: colors.sage,
    backgroundColor: colors.ink,
    padding: 14
  },
  eyebrow: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  eyebrowDark: {
    color: colors.gold
  },
  title: {
    color: colors.text,
    fontSize: typography.title,
    fontWeight: "800",
    marginTop: 5
  },
  titleDark: {
    color: colors.white
  },
  subtitle: {
    color: colors.muted,
    fontSize: 15,
    marginTop: 4
  },
  subtitleDark: {
    color: "#efe4cf"
  },
  headerActions: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap"
  }
});
