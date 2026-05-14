import { useState } from "react";
import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from "react-native";
import { ActionButton } from "../components/ActionButton";
import { BrandMark } from "../components/BrandMark";
import { Pill } from "../components/Pill";
import { productConfig } from "../config/productConfig";
import { visualAssets } from "../config/visualAssets";
import { createRegisteredSalonSession, type AuthSession } from "../services/authGateway";
import { registerSalonWithSupabase, requestPasswordResetWithSupabase, signInWithSupabase } from "../services/supabaseAuthGateway";
import { supabaseConfig } from "../services/supabaseConfig";
import { colors } from "../theme/colors";
import { radius } from "../theme/spacing";
import type { UserRole } from "../types";

type Props = {
  onDemoLogin: () => void;
  onCreateSalon: (session: AuthSession) => void;
};

type AuthMode = "login" | "create";
type AuthView = "auth" | "marketing";

const roles: UserRole[] = ["Salon Sahibi", "Yönetici", "Personel"];

const demoSignals = [
  { label: "Bugünkü akış", value: "9 randevu", detail: "6 bekleyen seans" },
  { label: "Tahsilat", value: "10.350 TL", detail: "açık bakiye" },
  { label: "Satış fırsatı", value: "3 paket", detail: "yenileme adayı" }
];

const demoFlow = ["Karar paneli", "Randevu takvimi", "Müşteri hafızası", "Tahsilat ve paket"];

export function AuthScreen({ onDemoLogin, onCreateSalon }: Props) {
  const { width } = useWindowDimensions();
  const isNarrow = width < 900;
  const isCompact = width < 430;
  const [mode, setMode] = useState<AuthMode>("login");
  const [view, setView] = useState<AuthView>("marketing");
  const [salonName, setSalonName] = useState("Saloniva Güzellik");
  const [ownerName, setOwnerName] = useState("Demo Kullanıcı");
  const [email, setEmail] = useState("demo@saloniva.app");
  const [password, setPassword] = useState("demo1234");
  const [role, setRole] = useState<UserRole>("Salon Sahibi");
  const [authStatus, setAuthStatus] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const runAuthAction = async (action: () => Promise<AuthSession>, successMessage: string) => {
    setIsAuthLoading(true);
    setAuthStatus("Supabase ile güvenli bağlantı kuruluyor...");

    try {
      const session = await action();
      setAuthStatus(successMessage);
      onCreateSalon(session);
    } catch (error) {
      const message = error instanceof Error ? error.message : "İşlem tamamlanamadı.";
      setAuthStatus(formatAuthMessage(message));
    } finally {
      setIsAuthLoading(false);
    }
  };

  const loginWithCloud = () => {
    void runAuthAction(async () => signInWithSupabase(email, password), "Giriş başarılı.");
  };

  const requestPasswordReset = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setAuthStatus("Şifre sıfırlama bağlantısı için e-posta adresinizi girin.");
      return;
    }

    if (!supabaseConfig.configured) {
      setAuthStatus("Şifre sıfırlama canlı Supabase bağlantısı açıldığında e-posta ile gönderilir.");
      return;
    }

    setIsAuthLoading(true);
    setAuthStatus("Şifre sıfırlama bağlantısı hazırlanıyor...");

    try {
      await requestPasswordResetWithSupabase(trimmedEmail);
      setAuthStatus("Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Şifre sıfırlama bağlantısı gönderilemedi.";
      setAuthStatus(formatAuthMessage(message));
    } finally {
      setIsAuthLoading(false);
    }
  };

  const createSalon = () => {
    const fallbackPayload = {
      salonName,
      ownerName,
      email,
      password,
      role,
      planId: "starter" as const
    };

    if (!supabaseConfig.configured) {
      onCreateSalon(createRegisteredSalonSession(fallbackPayload));
      return;
    }

    void runAuthAction(async () => registerSalonWithSupabase(fallbackPayload), "Salon hesabı oluşturuldu.");
  };

  return (
    <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
      <View style={styles.shell}>
        <View style={styles.topNav}>
          <View style={styles.navBrandRow}>
            <BrandMark size="sm" />
            <View>
              <Text style={styles.navBrand}>Saloniva</Text>
              <Text style={styles.navSub}>Premium salon işletim sistemi</Text>
            </View>
          </View>
          <View style={styles.navActions}>
            <NavButton label="Demo" active={view === "marketing"} onPress={() => setView("marketing")} />
            <NavButton label="Giriş" active={view === "auth"} onPress={() => setView("auth")} />
          </View>
        </View>

        <View style={[styles.mainGrid, isNarrow ? styles.mainGridNarrow : null]}>
          <HeroPanel isCompact={isCompact} onDemoLogin={onDemoLogin} onStart={() => setView("auth")} />
          {view === "marketing" ? (
            <DemoPanel onDemoLogin={onDemoLogin} onStart={() => setView("auth")} />
          ) : (
            <AuthCard
              mode={mode}
              setMode={setMode}
              salonName={salonName}
              setSalonName={setSalonName}
              ownerName={ownerName}
              setOwnerName={setOwnerName}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              role={role}
              setRole={setRole}
              onDemoLogin={onDemoLogin}
              loginWithCloud={loginWithCloud}
              requestPasswordReset={requestPasswordReset}
              createSalon={createSalon}
              authStatus={authStatus}
              isAuthLoading={isAuthLoading}
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
}

function NavButton({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.navButton, active ? styles.navButtonActive : null]}>
      <Text style={[styles.navButtonText, active ? styles.navButtonTextActive : null]}>{label}</Text>
    </Pressable>
  );
}

