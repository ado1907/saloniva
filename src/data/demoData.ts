import type {
  Appointment,
  BookingRequest,
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
    customer: "Ayse Yilmaz",
    phone: "905320000000",
    service: "Cilt Bakimi",
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
    service: "Kas ve Kirpik",
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
    service: "Protez Tirnak",
    staff: "Nur",
    price: 1500,
    status: "Planlandı"
  },
  {
    id: "a4",
    time: "14:30",
    end: "15:30",
    customer: "Derya Sahin",
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
    customer: "Irem Demir",
    phone: "905360000000",
    service: "Sac Bakimi",
    staff: "Seda",
    price: 1100,
    status: "Gelmedi"
  },
  {
    id: "a6",
    time: "17:15",
    end: "18:00",
    customer: "Selin Er",
    phone: "905370000000",
    service: "Kalici Makyaj Rotus",
    staff: "Elif",
    price: 2500,
    status: "Planlandı"
  },
  {
    id: "a7",
    time: "18:15",
    end: "19:00",
    customer: "Buse Koc",
    phone: "905380000000",
    service: "Kas ve Kirpik",
    staff: "Seda",
    price: 950,
    status: "Planlandı"
  },
  {
    id: "a8",
    time: "19:15",
    end: "20:15",
    customer: "Nazli Can",
    phone: "905390000000",
    service: "VIP Cilt Protokolu",
    staff: "Nur",
    price: 1850,
    status: "Planlandı"
  },
  {
    id: "a9",
    time: "20:30",
    end: "21:15",
    customer: "Ece Acar",
    phone: "905310000001",
    service: "Protez Tirnak",
    staff: "Nur",
    price: 1650,
    status: "Planlandı"
  }
];

export const bookingRequests: BookingRequest[] = [
  {
    id: "br1",
    customer: "Melis Arda",
    phone: "905410000000",
    service: "Lazer Epilasyon",
    preferredTime: "13:30",
    note: "Instagram reklamindan geldi, paket fiyatini da sormak istiyor.",
    status: "Onay Bekliyor"
  },
  {
    id: "br2",
    customer: "Pelin Su",
    phone: "905420000000",
    service: "VIP Cilt Protokolu",
    preferredTime: "18:00",
    note: "VIP oda ve cilt analizi talep etti.",
    status: "Onay Bekliyor"
  },
  {
    id: "br3",
    customer: "Gizem Oral",
    phone: "905430000000",
    service: "Kas ve Kirpik",
    preferredTime: "11:15",
    note: "Daha once gelmeyen musteri, kapora onerilebilir.",
    status: "Onay Bekliyor"
  }
];

export const customers: Customer[] = [
  {
    id: "c1",
    name: "Ayse Yilmaz",
    phone: "0532 000 00 00",
    lastVisit: "Bugun",
    totalSpent: 18400,
    debt: 3000,
    packageLabel: "Lazer Paketi: 5 seans kaldi",
    note: "Hassas cilt, dusuk yogunluk tercih ediyor. Odeme hatirlatmasi gonderilmeli."
  },
  {
    id: "c2",
    name: "Zeynep Kaya",
    phone: "0533 000 00 00",
    lastVisit: "Bugun",
    totalSpent: 9200,
    debt: 0,
    packageLabel: "Aktif paket yok",
    note: "Randevu oncesi WhatsApp hatirlatma istiyor."
  },
  {
    id: "c3",
    name: "Merve Aksoy",
    phone: "0534 000 00 00",
    lastVisit: "3 gun once",
    totalSpent: 22400,
    debt: 2800,
    packageLabel: "Cilt Bakimi: 1 seans kaldi",
    note: "Paket yenileme icin bugun teklif gosterilmeli."
  },
  {
    id: "c4",
    name: "Derya Sahin",
    phone: "0535 000 00 00",
    lastVisit: "1 hafta once",
    totalSpent: 38900,
    debt: 0,
    packageLabel: "Bolgesel Incelme: 4 seans kaldi",
    note: "Aksam saatlerini tercih ediyor, VIP oda talebi var."
  },
  {
    id: "c5",
    name: "Irem Demir",
    phone: "0536 000 00 00",
    lastVisit: "Bugun",
    totalSpent: 7600,
    debt: 1100,
    packageLabel: "Sac Bakimi: tek seans",
    note: "Gelmedi riski yuksek. Keratin sonrasi urun onerisi bekliyor."
  },
  {
    id: "c6",
    name: "Selin Er",
    phone: "0537 000 00 00",
    lastVisit: "2 hafta once",
    totalSpent: 32600,
    debt: 2500,
    packageLabel: "Kalici Makyaj: rotus bekliyor",
    note: "Premium paket adayi, dogum gunu kampanyasi gonderilebilir.",
    notes: [
      { id: "n1", date: "Bugun", text: "Rotus sonrasi bakim kremi satisa uygundur." },
      { id: "n2", date: "2 hafta once", text: "Islem oncesi fotograf onayi alindi." }
    ]
  },
  {
    id: "c7",
    name: "Buse Koc",
    phone: "0538 000 00 00",
    lastVisit: "Dun",
    totalSpent: 14700,
    debt: 950,
    packageLabel: "Kas Kirpik: 1 seans kaldi",
    note: "Paket yenileme icin bugun teklif gosterilmeli.",
    notes: [{ id: "n3", date: "Dun", text: "Dogal gorunum tercih ediyor." }]
  },
  {
    id: "c8",
    name: "Nazli Can",
    phone: "0539 000 00 00",
    lastVisit: "1 ay once",
    totalSpent: 61200,
    debt: 0,
    packageLabel: "VIP Cilt Protokolu: 6 seans kaldi",
    note: "Yuksek sadakatli musteri, yeni sube acilis daveti gonderilebilir."
  }
];

