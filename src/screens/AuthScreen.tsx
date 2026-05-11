import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { ActionButton } from "../components/ActionButton";
import { AnimatedText } from "../components/AnimatedText";
import { BrandMark } from "../components/BrandMark";
import { LuxuryProductScene } from "../components/LuxuryVisual";
import { Pill } from "../components/Pill";
import { productConfig } from "../config/productConfig";
import { colors } from "../theme/colors";
import { radius } from "../theme/spacing";
import type { SalonAccount, UserRole } from "../types";

type Props = {
  onDemoLogin: () => void;
  onCreateSalon: (account: SalonAccount) => void;
};

type AuthMode = "login" | "create";
type AuthView = "auth" | "marketing";

const roles: UserRole[] = ["Salon Sahibi", "Yönetici", "Personel"];

export function AuthScreen({ onDemoLogin, onCreateSalon }: Props) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [view, setView] = useState<AuthView>("marketing");
  const [salonName, setSalonName] = useState("Saloniva Güzellik");
  const [ownerName, setOwnerName] = useState("Demo Kullanıcı");
  const [email, setEmail] = useState("demo@saloniva.app");
  const [password, setPassword] = useState("demo1234");
  const [role, setRole] = useState<UserRole>("Salon Sahibi");

  const createSalon = () => {
    onCreateSalon({
      salonId: `salon-${Date.now()}`,
      salonName: salonName.trim() || "Yeni Salon",
      ownerName: ownerName.trim() || "Salon Yetkilisi",
      email: email.trim() || "demo@saloniva.app",
      role,
      planId: "starter",
      subscriptionStatus: "Deneme",
      trialEndsAt: "14 gün sonra",
      permissions: [...productConfig.demoAccount.permissions]
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
      <View style={styles.topNav}>
        <View style={styles.navBrandRow}>
          <BrandMark size="sm" />
          <Text style={styles.navBrand}>Saloniva</Text>
        </View>
        <View style={styles.navActions}>
          <Pressable onPress={() => setView("marketing")} style={[styles.navButton, view === "marketing" ? styles.navButtonActive : null]}>
            <Text style={[styles.navButtonText, view === "marketing" ? styles.navButtonTextActive : null]}>Tanıtım</Text>
          </Pressable>
          <Pressable onPress={() => setView("auth")} style={[styles.navButton, view === "auth" ? styles.navButtonActive : null]}>
            <Text style={[styles.navButtonText, view === "auth" ? styles.navButtonTextActive : null]}>Giriş</Text>
          </Pressable>
        </View>
      </View>

      {view === "marketing" ? (
        <MarketingView onDemoLogin={onDemoLogin} onStart={() => setView("auth")} />
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
          createSalon={createSalon}
        />
      )}
    </ScrollView>
  );
}

function MarketingView({ onDemoLogin, onStart }: { onDemoLogin: () => void; onStart: () => void }) {
  return (
    <>
      <View style={styles.hero}>
        <View style={styles.heroCopy}>
          <BrandMark size="lg" />
          <AnimatedText style={styles.brand}>Saloniva</AnimatedText>
          <AnimatedText delay={110} style={styles.headline}>Salonunuzu web, Android ve iOS üzerinden tek hesapla yönetin.</AnimatedText>
          <Text style={styles.subline}>
            Randevu, müşteri, paket, seans ve ödeme takibini sade bir profesyonel panelde toplayın.
          </Text>
          <View style={styles.heroActions}>
            <ActionButton icon="play-circle-outline" label="Demo İncele" primary onPress={onDemoLogin} />
            <ActionButton icon="business-outline" label="Salon Hesabı Aç" onPress={onStart} />
          </View>
          <View style={styles.featureGrid}>
            <Feature title="Randevu Takvimi" text="Günlük akışı ve personel yoğunluğunu takip edin." />
            <Feature title="Müşteri Hafızası" text="Geçmiş işlemler, notlar ve aktif paketler." />
            <Feature title="Seans ve Ödeme" text="Kalan seansları ve açık borçları görün." />
          </View>
        </View>
        <View style={styles.heroVisual}>
          <LuxuryProductScene />
        </View>
      </View>

      <View style={styles.pricingGrid}>
        <Plan title="Başlangıç" price="399 TL/ay" text="Tek kullanıcı, randevu ve müşteri takibi." />
        <Plan title="Profesyonel" price="799 TL/ay" text="Paket, ödeme, personel ve rapor modülleri." featured />
        <Plan title="Premium" price="1.299 TL/ay" text="Öncelikli destek, gelişmiş rapor ve çok şube hazırlığı." />
      </View>
    </>
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
  createSalon: () => void;
}) {
  return (
      <View style={styles.card}>
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
            <TextInput value={email} onChangeText={setEmail} placeholder="E-posta" keyboardType="email-address" autoCapitalize="none" style={styles.input} />
            <TextInput value={password} onChangeText={setPassword} placeholder="Şifre" secureTextEntry style={styles.input} />
            <ActionButton icon="log-in-outline" label="Giriş Yap" primary onPress={onDemoLogin} />
            <Pressable onPress={onDemoLogin} style={styles.demoButton}>
              <Text style={styles.demoText}>Demo hesapla incele</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.form}>
            <Text style={styles.formTitle}>Yeni salon hesabı oluşturun</Text>
            <TextInput value={salonName} onChangeText={setSalonName} placeholder="Salon adı" style={styles.input} />
            <TextInput value={ownerName} onChangeText={setOwnerName} placeholder="Yetkili adı" style={styles.input} />
            <TextInput value={email} onChangeText={setEmail} placeholder="E-posta" keyboardType="email-address" autoCapitalize="none" style={styles.input} />
            <TextInput value={password} onChangeText={setPassword} placeholder="Şifre" secureTextEntry style={styles.input} />
            <View style={styles.roleRow}>
              {roles.map((item) => (
                <Pill key={item} label={item} active={role === item} onPress={() => setRole(item)} />
              ))}
            </View>
            <ActionButton icon="business-outline" label="Salonu Oluştur" primary onPress={createSalon} />
          </View>
        )}

        <Text style={styles.legalText}>
          Devam ederek kullanım koşullarını, gizlilik politikasını ve hesap silme süreçlerini kabul etmiş olursunuz.
        </Text>
      </View>
  );
}