function HeroPanel({ isCompact, onDemoLogin, onStart }: { isCompact: boolean; onDemoLogin: () => void; onStart: () => void }) {
  return (
    <ImageBackground source={{ uri: visualAssets.salonInterior }} resizeMode="cover" imageStyle={styles.heroImage} style={styles.heroPanel}>
      <View style={styles.heroShade}>
        <View style={styles.heroTopline}>
          <Text style={styles.heroKicker}>Saloniva OS</Text>
          <Text style={styles.heroBadge}>Web + iOS + Android</Text>
        </View>

        <View style={styles.heroContent}>
          <Text style={[styles.heroTitle, isCompact ? styles.heroTitleCompact : null]}>
            Salon sahibinin karar ekranı.
          </Text>
          <Text style={styles.heroCopy}>
            Randevu, müşteri hafızası, paket yenileme ve tahsilat riskini tek bakışta gösteren premium güzellik salonu paneli.
          </Text>
          <View style={styles.heroActions}>
            <ActionButton icon="play-circle-outline" label="Demo Hesabı Aç" primary onPress={onDemoLogin} />
            <ActionButton icon="business-outline" label="Salon Hesabı" onPress={onStart} />
          </View>
        </View>

        <View style={styles.signalRow}>
          {demoSignals.map((signal) => (
            <View key={signal.label} style={styles.signalBox}>
              <Text style={styles.signalLabel}>{signal.label}</Text>
              <Text style={styles.signalValue}>{signal.value}</Text>
              <Text style={styles.signalDetail}>{signal.detail}</Text>
            </View>
          ))}
        </View>
      </View>
    </ImageBackground>
  );
}

function DemoPanel({ onDemoLogin, onStart }: { onDemoLogin: () => void; onStart: () => void }) {
  return (
    <View style={styles.sidePanel}>
      <View style={styles.sideHeader}>
        <Text style={styles.sideKicker}>Canlı demo akışı</Text>
        <Text style={styles.sideTitle}>Boş ekran değil, dolu salon operasyonu.</Text>
        <Text style={styles.sideText}>
          Demo hesabında VIP müşteri, açık tahsilat, online talep, paket yenileme ve stok riski hazır gelir.
        </Text>
      </View>

      <View style={styles.flowList}>
        {demoFlow.map((item, index) => (
          <View key={item} style={styles.flowItem}>
            <Text style={styles.flowNumber}>{index + 1}</Text>
            <Text style={styles.flowText}>{item}</Text>
          </View>
        ))}
      </View>

      <View style={styles.readinessPanel}>
        <Text style={styles.readinessTitle}>Satış vaadi</Text>
        <Text style={styles.readinessText}>
          “Salonunuzda hangi müşteri ödeme bekliyor, hangi paket bitiyor, hangi randevu riske giriyor?” sorusunu tek ekranda cevaplar.
        </Text>
      </View>

      <View style={styles.sideActions}>
        <ActionButton icon="play-circle-outline" label="Demo İncele" primary onPress={onDemoLogin} />
        <ActionButton icon="arrow-forward-outline" label="Girişe Geç" onPress={onStart} />
      </View>
    </View>
  );
}

