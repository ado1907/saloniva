export const productionTestScenarios = [
  {
    area: "Randevu",
    scenario: "Yeni randevu oluştur, çakışma kontrolünü gör, durumu tamamlandı yap.",
    acceptance: "Randevu takvimde görünür, gelir hesabına yansır ve yanlış saat çakışması engellenir."
  },
  {
    area: "Ödeme",
    scenario: "Borcu olan müşteriye ödeme al ve müşteri borcunun güncellendiğini kontrol et.",
    acceptance: "Ödeme listesine kayıt düşer, müşteri kartındaki açık bakiye değişir."
  },
  {
    area: "Paket",
    scenario: "Yeni paket tanımla, seans kullan ve paket detayından ödeme al.",
    acceptance: "Kalan seans ve ödenen tutar doğru güncellenir."
  },
  {
    area: "Dil",
    scenario: "Ayarlar üzerinden Türkçe, İngilizce ve Arapça seçeneklerini değiştir.",
    acceptance: "Ana başlıklar değişir, ekran taşması veya kırık düzen oluşmaz."
  },
  {
    area: "Koyu mod",
    scenario: "Açık, koyu ve sistem modları arasında geçiş yap.",
    acceptance: "Metin kontrastı korunur, butonlar ve kartlar okunur kalır."
  },
  {
    area: "Mobil ekran",
    scenario: "Alt menüyle Panel, Takvim, Müşteri, Ödeme ve Diğer ekranlarını dolaş.",
    acceptance: "Alt menü içerik üstünü kapatmaz, formlar mobilde kullanılabilir kalır."
  },
  {
    area: "Web ekran",
    scenario: "Geniş ekranda sidebar ile ana modülleri dolaş.",
    acceptance: "Sidebar aktif sekmeyi gösterir, içerikler taşmadan görünür."
  }
];

