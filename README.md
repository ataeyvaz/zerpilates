# Zerpilates 🌿

Zer için özel olarak geliştirilmiş kişisel pilates antrenman uygulaması. React Native / Expo ile yazılmıştır.

---

## Özellikler

### Egzersiz Kütüphanesi
- 23 pilates hareketi — başlangıç, orta ve ileri seviye
- Her egzersiz için adım adım talimatlar, ipuçları ve kas grubu bilgisi
- Vücut bölgesine ve seviyeye göre filtreleme
- Arama desteği

### Sesli Rehberlik
- Türkçe TTS seslendirme (tr-TR-EmelNeural)
- Her egzersiz için tanıtım, tam anlatım ve adım adım ses dosyaları
- Tek seferlik tercih — bir kez açıldığında tüm egzersizlerde geçerli

### Antrenman Zamanlayıcısı
- Çalış / Dinlen fazları (varsayılan 40s / 20s)
- Yuvarlak halka geri sayım (SVG)
- Set ve tekrar takibi
- Egzersiz sırası ve atlama

### Görsel Rehberlik
- Egzersiz fotoğrafları (B01–B15 adım görselleri)
- Otomatik slayt döngüsü (4 saniyelik geçişler)
- Fotoğraf yoksa SVG pilates karakteri animasyonu

### Nefes Rehberi
- Çalışma fazında 4s nefes al / 4s nefes ver döngüsü
- Animasyonlu nefes dairesi

### Sessiz Mod
- 🔇 Sesi tamamen kapatır
- Büyük yazıyla adım adım talimatlar gösterir

### Isınma & Soğuma
- Her antrenmandan önce 4 hareket × 30 saniyelik hazırlık
- Antrenman sonrası soğuma ve kutlama ekranı

### Ruh Hali Seçici
- 😌 Hafif / 💪 Orta / 🔥 Yoğun
- Seçilen ruh haline göre otomatik egzersiz filtresi

### Program Oluşturucu
- Özel antrenman programları oluşturma ve kaydetme
- Egzersiz ekleme, sıralama, set/tekrar düzenleme

### İlerleme Takibi
- Tamamlanan antrenman geçmişi
- Günlük seri (streak) takibi
- Toplam seans ve süre istatistikleri

---

## Teknolojiler

| Katman | Teknoloji |
|---|---|
| Framework | React Native + Expo SDK 55 |
| Navigasyon | React Navigation (Stack + Bottom Tabs) |
| Ses | expo-audio |
| Depolama | AsyncStorage |
| Grafikler | react-native-svg |
| TTS Üretimi | edge-tts (tr-TR-EmelNeural) |
| Dil | TypeScript |

---

## Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npx expo start --clear
```

Telefonda **Expo Go** uygulamasını aç ve QR kodu tara.

---

## Proje Yapısı

```
zerpilates/
├── assets/
│   └── audio/          # TTS ses dosyaları (intro / full / step)
├── src/
│   ├── assets/
│   │   ├── character/  # SVG pilates karakteri
│   │   ├── pilatespic/ # Egzersiz adım fotoğrafları (B01–B15)
│   │   └── audio/      # Eski ses dosyaları (kullanım dışı)
│   ├── components/
│   │   ├── ExerciseAnimation.tsx  # Fotoğraf/SVG animasyon bileşeni
│   │   ├── ExerciseCard.tsx
│   │   ├── FilterChip.tsx
│   │   ├── MoodSelector.tsx
│   │   └── SearchBar.tsx
│   ├── constants/
│   │   ├── audioAssets.ts    # Ses dosyası eşlemesi
│   │   ├── colors.ts         # Renk paleti
│   │   ├── exercises.ts      # 23 egzersiz verisi
│   │   └── photoAssets.ts    # Fotoğraf eşlemesi
│   ├── navigation/
│   │   └── AppNavigator.tsx
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── ExerciseLibraryScreen.tsx
│   │   ├── ExerciseDetailScreen.tsx
│   │   ├── WarmupScreen.tsx
│   │   ├── TimerScreen.tsx
│   │   ├── CooldownScreen.tsx
│   │   ├── WorkoutPlannerScreen.tsx
│   │   └── ProgressTrackerScreen.tsx
│   ├── store/
│   │   └── storage.ts    # AsyncStorage yardımcıları
│   └── types/
│       └── index.ts
└── scripts/
    └── generateAllAudio.js  # TTS üretim betiği
```

---

## Ses Dosyası Üretimi

Ses dosyaları `edge-tts` ile üretilmiştir:

```bash
# edge-tts yükle
pip install edge-tts

# Tüm egzersizler için ses üret
node scripts/generateAllAudio.js
```

Her egzersiz için üç tür dosya oluşturulur:
- `[id]_intro.mp3` — Kısa tanıtım
- `[id]_full.mp3` — Tam anlatım (tüm adımlar)
- `[id]_step[n].mp3` — Adım adım

---

## Fotoğraf Eşlemesi

| Egzersiz | B-Kodu |
|---|---|
| bridge | B01 |
| the-hundred | B02 |
| roll-up | B03 |
| rolling-like-a-ball | B04 |
| single-leg-stretch | B05 |
| double-leg-stretch | B06 |
| spine-stretch | B07 |
| cat-cow | B08 |
| side-leg-lift | B10 |
| leg-circles | B15 |
