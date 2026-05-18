import type { Appointment, BookingRequest, Customer, InventoryItem, Payment, ServicePackage } from "../types";
import { formatCurrency } from "./format";

export type SalonivaAiTone = "risk" | "growth" | "flow" | "care";

export type SalonivaAiInsight = {
  id: string;
  action: string;
  detail: string;
  label: string;
  title: string;
  tone: SalonivaAiTone;
};

export type SalonivaSignal = {
  id: string;
  hint: string;
  label: string;
  value: number;
};

type Input = {
  appointments: Appointment[];
  bookingRequests: BookingRequest[];
  customers: Customer[];
  inventoryItems: InventoryItem[];
  packages: ServicePackage[];
  payments: Payment[];
  totals: {
    collected: number;
    debt: number;
    expectedRevenue: number;
    completedAppointments: number;
    missedAppointments: number;
  };
};

export function buildSalonivaAiInsights(input: Input): SalonivaAiInsight[] {
  const debtCustomers = input.customers.filter((customer) => customer.debt > 0);
  const pendingRequests = input.bookingRequests.filter((request) => request.status === "Onay Bekliyor");
  const expiringPackages = input.packages.filter((item) => item.totalSessions - item.usedSessions <= 1);
  const lowStock = input.inventoryItems.filter((item) => item.quantity <= item.minQuantity);
  const planned = input.appointments.filter((appointment) => appointment.status === "Planlandı");
  const missed = input.appointments.filter((appointment) => appointment.status === "Gelmedi" || appointment.status === "İptal");

  const insights: SalonivaAiInsight[] = [];

  insights.push({
    id: "collection",
    action: "Hatırlatma listesi",
    detail:
      debtCustomers.length > 0
        ? `${formatCurrency(input.totals.debt)} açık bakiye var. En yüksek borçlu müşteriden başlanmalı.`
        : "Açık bakiye görünmüyor. Demo satışında güçlü tahsilat yönetimi mesajı verilebilir.",
    label: "Gelir koruma",
    title: debtCustomers.length > 0 ? `${debtCustomers.length} müşteriye ödeme aksiyonu` : "Tahsilat akışı temiz",
    tone: debtCustomers.length > 0 ? "risk" : "care"
  });

  insights.push({
    id: "booking-flow",
    action: "Takvime dönüştür",
    detail:
      pendingRequests.length > 0
        ? "Online talepler aynı gün onaylanırsa boş saatler daha hızlı kapanır."
        : "Bekleyen online talep yok. Randevu linki demo sırasında tekrar vurgulanabilir.",
    label: "Randevu akışı",
    title: `${pendingRequests.length} onay bekleyen talep`,
    tone: pendingRequests.length > 0 ? "flow" : "care"
  });

  insights.push({
    id: "package-renewal",
    action: "Yenileme teklifi",
    detail:
      expiringPackages.length > 0
        ? "Bitmek üzere olan paketler satış fırsatına çevrilebilir. WhatsApp metniyle tamamlanmalı."
        : "Paket yenileme riski düşük. Yeni hizmet paketleri önerilebilir.",
    label: "Satış fırsatı",
    title: `${expiringPackages.length} paket yenileme sinyali`,
    tone: "growth"
  });

  insights.push({
    id: "operations",
    action: "Operasyon kontrolü",
    detail:
      lowStock.length > 0
        ? `${lowStock.length} stok kalemi kritik seviyede. Randevu yoğunluğu başlamadan sipariş açılmalı.`
        : `${planned.length} planlı randevu ve ${missed.length} kayıp risk noktası izleniyor.`,
    label: "Salon operasyonu",
    title: lowStock.length > 0 ? "Stok riski erken yakalandı" : "Günlük akış kontrol altında",
    tone: lowStock.length > 0 ? "risk" : "flow"
  });

  return insights;
}

export function buildSalonivaSignals(input: Input): SalonivaSignal[] {
  const totalRevenue = input.totals.collected + input.totals.debt;
  const collectionRate = totalRevenue > 0 ? Math.round((input.totals.collected / totalRevenue) * 100) : 100;
  const appointmentFlow = input.appointments.length > 0 ? Math.round((input.totals.completedAppointments / input.appointments.length) * 100) : 0;
  const requestConversion = input.bookingRequests.length > 0
    ? Math.round(((input.bookingRequests.length - input.bookingRequests.filter((request) => request.status === "Onay Bekliyor").length) / input.bookingRequests.length) * 100)
    : 100;
  const stockHealth = input.inventoryItems.length > 0
    ? Math.round(((input.inventoryItems.length - input.inventoryItems.filter((item) => item.quantity <= item.minQuantity).length) / input.inventoryItems.length) * 100)
    : 100;

  return [
    {
      id: "collection-rate",
      hint: "Ödeme ekranının alıcıya göstereceği en güçlü işletme metriği.",
      label: "Tahsilat sağlığı",
      value: clampPercent(collectionRate)
    },
    {
      id: "appointment-flow",
      hint: "Günlük takvimin ne kadarının tamamlandığını özetler.",
      label: "Randevu akışı",
      value: clampPercent(appointmentFlow)
    },
    {
      id: "request-conversion",
      hint: "Online randevu linkinin satış demosundaki etkisini gösterir.",
      label: "Talep dönüşümü",
      value: clampPercent(requestConversion)
    },
    {
      id: "stock-health",
      hint: "Operasyonun stok tarafında ne kadar hazır olduğunu gösterir.",
      label: "Stok güveni",
      value: clampPercent(stockHealth)
    }
  ];
}

export function getSalonivaDemoScore(input: Input): number {
  const signals = buildSalonivaSignals(input);
  const signalAverage = signals.reduce((sum, signal) => sum + signal.value, 0) / Math.max(signals.length, 1);
  const dataDepthBonus = Math.min(input.customers.length + input.appointments.length + input.payments.length, 30);
  return clampPercent(Math.round(signalAverage * 0.82 + dataDepthBonus));
}

function clampPercent(value: number) {
  return Math.max(0, Math.min(100, value));
}