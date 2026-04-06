# DMC Otomasyon

Nuxt 4 ile hazırlanmış katalog ve host panel uygulaması. Yerelde dosya tabanlı storage ile çalışır; Vercel ortamında ise aynı veri ve upload akışı Vercel Blob ile kalıcı hale gelir.

## Stack

- Nuxt 4
- Nuxt UI 4
- Tailwind CSS 4
- Vitest + Nuxt test utils
- JSON tabanlı katalog verisi

## Hızlı Başlangıç

```sh
pnpm install
cp .env.example .env
pnpm dev
```

Host panelini kullanmak için `.env` içinde `HOST_ADMIN_PASSWORD` tanımlı olmalıdır.

## Ortam Değişkenleri

```env
HOST_ADMIN_PASSWORD=change-me
NUXT_PUBLIC_SITE_URL=http://localhost:3000
DMC_STORAGE_DIR=storage
BLOB_READ_WRITE_TOKEN=
```

- `HOST_ADMIN_PASSWORD`: host panel giriş şifresi
- `NUXT_PUBLIC_SITE_URL`: absolute SEO ve sitemap URL üretimi için tercih edilen origin
- `DMC_STORAGE_DIR`: runtime yazımların tutulduğu kalıcı klasör
- `BLOB_READ_WRITE_TOKEN`: Vercel Blob bağlandığında veri JSON dosyaları ve yeni upload'lar Blob'a yazılır

## Veri Akışı

- `seed/data`: yerel dosya storage ilk açılış fallback verileri
- `public/uploads`: build ile birlikte yayınlanan başlangıç görselleri
- `storage/data` ve `storage/uploads`: yerelde runtime sırasında yazılan gerçek içerik
- Vercel'de `BLOB_READ_WRITE_TOKEN` varsa katalog JSON verileri ve yeni upload'lar Blob store'a yazılır
- İlk çalıştırmada seed içeriği `storage` altına kopyalanır
- Başlangıç görselleri `public/uploads` altından servis edilir; yerelde sonradan yüklenen görseller `/uploads/...` route’u üzerinden `storage/uploads` klasöründen sunulur

Bu yapı sayesinde local testte yapılan değişiklikler build sonrası da korunur; Vercel deploy'larında ise kalıcılık Blob üzerinden sağlanır.

## Komutlar

```sh
pnpm dev
pnpm test -- --run
pnpm lint
pnpm build
pnpm start
```

- `pnpm build`: production build üretir
- `pnpm start`: `.output/server/index.mjs` ile gerçek production server’ı başlatır

## Local Production Test

```sh
pnpm build
pnpm start
```

Sonra şu akışları kontrol edin:

1. `/host/login` ile giriş
2. ürün ekleme / düzenleme
3. görsel upload
4. public katalogda yeni içeriğin görünmesi

## Vercel Notu

Bu proje statik hosting için tasarlanmadı. Vercel'de host paneli ve kaydetme akışı için aşağıdakiler gerekir:

- Vercel project içinde bir Blob store
- projeye eklenmiş `BLOB_READ_WRITE_TOKEN`
- `HOST_ADMIN_PASSWORD` ve `NUXT_PUBLIC_SITE_URL` environment variable'ları
- server upload akışında görsel boyutu en fazla `4.5 MB`

Yerelde Blob bağlı değilse mevcut dosya tabanlı `storage/` fallback'i kullanılmaya devam eder.
