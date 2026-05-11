import type {
  Appointment,
  Branch,
  Customer,
  InventoryItem,
  Payment,
  PopularService,
  SalonService,
  ServicePackage,
  StaffMember,
  StaffPerformance
} from "../types";

export const appointments: Appointment[] = [
  {
    id: "a1",
    time: "09:30",
    end: "10:30",
    customer: "Ayşe Yılmaz",
    phone: "905320000000",
    service: "Cilt Bakımı",
    staff: "Elif",
    price: 1200,
    status: "Tamamlandı"
  },
  {
    id: "a2",
    time: "10:45",
    end: "11:30",
    customer: "Zeynep Kaya",
    phone: "905330000000",
    service: "Kaş ve Kirpik",
    staff: "Seda",
    price: 850,
    status: "Geldi"
  },
  {
    id: "a3",
    time: "12:00",
    end: "13:00",
    customer: "Merve Aksoy",
    phone: "905340000000",
    service: "Protez Tırnak",
    staff: "Nur",
    price: 1500,
    status: "Planlandı"
  },
  {
    id: "a4",
    time: "14:30",
    end: "15:30",
    customer: "Derya Şahin",
    phone: "905350000000",
    service: "Lazer Epilasyon",
    staff: "Elif",
    price: 2200,
    status: "Planlandı"
  },
  {
    id: "a5",
    time: "16:00",
    end: "17:00",
    customer: "İrem Demir",
    phone: "905360000000",
    service: "Saç Bakımı",
    staff: "Seda",
    price: 1100,
    status: "Gelmedi"
  }
];

export const customers: Customer[] = [
  {
    id: "c1",
    name: "Ayşe Yılmaz",
    phone: "0532 000 00 00",
    lastVisit: "Bugün",
    totalSpent: 8400,
    debt: 1200,
    packageLabel: "Lazer Paketi: 5 seans kaldı",
    note: "Hassas cilt, düşük yoğunluk tercih ediyor."
  },
  {
    id: "c2",
    name: "Zeynep Kaya",
    phone: "0533 000 00 00",
    lastVisit: "Bugün",
    totalSpent: 5200,
    debt: 0,
    packageLabel: "Aktif paket yok",
    note: "Randevu öncesi WhatsApp hatırlatma istiyor."
  },
  {
    id: "c3",
    name: "Merve Aksoy",
    phone: "0534 000 00 00",
    lastVisit: "3 gün önce",
    totalSpent: 12400,
    debt: 2800,
    packageLabel: "Cilt Bakımı: 2 seans kaldı",
    note: "Nude tonları seviyor."
  }
];

export const packages: ServicePackage[] = [
  {
    id: "p1",
    customer: "Ayşe Yılmaz",
    title: "Lazer Epilasyon Paketi",
    totalSessions: 8,
    usedSessions: 3,
    totalPrice: 6000,
    paid: 3000
  },
  {
    id: "p2",
    customer: "Merve Aksoy",
    title: "Cilt Bakımı Paketi",
    totalSessions: 4,
    usedSessions: 2,
    totalPrice: 4800,
    paid: 2000
  },
  {
    id: "p3",
    customer: "Derya Şahin",
    title: "Bölgesel İncelme Paketi",
    totalSessions: 10,
    usedSessions: 6,
    totalPrice: 9000,
    paid: 9000
  }
];

export const services: PopularService[] = [
  { name: "Lazer Epilasyon", count: 8, revenue: 17600 },
  { name: "Cilt Bakımı", count: 5, revenue: 6000 },
  { name: "Protez Tırnak", count: 4, revenue: 6000 },
  { name: "Kaş ve Kirpik", count: 3, revenue: 2550 }
];

export const staff: StaffPerformance[] = [
  { name: "Elif", count: 6, revenue: 4800 },
  { name: "Seda", count: 5, revenue: 3900 },
  { name: "Nur", count: 4, revenue: 2700 }
];

export const payments: Payment[] = [
  {
    id: "pay1",
    customer: "Ayşe Yılmaz",
    service: "Lazer Epilasyon Paketi",
    date: "9 Mayıs",
    amount: 3000,
    method: "Kart",
    status: "Kısmi Ödendi",
    remaining: 3000
  },
  {
    id: "pay2",
    customer: "Zeynep Kaya",
    service: "Kaş ve Kirpik",
    date: "9 Mayıs",
    amount: 850,
    method: "Nakit",
    status: "Ödendi",
    remaining: 0
  },
  {
    id: "pay3",
    customer: "Merve Aksoy",
    service: "Cilt Bakımı Paketi",
    date: "8 Mayıs",
    amount: 2000,
    method: "Havale",
    status: "Kısmi Ödendi",
    remaining: 2800
  },
  {
    id: "pay4",
    customer: "Derya Şahin",
    service: "Bölgesel İncelme Paketi",
    date: "7 Mayıs",
    amount: 9000,
    method: "Kart",
    status: "Ödendi",
    remaining: 0
  },
  {
    id: "pay5",
    customer: "İrem Demir",
    service: "Saç Bakımı",
    date: "Bugün",
    amount: 0,
    method: "Diğer",
    status: "Bekliyor",
    remaining: 1100
  }
];