function AuthCard({
  mode,
  setMode,
  salonName,
  setSalonName,
  ownerName,
  setOwnerName,
  email,
  setEmail,
  password,
  setPassword,
  role,
  setRole,
  onDemoLogin,
  loginWithCloud,
  requestPasswordReset,
  authStatus,
  isAuthLoading,
  createSalon
}: {
  mode: AuthMode;
  setMode: (mode: AuthMode) => void;
  salonName: string;
  setSalonName: (value: string) => void;
  ownerName: string;
  setOwnerName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  onDemoLogin: () => void;
  loginWithCloud: () => void;
  requestPasswordReset: () => void;
  authStatus: string | null;
  isAuthLoading: boolean;
  createSalon: () => void;
}) {
  return (
    <View style={styles.sidePanel}>
      <View style={styles.modeSwitch}>
        <Pressable style={[styles.modeButton, mode === "login" ? styles.modeButtonActive : null]} onPress={() => setMode("login")}>
          <Text style={[styles.modeText, mode === "login" ? styles.modeTextActive : null]}>Giriş</Text>
        </Pressable>
        <Pressable style={[styles.modeButton, mode === "create" ? styles.modeButtonActive : null]} onPress={() => setMode("create")}>
          <Text style={[styles.modeText, mode === "create" ? styles.modeTextActive : null]}>Salon Oluştur</Text>
        </Pressable>
      </View>

      {mode === "login" ? (
        <View style={styles.form}>
          <Text style={styles.formTitle}>Salon hesabınıza giriş yapın</Text>
          <Text style={styles.formNote}>Bulut verileriniz ve salon paneliniz güvenli oturumla açılır.</Text>
          <TextInput value={email} onChangeText={setEmail} placeholder="E-posta" keyboardType="email-address" autoCapitalize="none" style={styles.input} />
          <TextInput value={password} onChangeText={setPassword} placeholder="Şifre" secureTextEntry style={styles.input} />
          <ActionButton icon="log-in-outline" label={isAuthLoading ? "Bağlanıyor" : "Giriş Yap"} primary onPress={loginWithCloud} />
          <View style={styles.authLinks}>
            <Pressable onPress={requestPasswordReset} style={styles.linkButton}>
              <Text style={styles.linkText}>Şifremi unuttum</Text>
            </Pressable>
            <Pressable onPress={onDemoLogin} style={styles.linkButton}>
              <Text style={styles.linkTextAccent}>Demo hesapla incele</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={styles.form}>
          <Text style={styles.formTitle}>Yeni salon hesabı oluşturun</Text>
          <Text style={styles.formNote}>İlk salon, rol ve deneme planı tek akışta hazırlanır.</Text>
          <TextInput value={salonName} onChangeText={setSalonName} placeholder="Salon adı" style={styles.input} />
          <TextInput value={ownerName} onChangeText={setOwnerName} placeholder="Yetkili adı" style={styles.input} />
          <TextInput value={email} onChangeText={setEmail} placeholder="E-posta" keyboardType="email-address" autoCapitalize="none" style={styles.input} />
          <TextInput value={password} onChangeText={setPassword} placeholder="Şifre" secureTextEntry style={styles.input} />
          <View style={styles.roleRow}>
            {roles.map((item) => (
              <Pill key={item} label={item} active={role === item} onPress={() => setRole(item)} />
            ))}
          </View>
          <ActionButton icon="business-outline" label={isAuthLoading ? "Oluşturuluyor" : "Salonu Oluştur"} primary onPress={createSalon} />
        </View>
      )}

      {authStatus ? <Text style={styles.statusText}>{authStatus}</Text> : null}

      <View style={styles.planStrip}>
        {productConfig.plans.slice(0, 3).map((plan) => (
          <View key={plan.id} style={styles.planMini}>
            <Text style={styles.planName}>{plan.name}</Text>
            <Text style={styles.planPrice}>{plan.price}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.legalText}>
        Devam ederek kullanım koşullarını, gizlilik politikasını ve hesap silme süreçlerini kabul etmiş olursunuz.
      </Text>
    </View>
  );
}

function formatAuthMessage(message: string) {
  if (message.toLowerCase().includes("invalid login credentials")) {
    return "E-posta veya şifre hatalı. Bilgileri kontrol edin ya da şifre sıfırlama bağlantısı isteyin.";
  }

  return message;
}

const styles = StyleSheet.create({
  page: {
    flexGrow: 1,
    backgroundColor: colors.background,
    padding: 16,
    justifyContent: "center"
  },
  shell: {
    width: "100%",
    maxWidth: 1180,
    alignSelf: "center",
    gap: 14
  },
  topNav: {
    borderRadius: radius.sm,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.softBorder,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12
  },
  navBrandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexShrink: 1
  },
  navBrand: {
    color: colors.text,
    fontWeight: "900",
    fontSize: 18
  },
  navSub: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700"
  },
  navActions: {
    flexDirection: "row",
    gap: 6
  },
  navButton: {
    minHeight: 36,
    borderRadius: radius.sm,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center"
  },
  navButtonActive: {
    backgroundColor: colors.accentSoft
  },
  navButtonText: {
    color: colors.mutedDark,
    fontWeight: "900"
  },
  navButtonTextActive: {
    color: colors.accent
  },
  mainGrid: {
    flexDirection: "row",
    gap: 14,
    alignItems: "stretch"
  },
  mainGridNarrow: {
    flexDirection: "column"
  },
  heroPanel: {
    flex: 1.45,
    minHeight: 620,
    overflow: "hidden",
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.softBorder,
    backgroundColor: colors.ink
  },
  heroImage: {
    borderRadius: radius.sm
  },
  heroShade: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
    backgroundColor: "rgba(13, 15, 12, 0.46)",
    gap: 22
  },
  heroTopline: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10
  },
  heroKicker: {
    color: colors.white,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1
  },
  heroBadge: {
    color: colors.white,
    fontWeight: "800",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.38)",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "rgba(255,255,255,0.12)"
  },
  heroContent: {
    maxWidth: 620,
    gap: 14
  },
  heroTitle: {
    color: colors.white,
    fontSize: 50,
    lineHeight: 58,
    fontWeight: "900"
  },
  heroTitleCompact: {
    fontSize: 34,
    lineHeight: 41
  },
  heroCopy: {
    color: "rgba(255,255,255,0.88)",
    fontSize: 17,
    lineHeight: 26,
    maxWidth: 560
  },
  heroActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 4
  },
  signalRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  signalBox: {
    flex: 1,
    minWidth: 145,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
    backgroundColor: "rgba(255,255,255,0.14)",
    padding: 13
  },
  signalLabel: {
    color: "rgba(255,255,255,0.74)",
    fontWeight: "800",
    fontSize: 12,
    textTransform: "uppercase"
  },
  signalValue: {
    color: colors.white,
    fontWeight: "900",
    fontSize: 22,
    marginTop: 6
  },
  signalDetail: {
    color: "rgba(255,255,255,0.78)",
    marginTop: 4,
    lineHeight: 18
  },
  sidePanel: {
    flex: 0.85,
    minWidth: 310,
    borderRadius: radius.sm,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.softBorder,
    padding: 18,
    gap: 16,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 2
  },
  sideHeader: {
    gap: 8
  },
  sideKicker: {
    color: colors.champagne,
    fontWeight: "900",
    textTransform: "uppercase",
    fontSize: 12
  },
  sideTitle: {
    color: colors.text,
    fontSize: 27,
    lineHeight: 34,
    fontWeight: "900"
  },
  sideText: {
    color: colors.muted,
    lineHeight: 22
  },
  flowList: {
    gap: 9
  },
  flowItem: {
    minHeight: 48,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.softBorder,
    padding: 11,
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  flowNumber: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.accent,
    color: colors.white,
    textAlign: "center",
    lineHeight: 26,
    fontWeight: "900"
  },
  flowText: {
    color: colors.text,
    fontWeight: "800",
    flex: 1
  },
  readinessPanel: {
    borderRadius: radius.sm,
    backgroundColor: colors.accentSofter,
    borderWidth: 1,
    borderColor: colors.sageSoft,
    padding: 14,
    gap: 7
  },
  readinessTitle: {
    color: colors.accent,
    fontWeight: "900"
  },
  readinessText: {
    color: colors.mutedDark,
    lineHeight: 21
  },
  sideActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9
  },
  modeSwitch: {
    minHeight: 44,
    borderRadius: radius.sm,
    backgroundColor: colors.mutedSurface,
    padding: 4,
    flexDirection: "row",
    gap: 4
  },
  modeButton: {
    flex: 1,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10
  },
  modeButtonActive: {
    backgroundColor: colors.card
  },
  modeText: {
    color: colors.mutedDark,
    fontWeight: "900"
  },
  modeTextActive: {
    color: colors.accent
  },
  form: {
    gap: 10
  },
  formTitle: {
    color: colors.text,
    fontSize: 24,
    lineHeight: 31,
    fontWeight: "900"
  },
  formNote: {
    color: colors.muted,
    lineHeight: 20,
    marginBottom: 2
  },
  input: {
    minHeight: 48,
    minWidth: 0,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    paddingHorizontal: 13,
    color: colors.text
  },
  authLinks: {
    gap: 4
  },
  linkButton: {
    minHeight: 36,
    alignItems: "center",
    justifyContent: "center"
  },
  linkText: {
    color: colors.mutedDark,
    fontWeight: "900"
  },
  linkTextAccent: {
    color: colors.accent,
    fontWeight: "900"
  },
  roleRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  statusText: {
    borderRadius: radius.sm,
    backgroundColor: colors.accentSoft,
    color: colors.accent,
    fontWeight: "900",
    lineHeight: 20,
    padding: 12
  },
  planStrip: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  planMini: {
    flex: 1,
    minWidth: 95,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.softBorder,
    padding: 10
  },
  planName: {
    color: colors.mutedDark,
    fontWeight: "900",
    fontSize: 12
  },
  planPrice: {
    color: colors.text,
    fontWeight: "900",
    marginTop: 4
  },
  legalText: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18
  }
});