function Feature({ title, text }: { title: string; text: string }) {
  return (
    <View style={styles.feature}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

function Plan({ title, price, text, featured }: { title: string; price: string; text: string; featured?: boolean }) {
  return (
    <View style={[styles.plan, featured ? styles.planFeatured : null]}>
      <Text style={styles.planTitle}>{title}</Text>
      <Text style={styles.planPrice}>{price}</Text>
      <Text style={styles.planText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flexGrow: 1,
    backgroundColor: colors.background,
    padding: 18,
    gap: 18,
    justifyContent: "center"
  },
  topNav: {
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12
  },
  navBrand: {
    color: colors.text,
    fontWeight: "800",
    fontSize: 18
  },
  navBrandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  navActions: {
    flexDirection: "row",
    gap: 6
  },
  navButton: {
    minHeight: 34,
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center"
  },
  navButtonActive: {
    backgroundColor: colors.accentSoft
  },
  navButtonText: {
    color: colors.mutedDark,
    fontWeight: "800"
  },
  navButtonTextActive: {
    color: colors.accent
  },
  hero: {
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    gap: 18,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "stretch"
  },
  heroCopy: {
    flex: 1.15,
    minWidth: 280,
    gap: 12
  },
  heroVisual: {
    flex: 0.85,
    minWidth: 260
  },
  brand: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  headline: {
    color: colors.text,
    fontSize: 30,
    fontWeight: "800",
    lineHeight: 37
  },
  subline: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24
  },
  heroActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  featureGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 4
  },
  feature: {
    flex: 1,
    minWidth: 170,
    borderRadius: radius.sm,
    backgroundColor: colors.mutedSurface,
    padding: 12
  },
  featureTitle: {
    color: colors.text,
    fontWeight: "800"
  },
  featureText: {
    color: colors.muted,
    marginTop: 5,
    lineHeight: 19
  },
  pricingGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12
  },
  plan: {
    flex: 1,
    minWidth: 190,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 16,
    gap: 7
  },
  planFeatured: {
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft
  },
  planTitle: {
    color: colors.text,
    fontWeight: "800",
    fontSize: 17
  },
  planPrice: {
    color: colors.accent,
    fontWeight: "800",
    fontSize: 22
  },
  planText: {
    color: colors.muted,
    lineHeight: 20
  },
  card: {
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 16
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
    fontWeight: "800"
  },
  modeTextActive: {
    color: colors.accent
  },
  form: {
    gap: 10
  },
  formTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 4
  },
  input: {
    minHeight: 46,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    paddingHorizontal: 13,
    color: colors.text
  },
  demoButton: {
    minHeight: 40,
    alignItems: "center",
    justifyContent: "center"
  },
  demoText: {
    color: colors.accent,
    fontWeight: "800"
  },
  roleRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  legalText: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18
  }
});