export const salonServices: SalonService[] = [
  {
    id: "s1",
    name: "Cilt Bakımı",
    category: "Cilt Bakımı",
    durationMinutes: 60,
    price: 1200,
    active: true,
    staff: ["Elif", "Seda"]
  },
  {
    id: "s2",
    name: "Lazer Epilasyon",
    category: "Lazer",
    durationMinutes: 60,
    price: 2200,
    active: true,
    staff: ["Elif"]
  },
  {
    id: "s3",
    name: "Protez Tırnak",
    category: "Tırnak",
    durationMinutes: 75,
    price: 1500,
    active: true,
    staff: ["Nur"]
  },
  {
    id: "s4",
    name: "Kaş ve Kirpik",
    category: "Kaş/Kirpik",
    durationMinutes: 45,
    price: 850,
    active: true,
    staff: ["Seda"]
  },
  {
    id: "s5",
    name: "Saç Bakımı",
    category: "Saç",
    durationMinutes: 60,
    price: 1100,
    active: true,
    staff: ["Seda", "Nur"]
  },
  {
    id: "s6",
    name: "Kalıcı Makyaj Rötuş",
    category: "Kalıcı Makyaj",
    durationMinutes: 90,
    price: 2500,
    active: false,
    staff: ["Elif"]
  }
];

export const staffMembers: StaffMember[] = [
  {
    id: "sm1",
    name: "Elif Arslan",
    role: "Uzman Estetisyen",
    phone: "0532 111 11 11",
    active: true,
    services: ["Cilt Bakımı", "Lazer Epilasyon", "Kalıcı Makyaj"],
    appointmentsToday: 6,
    monthlyRevenue: 48200,
    nextAppointment: "14:30 - Derya Şahin"
  },
  {
    id: "sm2",
    name: "Seda Kurt",
    role: "Kaş/Kirpik Uzmanı",
    phone: "0533 222 22 22",
    active: true,
    services: ["Kaş ve Kirpik", "Saç Bakımı", "Cilt Bakımı"],
    appointmentsToday: 5,
    monthlyRevenue: 39100,
    nextAppointment: "16:00 - İrem Demir"
  },
  {
    id: "sm3",
    name: "Nur Aydın",
    role: "Tırnak Uzmanı",
    phone: "0534 333 33 33",
    active: true,
    services: ["Protez Tırnak", "Saç Bakımı"],
    appointmentsToday: 4,
    monthlyRevenue: 27600,
    nextAppointment: "12:00 - Merve Aksoy"
  },
  {
    id: "sm4",
    name: "Buse Yalçın",
    role: "Yardımcı Personel",
    phone: "0535 444 44 44",
    active: false,
    services: ["Karşılama", "Hazırlık"],
    appointmentsToday: 0,
    monthlyRevenue: 0,
    nextAppointment: "Planlı randevu yok"
  }
];

export const inventoryItems: InventoryItem[] = [
  {
    id: "i1",
    name: "Lazer Jel",
    category: "Sarf Malzeme",
    quantity: 6,
    unit: "adet",
    minQuantity: 4,
    cost: 320,
    supplier: "Medikal Tedarik"
  },
  {
    id: "i2",
    name: "Cilt Bakım Serumu",
    category: "Bakım Ürünü",
    quantity: 3,
    unit: "şişe",
    minQuantity: 5,
    cost: 540,
    supplier: "Dermakoz"
  },
  {
    id: "i3",
    name: "Tek Kullanımlık Havlu",
    category: "Sarf Malzeme",
    quantity: 120,
    unit: "adet",
    minQuantity: 60,
    cost: 3,
    supplier: "Salon Market"
  },
  {
    id: "i4",
    name: "Protez Tırnak Tip",
    category: "Tırnak",
    quantity: 18,
    unit: "kutu",
    minQuantity: 10,
    cost: 180,
    supplier: "Nail Pro"
  },
  {
    id: "i5",
    name: "Kaş Boyası",
    category: "Kaş/Kirpik",
    quantity: 2,
    unit: "tüp",
    minQuantity: 4,
    cost: 210,
    supplier: "Beauty Lab"
  }
];

export const branches: Branch[] = [
  {
    id: "b1",
    name: "Saloniva Merkez",
    address: "Nişantaşı, İstanbul",
    manager: "Elif Arslan",
    appointmentsToday: 18,
    monthlyRevenue: 126500,
    staffCount: 4,
    status: "Aktif"
  },
  {
    id: "b2",
    name: "Saloniva Cadde",
    address: "Bağdat Caddesi, İstanbul",
    manager: "Seda Kurt",
    appointmentsToday: 11,
    monthlyRevenue: 84200,
    staffCount: 3,
    status: "Aktif"
  },
  {
    id: "b3",
    name: "Saloniva Ankara",
    address: "Çankaya, Ankara",
    manager: "Atanacak",
    appointmentsToday: 0,
    monthlyRevenue: 0,
    staffCount: 0,
    status: "Kurulumda"
  }
];
