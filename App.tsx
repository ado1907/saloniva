import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
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
import { AuthCallbackScreen } from "./src/screens/AuthCallbackScreen";
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
import { clearAuthSession, loadAuthSession, saveAuthSession } from "./src/state/storage";
import { createDemoAuthSession, type AuthSession } from "./src/services/authGateway";
import { buildSupabaseSessionFromTokens, refreshSupabaseSession, updateSupabasePassword } from "./src/services/supabaseAuthGateway";
import { supabaseConfig } from "./src/services/supabaseConfig";
import { colors } from "./src/theme/colors";
import type { SalonAccount, TabKey } from "./src/types";

type ActiveModal = "appointment" | "customer" | "payment" | null;
type UtilityModal = "search" | null;
type PaymentDraft = { customer: string; service: string; remaining: number } | null;

const SESSION_REFRESH_SAFETY_MS = 1000 * 60 * 5;
type AuthCallbackState =
  | {
      mode: "password-recovery";
      accessToken: string;
      refreshToken?: string;
      expiresAt?: number;
    }
  | {
      mode: "email-verification";
      accessToken: string;
      refreshToken: string;
      expiresAt?: number;
    }
  | {
      mode: "error";
      message: string;
    };

type BrowserLocationLike = {
  pathname?: string;
  search?: string;
  hash?: string;
};

type BrowserHistoryLike = {
  replaceState?: (data: unknown, unused: string, url?: string) => void;
};

