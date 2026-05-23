import { supabaseConfig } from "./supabaseConfig";

export class SupabaseUnauthorizedError extends Error {
  constructor(message = "Oturum süresi doldu. Lütfen tekrar giriş yapın.") {
    super(message);
    this.name = "SupabaseUnauthorizedError";
  }
}

export function isSupabaseUnauthorizedError(error: unknown) {
  return error instanceof SupabaseUnauthorizedError;
}

type JsonRecord = Record<string, unknown>;

export type SupabaseQueryOptions = {
  accessToken?: string;
  select?: string;
  order?: string;
  limit?: number;
  eq?: Record<string, string | number | boolean>;
};

function buildHeaders(accessToken?: string) {
  const token = accessToken || supabaseConfig.anonKey;

  return {
    apikey: supabaseConfig.anonKey,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    Prefer: "return=representation"
  };
}

function assertConfigured() {
  if (!supabaseConfig.configured) {
    throw new Error("Supabase bağlantısı hazır değil. .env dosyasındaki URL ve anon key değerlerini kontrol et.");
  }
}

function buildUrl(table: string, options: SupabaseQueryOptions = {}) {
  const url = new URL(`${supabaseConfig.url}/rest/v1/${table}`);
  url.searchParams.set("select", options.select ?? "*");

  if (options.order) {
    url.searchParams.set("order", options.order);
  }

  if (typeof options.limit === "number") {
    url.searchParams.set("limit", String(options.limit));
  }

  Object.entries(options.eq ?? {}).forEach(([key, value]) => {
    url.searchParams.set(key, `eq.${String(value)}`);
  });

  return url.toString();
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Supabase isteği başarısız oldu: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const supabaseRestClient = {
  async list<T extends JsonRecord>(table: string, options?: SupabaseQueryOptions) {
    assertConfigured();

    const response = await fetch(buildUrl(table, options), {
      headers: buildHeaders(options?.accessToken)
    });

    return parseResponse<T[]>(response);
  },

  async insert<T extends JsonRecord>(table: string, payload: JsonRecord, options?: SupabaseQueryOptions) {
    assertConfigured();

    const response = await fetch(buildUrl(table, options), {
      method: "POST",
      headers: buildHeaders(options?.accessToken),
      body: JSON.stringify(payload)
    });

    return parseResponse<T[]>(response);
  },

  async patch<T extends JsonRecord>(table: string, id: string, payload: JsonRecord, options?: SupabaseQueryOptions) {
    assertConfigured();

    const url = new URL(buildUrl(table, options));
    url.searchParams.set("id", `eq.${id}`);

    const response = await fetch(url.toString(), {
      method: "PATCH",
      headers: buildHeaders(options?.accessToken),
      body: JSON.stringify(payload)
    });

    return parseResponse<T[]>(response);
  },

  async rpc<T>(functionName: string, payload: JsonRecord, options?: SupabaseQueryOptions) {
    assertConfigured();

    const response = await fetch(`${supabaseConfig.url}/rest/v1/rpc/${functionName}`, {
      method: "POST",
      headers: buildHeaders(options?.accessToken),
      body: JSON.stringify(payload)
    });

    return parseResponse<T>(response);
  }
};
