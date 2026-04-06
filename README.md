# DMC Otomasyon

Nuxt 4 ile hazırlanmış katalog ve host panel uygulaması. Local geliştirme odaklıdır; aynı zamanda daha sonra Node tabanlı bir hosting/VPS ortamına taşınabilecek şekilde dosya tabanlı kalıcı storage kullanır.

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
```

- `HOST_ADMIN_PASSWORD`: host panel giriş şifresi
- `NUXT_PUBLIC_SITE_URL`: absolute SEO ve sitemap URL üretimi için tercih edilen origin
- `DMC_STORAGE_DIR`: runtime yazımların tutulduğu kalıcı klasör

## Veri Akışı

- `seed/data` ve `seed/uploads`: repoda saklanan örnek içerik
- `storage/data` ve `storage/uploads`: uygulamanın runtime sırasında yazdığı gerçek içerik
- İlk çalıştırmada seed içeriği `storage` altına kopyalanır
- Ürün ve marka görselleri `/uploads/...` route’u üzerinden `storage/uploads` klasöründen servis edilir

Bu yapı sayesinde local testte yapılan değişiklikler build sonrası da korunur ve ileride persistent disk sunan bir hostinge taşınabilir.

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

## Hosting Notu

Bu proje statik hosting için tasarlanmadı. Future hostingte aşağıdakiler beklenir:

- Node 20+ çalıştırabilen ortam
- uygulama kökünde kalıcı disk erişimi
- `storage/` klasörünün deploylar arasında korunması