function readAuthCallbackFromLocation(): AuthCallbackState | null {
  const browser = globalThis as typeof globalThis & { location?: BrowserLocationLike };
  const location = browser.location;

  if (!location) {
    return null;
  }

  const pathname = location.pathname ?? "";
  const rawSearch = location.search?.replace(/^\?/, "") ?? "";
  const rawHash = location.hash?.replace(/^#/, "") ?? "";
  const params = new URLSearchParams([rawSearch, rawHash].filter(Boolean).join("&"));
  const isCallback = pathname.includes("/auth/callback") || params.has("access_token") || params.has("error") || params.has("error_description");

  if (!isCallback) {
    return null;
  }

  const errorMessage = params.get("error_description") ?? params.get("error");

  if (errorMessage) {
    return { mode: "error", message: decodeURIComponent(errorMessage) };
  }

  const accessToken = params.get("access_token") ?? undefined;
  const refreshToken = params.get("refresh_token") ?? undefined;
  const callbackType = params.get("type") ?? "";
  const expiresIn = Number(params.get("expires_in") ?? "");
  const expiresAt = Number.isFinite(expiresIn) && expiresIn > 0 ? Date.now() + expiresIn * 1000 : undefined;

  if (callbackType === "recovery" && accessToken) {
    return { mode: "password-recovery", accessToken, refreshToken, expiresAt };
  }

  if (accessToken && refreshToken) {
    return { mode: "email-verification", accessToken, refreshToken, expiresAt };
  }

  return {
    mode: "error",
    message: "Doğrulama bağlantısı eksik veya süresi dolmuş. Lütfen yeni bağlantı isteyin."
  };
}

function clearAuthCallbackUrl() {
  const browser = globalThis as typeof globalThis & { history?: BrowserHistoryLike };
  browser.history?.replaceState?.(null, "", "/");
}

export default function App() {
  return (
    <AppPreferencesProvider>
      <SalonivaApp />
    </AppPreferencesProvider>
  );
}

function SalonivaApp() {
  const [activeTab, setActiveTab] = useState<TabKey>("panel");
  const [session, setSessionState] = useState<AuthSession | null>(null);
  const [authCallback, setAuthCallback] = useState<AuthCallbackState | null>(() => readAuthCallbackFromLocation());
  const [isAuthCallbackProcessing, setIsAuthCallbackProcessing] = useState(false);
  const [isRestoringSession, setIsRestoringSession] = useState(true);
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [utilityModal, setUtilityModal] = useState<UtilityModal>(null);
  const [paymentDraft, setPaymentDraft] = useState<PaymentDraft>(null);
  const { width } = useWindowDimensions();
  const { isDarkMode } = useAppPreferences();
  const isWide = width >= 900;
  const account = session?.account ?? null;
  const isCloudSession = Boolean(session?.accessToken && session.accessToken !== "demo-access-token");
  const navigateToTab = (nextTab: TabKey) => {
    if (account && !canAccessTab(account, nextTab)) {
      setActiveTab("panel");
      return;
    }

    setActiveTab(nextTab);
  };

  const persistSession = (nextSession: AuthSession | null) => {
    setSessionState(nextSession);

    if (nextSession) {
      void saveAuthSession(nextSession);
      return;
    }

    void clearAuthSession();
  };

  const clearAuthenticatedState = () => {
    setActiveTab("panel");
    setActiveModal(null);
    setUtilityModal(null);
    setPaymentDraft(null);
    persistSession(null);
  };

  const handleAuthExpired = () => {
    clearAuthenticatedState();
  };
  const returnToLoginFromCallback = () => {
    clearAuthCallbackUrl();
    setAuthCallback(null);
    clearAuthenticatedState();
  };

  const handlePasswordResetCallback = async (newPassword: string) => {
    if (!authCallback || authCallback.mode !== "password-recovery") {
      throw new Error("Şifre sıfırlama bağlantısı bulunamadı. Lütfen yeni bağlantı isteyin.");
    }

    await updateSupabasePassword(authCallback.accessToken, newPassword);
    clearAuthCallbackUrl();
  };

  useEffect(() => {
    if (!authCallback || authCallback.mode !== "email-verification") {
      return;
    }

    let isMounted = true;
    setIsAuthCallbackProcessing(true);

    void buildSupabaseSessionFromTokens(authCallback.accessToken, authCallback.refreshToken, authCallback.expiresAt)
      .then((nextSession) => {
        if (!isMounted) {
          return;
        }

        persistSession(nextSession);
        setAuthCallback(null);
        clearAuthCallbackUrl();
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }

        setAuthCallback({
          mode: "error",
          message: "E-posta doğrulandı ancak Saloniva salon oturumu alınamadı. Lütfen giriş ekranından tekrar deneyin veya destek alın."
        });
      })
      .finally(() => {
        if (isMounted) {
          setIsAuthCallbackProcessing(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [authCallback]);

  useEffect(() => {
    if (authCallback) {
      setIsRestoringSession(false);
      return;
    }

    let isMounted = true;

    const restoreSession = async () => {
      try {
        const storedSession = await loadAuthSession();

        if (!storedSession) {
          return;
        }

        const isStoredDemo = storedSession.accessToken === "demo-access-token";

        if (supabaseConfig.backendMode === "supabase" && isStoredDemo) {
          await clearAuthSession();
          return;
        }

        if (supabaseConfig.backendMode === "supabase" && storedSession.refreshToken) {
          const refreshedSession = await refreshSupabaseSession(storedSession.refreshToken);

          if (isMounted) {
            setSessionState(refreshedSession);
            void saveAuthSession(refreshedSession);
          }

          return;
        }

        if (isMounted) {
          setSessionState(storedSession);
        }
      } catch {
        await clearAuthSession();
      } finally {
        if (isMounted) {
          setIsRestoringSession(false);
        }
      }
    };

    void restoreSession();

    return () => {
      isMounted = false;
    };
  }, [authCallback]);

  useEffect(() => {
    if (authCallback || !session || !isCloudSession || !session.refreshToken) {
      return;
    }

    const expiresAt = session.expiresAt ?? Date.now() + 1000 * 60 * 60;
    const refreshDelay = Math.max(5000, expiresAt - Date.now() - SESSION_REFRESH_SAFETY_MS);
    const refreshTimer = setTimeout(() => {
      void refreshSupabaseSession(session.refreshToken)
        .then((nextSession) => persistSession(nextSession))
        .catch(() => handleAuthExpired());
    }, refreshDelay);

    return () => clearTimeout(refreshTimer);
  }, [authCallback, isCloudSession, session]);
  useEffect(() => {
    if (account && !canAccessTab(account, activeTab)) {
      setActiveTab("panel");
    }
  }, [account, activeTab]);

  const enterDemo = () => {
    if (supabaseConfig.backendMode !== "demo-local") {
      return;
    }

    persistSession(createDemoAuthSession());
  };

  if (authCallback) {
    return (
      <SafeAreaView style={[styles.safe, isDarkMode ? styles.safeDark : null]}>
        <StatusBar style={isDarkMode ? "light" : "dark"} />
        <AuthCallbackScreen
          mode={authCallback.mode}
          message={authCallback.mode === "error" ? authCallback.message : undefined}
          isProcessing={isAuthCallbackProcessing}
          onSetPassword={handlePasswordResetCallback}
          onContinueToLogin={returnToLoginFromCallback}
        />
      </SafeAreaView>
    );
  }

  if (isRestoringSession) {
    return (
      <SafeAreaView style={[styles.safe, isDarkMode ? styles.safeDark : null]}>
        <StatusBar style={isDarkMode ? "light" : "dark"} />
        <View style={styles.loadingScreen}>
          <ActivityIndicator color={colors.accent} />
          <Text style={[styles.loadingText, isDarkMode ? styles.loadingTextDark : null]}>Güvenli oturum kontrol ediliyor...</Text>
        </View>
      </SafeAreaView>
    );
  }
  if (!account) {
    return (
      <SafeAreaView style={[styles.safe, isDarkMode ? styles.safeDark : null]}>
        <StatusBar style={isDarkMode ? "light" : "dark"} />
        <AuthScreen onDemoLogin={enterDemo} onCreateSalon={persistSession} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, isDarkMode ? styles.safeDark : null]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <SalonStoreProvider session={session} onAuthExpired={handleAuthExpired}>
        <View style={[styles.shell, isDarkMode ? styles.shellDark : null]}>
          {isWide ? <Sidebar activeTab={activeTab} setActiveTab={navigateToTab} /> : null}
          <View style={[styles.content, isDarkMode ? styles.contentDark : null]}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
              <Header
                account={account}
                isCloudSession={isCloudSession}
                onLogout={clearAuthenticatedState}
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
              {activeTab === "settings" ? <SettingsScreen account={account} isCloudSession={isCloudSession} onNavigate={navigateToTab} /> : null}
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
              {activeTab === "more" ? <MoreScreen onNavigate={navigateToTab} /> : null}
            </ScrollView>
            {!isWide ? <BottomTabs activeTab={activeTab} setActiveTab={navigateToTab} /> : null}
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

function canAccessTab(account: SalonAccount, tab: TabKey) {
  if (account.role === "Salon Sahibi") {
    return true;
  }

  if (account.role === "Yönetici") {
    return !["agents", "security", "production", "pilot"].includes(tab);
  }

  return ["panel", "calendar", "customers", "packages", "payments", "services", "booking", "more"].includes(tab);
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
      <View style={styles.headerTitleBlock}>
        <View style={[styles.eyebrowPill, isDarkMode ? styles.eyebrowPillDark : null]}>
          <Text style={[styles.eyebrow, isDarkMode ? styles.eyebrowDark : null]}>{account.salonName}</Text>
        </View>
        <Text style={[styles.title, isDarkMode ? styles.titleDark : null]}>{t("todayFlow")}</Text>
        <View style={styles.metaRow}>
          <Text style={[styles.subtitle, isDarkMode ? styles.subtitleDark : null]}>
            9 Mayıs 2026 Cumartesi • {account.ownerName} • {account.role}
          </Text>
          <View style={[styles.statusChip, isCloudSession ? styles.statusChipCloud : styles.statusChipDemo]}>
            <Text style={styles.statusChipText}>{isCloudSession ? "Bulut aktif" : "Yerel oturum"}</Text>
          </View>
        </View>
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
  loadingScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12
  },
  loadingText: {
    color: colors.mutedDark,
    fontWeight: "800"
  },
  loadingTextDark: {
    color: colors.white
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
    backgroundColor: "#10140f"
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 132
  },
  header: {
    gap: 20,
    marginBottom: 26,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    flexWrap: "wrap",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.softBorder,
    backgroundColor: colors.card,
    paddingVertical: 22,
    paddingHorizontal: 22,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 14 },
    elevation: 5
  },
  headerDark: {
    borderColor: "rgba(244, 231, 206, 0.18)",
    backgroundColor: colors.ink,
    shadowColor: "#000000",
    shadowOpacity: 0.30,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 14 },
    elevation: 7
  },
  headerTitleBlock: {
    flexShrink: 1,
    maxWidth: 720
  },
  eyebrowPill: {
    alignSelf: "flex-start",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.sageSoft,
    backgroundColor: colors.accentSofter,
    paddingHorizontal: 12,
    paddingVertical: 7
  },
  eyebrowPillDark: {
    borderColor: "rgba(244, 231, 206, 0.24)",
    backgroundColor: "rgba(244, 231, 206, 0.10)"
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
    fontSize: 32,
    lineHeight: 39,
    fontWeight: "900",
    marginTop: 12
  },
  titleDark: {
    color: colors.white
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 8
  },
  subtitle: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 23
  },
  subtitleDark: {
    color: "#efe4cf"
  },
  statusChip: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  statusChipCloud: {
    backgroundColor: colors.accentSoft
  },
  statusChipDemo: {
    backgroundColor: colors.champagneSoft
  },
  statusChipText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: "900"
  },
  headerActions: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
    justifyContent: "flex-end",
    maxWidth: 620
  }
});
