import { productConfig } from "../config/productConfig";
import type { SalonAccount, SubscriptionPlanId, UserRole } from "../types";

export type AuthProvider = "demo-local" | "supabase-ready" | "firebase-ready" | "custom-api-ready";

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterSalonPayload = {
  salonName: string;
  ownerName: string;
  email: string;
  password: string;
  role: UserRole;
  planId: SubscriptionPlanId;
};

export type AuthSession = {
  accessToken: string;
  refreshToken: string;
  account: SalonAccount;
};

export const authGatewayPlan = [
  {
    title: "Demo giriş",
    description: "Mevcut demo hesap satış sunumunda çalışır; gerçek veri taşımaz.",
    status: "Hazır"
  },
  {
    title: "Gerçek kullanıcı girişi",
    description: "E-posta/şifre, şifre sıfırlama ve oturum yenileme backend sağlayıcısına bağlanmalı.",
    status: "Sırada"
  },
  {
    title: "Salon hesabı oluşturma",
    description: "Kayıtta salon tenant, sahip kullanıcı ve deneme aboneliği aynı işlemde açılmalı.",
    status: "Sırada"
  },
  {
    title: "Oturum güvenliği",
    description: "Access token, refresh token, rol ve salonId sunucu tarafında doğrulanmalı.",
    status: "Kritik"
  }
] as const;

export function createDemoAuthSession(): AuthSession {
  return {
    accessToken: "demo-access-token",
    refreshToken: "demo-refresh-token",
    account: {
      salonId: productConfig.demoAccount.salonId,
      salonName: "Saloniva Güzellik",
      ownerName: "Demo Kullanıcı",
      email: "demo@saloniva.app",
      role: "Salon Sahibi",
      planId: productConfig.demoAccount.planId,
      subscriptionStatus: productConfig.demoAccount.subscriptionStatus,
      trialEndsAt: productConfig.demoAccount.trialEndsAt,
      permissions: [...productConfig.demoAccount.permissions]
    }
  };
}

export function createRegisteredSalonSession(payload: RegisterSalonPayload): AuthSession {
  return {
    accessToken: "local-registration-token",
    refreshToken: "local-registration-refresh-token",
    account: {
      salonId: `salon-${Date.now()}`,
      salonName: payload.salonName.trim() || "Yeni Salon",
      ownerName: payload.ownerName.trim() || "Salon Yetkilisi",
      email: payload.email.trim() || "demo@saloniva.app",
      role: payload.role,
      planId: payload.planId,
      subscriptionStatus: "Deneme",
      trialEndsAt: "14 gün sonra",
      permissions: [...productConfig.demoAccount.permissions]
    }
  };
}
