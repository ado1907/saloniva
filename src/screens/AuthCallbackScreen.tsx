import { useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { ActionButton } from "../components/ActionButton";
import { BrandMark } from "../components/BrandMark";
import { colors } from "../theme/colors";
import { radius } from "../theme/spacing";

type CallbackMode = "password-recovery" | "email-verification" | "error";

type Props = {
  mode: CallbackMode;
  message?: string;
  isProcessing?: boolean;
  onSetPassword: (password: string) => Promise<void>;
  onContinueToLogin: () => void;
};

type PasswordCheck = {
  isValid: boolean;
  message: string;
};

export function AuthCallbackScreen({ mode, message, isProcessing, onSetPassword, onContinueToLogin }: Props) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<string | null>(message ?? null);
  const [isSuccess, setIsSuccess] = useState(false);

  const passwordCheck = useMemo(() => validatePassword(password, confirmPassword), [password, confirmPassword]);
  const isBusy = Boolean(isProcessing || isSubmitting);

  const submitPassword = async () => {
    if (isBusy) { return; }

    if (!passwordCheck.isValid) {
      setStatus(passwordCheck.message);
      return;
    }

    setIsSubmitting(true);
    setStatus("Yeni şifre güvenli şekilde kaydediliyor...");

    try {
      await onSetPassword(password);
      setIsSuccess(true);
      setStatus("Şifreniz başarıyla güncellendi. Güvenli şekilde devam edebilirsiniz.");
    } catch (error) {
      const fallback = "Şifre güncellenemedi. Bağlantının süresi dolmuş olabilir; lütfen yeni bir sıfırlama bağlantısı isteyin.";
      setStatus(error instanceof Error ? error.message : fallback);
    } finally {
      setIsSubmitting(false);
    }
  };

  const title =
    mode === "password-recovery"
      ? "Yeni şifrenizi belirleyin"
      : mode === "email-verification"
        ? "E-posta doğrulaması kontrol ediliyor"
        : "Auth bağlantısı tamamlanamadı";

  const description =
    mode === "password-recovery"
      ? "Hesabınız için güçlü bir şifre oluşturun. İşlem tamamlanınca Saloniva panelinize güvenli şekilde dönebilirsiniz."
      : mode === "email-verification"
        ? "Saloniva oturumunuzu hazırlıyor. Bu ekran uzun süre kalırsa giriş ekranına dönüp tekrar deneyin."
        : "Bağlantı eksik, süresi dolmuş veya Supabase oturumu alınamadı.";

  return (
    <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      <View style={styles.card}>
        <View style={styles.brandRow}>
          <BrandMark size="sm" />
          <View style={styles.brandTextBlock}>
            <Text style={styles.brandName}>Saloniva</Text>
            <Text style={styles.brandSub}>Güvenli hesap işlemi</Text>
          </View>
        </View>

        <View style={styles.headerBlock}>
          <Text style={styles.kicker}>AUTH CALLBACK</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>

        {isProcessing && mode === "email-verification" ? (
          <View style={styles.loadingPanel}>
            <ActivityIndicator color={colors.accent} />
            <Text style={styles.loadingText}>Oturum doğrulanıyor...</Text>
          </View>
        ) : null}

        {mode === "password-recovery" && !isSuccess ? (
          <View style={styles.form}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Yeni şifre"
              secureTextEntry
              autoCapitalize="none"
              style={styles.input}
            />
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Yeni şifre tekrar"
              secureTextEntry
              autoCapitalize="none"
              style={styles.input}
            />
            <Text style={[styles.passwordHint, passwordCheck.isValid ? styles.passwordHintOk : null]}>{passwordCheck.message}</Text>
            <ActionButton icon="lock-closed-outline" label={isBusy ? "Kaydediliyor" : "Şifreyi Güncelle"} primary onPress={isBusy ? undefined : submitPassword} />
          </View>
        ) : null}

        {status ? <Text style={[styles.status, isSuccess ? styles.statusSuccess : mode === "error" ? styles.statusError : null]}>{status}</Text> : null}

        {isSuccess || mode === "error" ? (
          <ActionButton icon="log-in-outline" label="Giriş ekranına dön" onPress={onContinueToLogin} />
        ) : null}

        {mode === "password-recovery" && !isSuccess ? (
          <Pressable disabled={isBusy} onPress={onContinueToLogin} style={styles.secondaryLink}>
            <Text style={styles.secondaryText}>Giriş ekranına dön</Text>
          </Pressable>
        ) : null}
      </View>
    </ScrollView>
  );
}

function validatePassword(password: string, confirmPassword: string): PasswordCheck {
  if (!password) {
    return { isValid: false, message: "En az 8 karakter, bir harf ve bir rakam içeren yeni şifre girin." };
  }

  if (password.length < 8) {
    return { isValid: false, message: "Şifre en az 8 karakter olmalı." };
  }

  if (!/[A-Za-zÇĞİÖŞÜçğıöşü]/.test(password) || !/[0-9]/.test(password)) {
    return { isValid: false, message: "Şifre en az bir harf ve bir rakam içermeli." };
  }

  if (password !== confirmPassword) {
    return { isValid: false, message: "Şifre tekrar alanı yeni şifre ile aynı olmalı." };
  }

  return { isValid: true, message: "Şifre güvenlik kontrolü uygun." };
}

const styles = StyleSheet.create({
  page: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: colors.background,
    padding: 18
  },
  card: {
    width: "100%",
    maxWidth: 540,
    alignSelf: "center",
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.softBorder,
    backgroundColor: colors.card,
    padding: 20,
    gap: 18,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 3
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  brandTextBlock: {
    flex: 1
  },
  brandName: {
    color: colors.text,
    fontSize: 19,
    fontWeight: "900"
  },
  brandSub: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 2
  },
  headerBlock: {
    gap: 8
  },
  kicker: {
    color: colors.champagne,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  title: {
    color: colors.text,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "900"
  },
  description: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22
  },
  loadingPanel: {
    minHeight: 96,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.sageSoft,
    backgroundColor: colors.accentSofter,
    alignItems: "center",
    justifyContent: "center",
    gap: 10
  },
  loadingText: {
    color: colors.accent,
    fontWeight: "900"
  },
  form: {
    gap: 10
  },
  input: {
    minHeight: 50,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    color: colors.text,
    paddingHorizontal: 14
  },
  passwordHint: {
    color: colors.mutedDark,
    fontWeight: "800",
    lineHeight: 20
  },
  passwordHintOk: {
    color: colors.accent
  },
  status: {
    borderRadius: radius.sm,
    backgroundColor: colors.champagneSoft,
    color: colors.mutedDark,
    fontWeight: "900",
    lineHeight: 20,
    padding: 12
  },
  statusSuccess: {
    backgroundColor: colors.accentSoft,
    color: colors.accent
  },
  statusError: {
    backgroundColor: colors.red,
    color: colors.danger
  },
  secondaryLink: {
    minHeight: 38,
    alignItems: "center",
    justifyContent: "center"
  },
  secondaryText: {
    color: colors.accent,
    fontWeight: "900"
  }
});
