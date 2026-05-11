import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { useColorScheme } from "react-native";

export type AppLanguage = "tr" | "en" | "ar";
export type AppThemeMode = "light" | "dark" | "system";

type AppPreferences = {
  language: AppLanguage;
  themeMode: AppThemeMode;
  isDarkMode: boolean;
  setLanguage: (language: AppLanguage) => void;
  setThemeMode: (themeMode: AppThemeMode) => void;
  t: (key: keyof typeof translations.tr) => string;
};

const STORAGE_KEY = "saloniva.preferences.v1";

const translations = {
  tr: {
    todayFlow: "Bugünkü salon akışı",
    search: "Ara",
    newAppointment: "Yeni Randevu",
    addCustomer: "Müşteri Ekle",
    takePayment: "Ödeme Al",
    logout: "Çıkış",
    settingsTitle: "Ayarlar",
    settingsDescription: "Salon bilgileri, çalışma düzeni, destek, gizlilik ve hesap yönetimini düzenleyin.",
    save: "Kaydet",
    languageAndTheme: "Dil ve Görünüm",
    appLanguage: "Uygulama Dili",
    appLanguageSubtitle: "Panel metinleri ve müşteri deneyimi için tercih edilen dil.",
    themeMode: "Görünüm Modu",
    themeModeSubtitle: "Açık, koyu veya cihaz ayarına göre otomatik görünüm.",
    light: "Açık",
    dark: "Koyu",
    system: "Sistem",
    active: "Aktif",
    ready: "Hazır"
  },
  en: {
    todayFlow: "Today’s salon flow",
    search: "Search",
    newAppointment: "New Appointment",
    addCustomer: "Add Customer",
    takePayment: "Take Payment",
    logout: "Logout",
    settingsTitle: "Settings",
    settingsDescription: "Manage salon profile, working hours, support, privacy, and account settings.",
    save: "Save",
    languageAndTheme: "Language and Appearance",
    appLanguage: "App Language",
    appLanguageSubtitle: "Preferred language for dashboard labels and customer experience.",
    themeMode: "Theme Mode",
    themeModeSubtitle: "Light, dark, or automatic based on device settings.",
    light: "Light",
    dark: "Dark",
    system: "System",
    active: "Active",
    ready: "Ready"
  },
  ar: {
    todayFlow: "تدفق الصالون اليوم",
    search: "بحث",
    newAppointment: "موعد جديد",
    addCustomer: "إضافة عميل",
    takePayment: "استلام دفعة",
    logout: "خروج",
    settingsTitle: "الإعدادات",
    settingsDescription: "إدارة بيانات الصالون وساعات العمل والدعم والخصوصية والحساب.",
    save: "حفظ",
    languageAndTheme: "اللغة والمظهر",
    appLanguage: "لغة التطبيق",
    appLanguageSubtitle: "اللغة المفضلة لواجهة الإدارة وتجربة العميل.",
    themeMode: "وضع المظهر",
    themeModeSubtitle: "فاتح أو داكن أو تلقائي حسب إعداد الجهاز.",
    light: "فاتح",
    dark: "داكن",
    system: "النظام",
    active: "نشط",
    ready: "جاهز"
  }
};

const PreferencesContext = createContext<AppPreferences | null>(null);

export function AppPreferencesProvider({ children }: { children: ReactNode }) {
  const colorScheme = useColorScheme();
  const [language, setLanguageState] = useState<AppLanguage>("tr");
  const [themeMode, setThemeModeState] = useState<AppThemeMode>("light");

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!raw) {
          return;
        }

        const parsed = JSON.parse(raw) as Partial<Pick<AppPreferences, "language" | "themeMode">>;
        if (parsed.language === "tr" || parsed.language === "en" || parsed.language === "ar") {
          setLanguageState(parsed.language);
        }
        if (parsed.themeMode === "light" || parsed.themeMode === "dark" || parsed.themeMode === "system") {
          setThemeModeState(parsed.themeMode);
        }
      })
      .catch(() => undefined);
  }, []);

  const isDarkMode = themeMode === "dark" || (themeMode === "system" && colorScheme === "dark");

  const value = useMemo<AppPreferences>(() => {
    const persist = (nextLanguage: AppLanguage, nextThemeMode: AppThemeMode) => {
      void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ language: nextLanguage, themeMode: nextThemeMode }));
    };

    return {
      language,
      themeMode,
      isDarkMode,
      setLanguage: (nextLanguage) => {
        setLanguageState(nextLanguage);
        persist(nextLanguage, themeMode);
      },
      setThemeMode: (nextThemeMode) => {
        setThemeModeState(nextThemeMode);
        persist(language, nextThemeMode);
      },
      t: (key) => translations[language][key]
    };
  }, [isDarkMode, language, themeMode]);

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function useAppPreferences() {
  const context = useContext(PreferencesContext);

  if (!context) {
    throw new Error("useAppPreferences must be used inside AppPreferencesProvider");
  }

  return context;
}
