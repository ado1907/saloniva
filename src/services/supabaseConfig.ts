export type SupabaseRuntimeConfig = {
  url: string;
  anonKey: string;
  backendMode: "demo-local" | "supabase";
  demoSalonId: string;
  authRedirectUrl: string;
  configured: boolean;
};

type ExpoEnv = {
  EXPO_PUBLIC_SUPABASE_URL?: string;
  EXPO_PUBLIC_SUPABASE_ANON_KEY?: string;
  EXPO_PUBLIC_BACKEND_MODE?: string;
  EXPO_PUBLIC_DEMO_SALON_ID?: string;
  EXPO_PUBLIC_AUTH_REDIRECT_URL?: string;
};

function readExpoEnv(): ExpoEnv {
  const maybeProcess = globalThis as typeof globalThis & {
    process?: { env?: ExpoEnv };
  };

  return maybeProcess.process?.env ?? {};
}

const env = readExpoEnv();

export const supabaseConfig: SupabaseRuntimeConfig = {
  url: env.EXPO_PUBLIC_SUPABASE_URL ?? "",
  anonKey: env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "",
  backendMode: env.EXPO_PUBLIC_BACKEND_MODE === "supabase" ? "supabase" : "demo-local",
  demoSalonId: env.EXPO_PUBLIC_DEMO_SALON_ID ?? "demo-saloniva",
  authRedirectUrl: env.EXPO_PUBLIC_AUTH_REDIRECT_URL ?? "https://saloniva.app/auth/callback",
  configured: Boolean(env.EXPO_PUBLIC_SUPABASE_URL && env.EXPO_PUBLIC_SUPABASE_ANON_KEY)
};

export const supabaseSetupChecklist = [
  "Supabase projesi oluştur.",
  "SQL Editor içinde supabase/schema.sql dosyasını çalıştır.",
  "Authentication > Providers bölümünde Email girişini aç.",
  ".env dosyasına EXPO_PUBLIC_SUPABASE_URL ve EXPO_PUBLIC_SUPABASE_ANON_KEY değerlerini ekle.",
  "Canlı veriye geçmeden önce RLS politikalarını Supabase Table Editor içinde kontrol et.",
  "Demo-local modunu kapatmak için EXPO_PUBLIC_BACKEND_MODE=supabase yap."
];