export const packages: ServicePackage[] = [
  {
    id: "p1",
    customer: "Ayse Yilmaz",
    title: "Lazer Epilasyon Paketi",
    totalSessions: 8,
    usedSessions: 3,
    totalPrice: 6000,
    paid: 3000
  },
  {
    id: "p2",
    customer: "Merve Aksoy",
    title: "Cilt Bakimi Paketi",
    totalSessions: 4,
    usedSessions: 3,
    totalPrice: 4800,
    paid: 2000
  },
  {
    id: "p3",
    customer: "Derya Sahin",
    title: "Bolgesel Incelme Paketi",
    totalSessions: 10,
    usedSessions: 6,
    totalPrice: 9000,
    paid: 9000
  },
  {
    id: "p4",
    customer: "Buse Koc",
    title: "Kas Kirpik Premium Paketi",
    totalSessions: 6,
    usedSessions: 5,
    totalPrice: 5400,
    paid: 4450
  },
  {
    id: "p5",
    customer: "Nazli Can",
    title: "VIP Cilt Protokolu",
    totalSessions: 8,
    usedSessions: 2,
    totalPrice: 14400,
    paid: 14400
  },
  {
    id: "p6",
    customer: "Selin Er",
    title: "Kalici Makyaj Bakim Paketi",
    totalSessions: 3,
    usedSessions: 2,
    totalPrice: 7500,
    paid: 5000
  }
];

export const services: PopularService[] = [
  { name: "Lazer Epilasyon", count: 14, revenue: 30800 },
  { name: "Cilt Bakimi", count: 9, revenue: 11850 },
  { name: "Protez Tirnak", count: 7, revenue: 11150 },
  { name: "Kas ve Kirpik", count: 6, revenue: 5400 },
  { name: "Kalici Makyaj", count: 3, revenue: 7500 }
];

export const staff: StaffPerformance[] = [
  { name: "Elif", count: 9, revenue: 27300 },
  { name: "Seda", count: 7, revenue: 12800 },
  { name: "Nur", count: 6, revenue: 14600 }
];

export const payments: Payment[] = [
  {
    id: "pay1",
    customer: "Ayse Yilmaz",
    service: "Lazer Epilasyon Paketi",
    date: "9 Mayis",
    amount: 3000,
    method: "Kart",
    status: "Kısmi Ödendi",
    remaining: 3000
  },
  {
    id: "pay2",
    customer: "Zeynep Kaya",
    service: "Kas ve Kirpik",
    date: "9 Mayis",
    amount: 850,
    method: "Nakit",
    status: "Ödendi",
    remaining: 0
  },
  {
    id: "pay3",
    customer: "Merve Aksoy",
    service: "Cilt Bakimi Paketi",
    date: "8 Mayis",
    amount: 2000,
    method: "Havale",
    status: "Kısmi Ödendi",
    remaining: 2800
  },
  {
    id: "pay4",
    customer: "Derya Sahin",
    service: "Bolgesel Incelme Paketi",
    date: "7 Mayis",
    amount: 9000,
    method: "Kart",
    status: "Ödendi",
    remaining: 0
  },
  {
    id: "pay5",
    customer: "Irem Demir",
    service: "Sac Bakimi",
    date: "Bugun",
    amount: 0,
    method: "Diğer",
    status: "Bekliyor",
    remaining: 1100
  },
  {
    id: "pay6",
    customer: "Selin Er",
    service: "Kalici Makyaj Bakim Paketi",
    date: "Bugun",
    amount: 5000,
    method: "Kart",
    status: "Kısmi Ödendi",
    remaining: 2500
  },
  {
    id: "pay7",
    customer: "Buse Koc",
    service: "Kas Kirpik Premium Paketi",
    date: "Dun",
    amount: 4450,
    method: "Havale",
    status: "Kısmi Ödendi",
    remaining: 950
  },
  {
    id: "pay8",
    customer: "Nazli Can",
    service: "VIP Cilt Protokolu",
    date: "6 Mayis",
    amount: 14400,
    method: "Kart",
    status: "Ödendi",
    remaining: 0
  }
];

