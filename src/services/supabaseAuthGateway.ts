import { productConfig } from "../config/productConfig";
import type { RegisterSalonPayload } from "./authGateway";
import type { SalonAccount, SubscriptionPlanId, SubscriptionStatus, UserRole } from "../types";
import { supabaseConfig } from "./supabaseConfig";
import { supabaseRestClient } from "./supabaseRestClient";

type SupabaseAuthUser = {
  id: string;
  email?: string;
};

type SupabaseAuthResponse = {
  access_token?: string;
  refresh_token?: string;
  user?: SupabaseAuthUser;
};

type CloudAccountRow = {
  salon_id: string;
  salon_name: string;
  owner_name: string;
  email: string;
  role: UserRole;
  plan_id: SubscriptionPlanId;
  subscription_status: SubscriptionStatus;
  trial_ends_at: string;
};

export type SupabaseSalonSession = {
  accessToken: string;
  refreshToken: string;
  account: SalonAccount;
};

function assertAuthConfigured() {
  if (!supabaseConfig.configured) {
    throw new Error("Supabase bağlantısı hazır değil. Önce .env dosyasını doldur.");
  }
}

function buildAuthHeaders() {
  return {
    apikey: supabaseConfig.anonKey,
    "Content-Type": "application/json"
  };
}

async function parseAuthResponse(response: Response): Promise<SupabaseAuthResponse> {
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      typeof payload?.msg === "string"
        ? payload.msg
        : typeof payload?.message === "string"
          ? payload.message
          : "Supabase giriş işlemi başarısız oldu.";

    throw new Error(message);
  }

  return payload as SupabaseAuthResponse;
}

function mapCloudAccount(row: CloudAccountRow, accessToken: string, refreshToken: string): SupabaseSalonSession {
  return {
    accessToken,
    refreshToken,
    account: {
      salonId: row.salon_id,
      salonName: row.salon_name,
      ownerName: row.owner_name,
      email: row.email,
      role: row.role,
      planId: row.plan_id,
      subscriptionStatus: row.subscription_status,
      trialEndsAt: row.trial_ends_at,
      permissions: [...productConfig.demoAccount.permissions]
    }
  };
}

async function fetchMySalonAccount(accessToken: string, refreshToken: string) {
  const rows = await supabaseRestClient.rpc<CloudAccountRow[]>("get_my_salon_account", {}, { accessToken });
  const account = rows[0];

  if (!account) {
    throw new Error("Bu kullanıcıya bağlı salon hesabı bulunamadı.");
  }

  return mapCloudAccount(account, accessToken, refreshToken);
}

export async function signInWithSupabase(email: string, password: string) {
  assertAuthConfigured();

  const response = await fetch(`${supabaseConfig.url}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: buildAuthHeaders(),
    body: JSON.stringify({ email: email.trim(), password })
  });
  const payload = await parseAuthResponse(response);

  if (!payload.access_token || !payload.refresh_token) {
    throw new Error("Oturum başlatılamadı. E-posta doğrulaması açıksa önce doğrulama gerekebilir.");
  }

  return fetchMySalonAccount(payload.access_token, payload.refresh_token);
}

export async function registerSalonWithSupabase(payload: RegisterSalonPayload) {
  assertAuthConfigured();

  const response = await fetch(`${supabaseConfig.url}/auth/v1/signup`, {
    method: "POST",
    headers: buildAuthHeaders(),
    body: JSON.stringify({
      email: payload.email.trim(),
      password: payload.password,
      data: {
        salon_name: payload.salonName.trim(),
        owner_name: payload.ownerName.trim(),
        role: payload.role
      }
    })
  });
  const authPayload = await parseAuthResponse(response);

  if (!authPayload.access_token || !authPayload.refresh_token) {
    throw new Error("Hesap oluşturuldu ama oturum açılmadı. Supabase Email Confirm ayarını test için kapat veya e-postanı doğrula.");
  }

  const rows = await supabaseRestClient.rpc<CloudAccountRow[]>(
    "register_salon_account",
    {
      salon_name_input: payload.salonName.trim() || "Yeni Salon",
      owner_name_input: payload.ownerName.trim() || "Salon Yetkilisi",
      role_input: payload.role,
      plan_id_input: payload.planId
    },
    { accessToken: authPayload.access_token }
  );
  const account = rows[0];

  if (!account) {
    throw new Error("Salon hesabı oluşturulamadı.");
  }

  return mapCloudAccount(account, authPayload.access_token, authPayload.refresh_token);
}

export async function requestPasswordResetWithSupabase(email: string) {
  assertAuthConfigured();

  const response = await fetch(`${supabaseConfig.url}/auth/v1/recover`, {
    method: "POST",
    headers: buildAuthHeaders(),
    body: JSON.stringify({ email: email.trim() })
  });

  await parseAuthResponse(response);
}

export const supabaseAuthReadiness = [
  "Supabase Email Auth aktif olmalı.",
  "Test aşamasında Email Confirm kapalı olursa kayıt sonrası direkt giriş yapılır.",
  "register_salon_account RPC fonksiyonu SQL Editor içinde çalıştırılmış olmalı.",
  "Gizli service_role anahtarı uygulamaya eklenmemeli."
];
