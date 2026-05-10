# Saloniva GitHub'a Yukleme Rehberi

Bu proje GitHub'a yuklenirken `node_modules` klasoru yuklenmemelidir. GitHub'a sadece kaynak kod, dokumanlar ve proje ayarlari yuklenir.

## 1. GitHub'da Repo Ac

1. GitHub'a gir.
2. `New repository` sec.
3. Repo adi olarak ornek: `saloniva`
4. Public veya Private sec.
5. `Create repository` butonuna bas.

## 2. Bilgisayarda Proje Klasorunu Ac

Komut satirinda bu klasorde olmalisin:

```bash
C:\Users\ASUS\Documents\Codex\2026-05-06\bana-eker-hastalar-ve-tansiyon-hastlar
```

## 3. Git Komutlari

GitHub sana repo linki verecek. Asagidaki komutlarda `REPO_LINKINI_BURAYA_YAZ` yerine kendi GitHub repo linkini koy.

```bash
git init
git add .
git commit -m "Initial Saloniva app"
git branch -M main
git remote add origin REPO_LINKINI_BURAYA_YAZ
git push -u origin main
```

Ornek repo linki soyle olur:

```bash
https://github.com/kullanici-adin/saloniva.git
```

## 4. Yuklemeden Once Kontrol

GitHub'a yuklenecek dosyalari gormek icin:

```bash
git status
```

`node_modules` gorunmemeli. Gorunmuyorsa her sey dogru.

## 5. Sonra Projeyi Calistirma

Projeyi baska bilgisayarda acarsan once:

```bash
npm install
```

Sonra:

```bash
npm run web
```

Tarayicida:

```bash
http://localhost:8081
```

## Not

Bu proje su an demo/pilot satis seviyesindedir. Gercek satis icin backend, bulut veritabani, odeme, magaza linkleri ve testler tamamlanmalidir.