export const salonServices: SalonService[] = [
  {
    id: "s1",
    name: "Cilt Bakimi",
    category: "Cilt Bakimi",
    durationMinutes: 60,
    price: 1200,
    active: true,
    staff: ["Elif", "Seda", "Nur"]
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
    name: "Protez Tirnak",
    category: "Tirnak",
    durationMinutes: 75,
    price: 1500,
    active: true,
    staff: ["Nur"]
  },
  {
    id: "s4",
    name: "Kas ve Kirpik",
    category: "Kas/Kirpik",
    durationMinutes: 45,
    price: 850,
    active: true,
    staff: ["Seda"]
  },
  {
    id: "s5",
    name: "Sac Bakimi",
    category: "Sac",
    durationMinutes: 60,
    price: 1100,
    active: true,
    staff: ["Seda", "Nur"]
  },
  {
    id: "s6",
    name: "Kalici Makyaj Rotus",
    category: "Kalici Makyaj",
    durationMinutes: 90,
    price: 2500,
    active: true,
    staff: ["Elif"]
  },
  {
    id: "s7",
    name: "VIP Cilt Protokolu",
    category: "Premium Bakim",
    durationMinutes: 75,
    price: 1850,
    active: true,
    staff: ["Nur", "Elif"]
  }
];

export const staffMembers: StaffMember[] = [
  {
    id: "sm1",
    name: "Elif Arslan",
    role: "Uzman Estetisyen",
    phone: "0532 111 11 11",
    active: true,
    services: ["Cilt Bakimi", "Lazer Epilasyon", "Kalici Makyaj"],
    appointmentsToday: 9,
    monthlyRevenue: 78200,
    nextAppointment: "14:30 - Derya Sahin"
  },
  {
    id: "sm2",
    name: "Seda Kurt",
    role: "Kas/Kirpik Uzmani",
    phone: "0533 222 22 22",
    active: true,
    services: ["Kas ve Kirpik", "Sac Bakimi", "Cilt Bakimi"],
    appointmentsToday: 7,
    monthlyRevenue: 59100,
    nextAppointment: "16:00 - Irem Demir"
  },
  {
    id: "sm3",
    name: "Nur Aydin",
    role: "Tirnak ve VIP Bakim Uzmani",
    phone: "0534 333 33 33",
    active: true,
    services: ["Protez Tirnak", "Sac Bakimi", "VIP Cilt Protokolu"],
    appointmentsToday: 6,
    monthlyRevenue: 67600,
    nextAppointment: "19:15 - Nazli Can"
  },
  {
    id: "sm4",
    name: "Buse Yalcin",
    role: "Yardimci Personel",
    phone: "0535 444 44 44",
    active: false,
    services: ["Karsilama", "Hazirlik"],
    appointmentsToday: 0,
    monthlyRevenue: 0,
    nextAppointment: "Planli randevu yok"
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
    name: "Cilt Bakim Serumu",
    category: "Bakim Urunu",
    quantity: 3,
    unit: "sise",
    minQuantity: 5,
    cost: 540,
    supplier: "Dermakoz"
  },
  {
    id: "i3",
    name: "Tek Kullanimlik Havlu",
    category: "Sarf Malzeme",
    quantity: 120,
    unit: "adet",
    minQuantity: 60,
    cost: 3,
    supplier: "Salon Market"
  },
  {
    id: "i4",
    name: "Protez Tirnak Tip",
    category: "Tirnak",
    quantity: 18,
    unit: "kutu",
    minQuantity: 10,
    cost: 180,
    supplier: "Nail Pro"
  },
  {
    id: "i5",
    name: "Kas Boyasi",
    category: "Kas/Kirpik",
    quantity: 2,
    unit: "tup",
    minQuantity: 4,
    cost: 210,
    supplier: "Beauty Lab"
  },
  {
    id: "i6",
    name: "VIP Bakim Kiti",
    category: "Perakende",
    quantity: 4,
    unit: "set",
    minQuantity: 6,
    cost: 780,
    supplier: "Luxury Care"
  },
  {
    id: "i7",
    name: "SPF Koruyucu Krem",
    category: "Satis Urunu",
    quantity: 22,
    unit: "adet",
    minQuantity: 12,
    cost: 260,
    supplier: "Dermakoz"
  }
];

export const branches: Branch[] = [
  {
    id: "b1",
    name: "Saloniva Merkez",
    address: "Nisantasi, Istanbul",
    manager: "Elif Arslan",
    appointmentsToday: 24,
    monthlyRevenue: 226500,
    staffCount: 4,
    status: "Aktif"
  },
  {
    id: "b2",
    name: "Saloniva Cadde",
    address: "Bagdat Caddesi, Istanbul",
    manager: "Seda Kurt",
    appointmentsToday: 16,
    monthlyRevenue: 154200,
    staffCount: 3,
    status: "Aktif"
  },
  {
    id: "b3",
    name: "Saloniva Ankara",
    address: "Cankaya, Ankara",
    manager: "Atanacak",
    appointmentsToday: 0,
    monthlyRevenue: 0,
    staffCount: 0,
    status: "Kurulumda"
  }
];
