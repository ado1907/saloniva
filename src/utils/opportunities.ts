import type { BookingRequest, SalonService } from "../types";

export type SalesOpportunity = {
  id: string;
  customer: string;
  phone: string;
  service: string;
  status: BookingRequest["status"];
  source: string;
  potentialRevenue: number;
  priority: "Yüksek" | "Orta" | "Düşük";
  nextAction: string;
};

const fallbackPrices: Record<string, number> = {
  "Kadın Bakım Hizmetleri": 1800,
  "Erkek Bakım Hizmetleri": 950,
  "Çift Hizmetleri": 3200,
  "Evde Salon Hizmeti": 2400,
  "Çift Spa Deneyimi": 4200,
  "Işıltılı Cilt Paketi": 3600,
  "Hair Reborn": 2800,
  "Nail Couture": 1900
};

export function buildSalesOpportunities(
  requests: BookingRequest[],
  salonServices: SalonService[]
): SalesOpportunity[] {
  return requests.map((request) => {
    const matchedService = salonServices.find((service) => service.name === request.service);
    const potentialRevenue = matchedService?.price ?? fallbackPrices[request.service] ?? 1500;
    const priority = getPriority(request.status, potentialRevenue);

    return {
      id: request.id,
      customer: request.customer,
      phone: request.phone,
      service: request.service,
      status: request.status,
      source: request.id.startsWith("showcase") ? "Salon vitrini" : "Online randevu linki",
      potentialRevenue,
      priority,
      nextAction:
        request.status === "Onay Bekliyor"
          ? "15 dakika içinde WhatsApp ile dönüş yap"
          : request.status === "Onaylandı"
            ? "Randevu öncesi paket önerisi hazırla"
            : "Alternatif saat ve daha uygun hizmet öner"
    };
  });
}

function getPriority(status: BookingRequest["status"], revenue: number): SalesOpportunity["priority"] {
  if (status === "Onay Bekliyor" && revenue >= 2500) {
    return "Yüksek";
  }

  if (status === "Onay Bekliyor") {
    return "Orta";
  }

  return "Düşük";
}
