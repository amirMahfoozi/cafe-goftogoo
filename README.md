# منوی دیجیتال کافه گفتگو

وب‌سایت تک‌صفحه‌ای و کاملاً استاتیک برای منوی فارسی «کافه گفتگو». رابط کاربری از ابتدا برای موبایل طراحی شده و در نمایشگرهای بزرگ با شبکه سه و چهارستونه از فضای دسکتاپ استفاده می‌کند. پروژه هیچ بک‌اند، پایگاه داده، ردیاب، سبد خرید یا فریم‌ورک جاوااسکریپت سمت کاربر ندارد.

## ویژگی‌های اصلی

- رابط فارسی، `lang="fa"` و `dir="rtl"` با نمایش ارقام فارسی
- لوگوی رسمی و عکس‌های واقعی فضای کافه
- ۷ دسته و ۵۴ آیتم منو بر اساس تابلوی ارسالی
- عکس واقعی، محلی و بهینه‌شده WebP برای هر محصول
- ناوبری چسبان با لینک‌های عادی و آیکون‌های رنگی OpenMoji
- دنبال‌کردن دسته فعال با `IntersectionObserver` بدون دست‌کاری اسکرول عمودی کاربر
- شبکه دو‌ستونه روی موبایل، سه‌ستونه روی تبلت و چهارستونه روی دسکتاپ
- داده‌های تایپ‌شده، اعتبارسنجی قیمت‌ها و کنترل شناسه‌های تکراری
- فونت‌های Estedad و Vazirmatn به‌صورت self-hosted
- متادیتای فارسی، Open Graph، Twitter Card، sitemap و JSON-LD
- پشتیبانی از safe area، فوکوس صفحه‌کلید و `prefers-reduced-motion`
- خروجی HTML، CSS، JavaScript، فونت و تصویر؛ قابل میزبانی روی هر هاست استاتیک

## پشته فنی

- Astro 7 با خروجی Static
- TypeScript با strict mode
- CSS مدرن و CSS custom properties
- Astro components
- JavaScript وانیل برای ناوبری دسته‌ها و fallback تصاویر
- Vitest برای آزمون‌های قیمت، داده و هندسه ناوبری
- Sharp فقط برای آماده‌سازی دارایی‌های تصویری در زمان توسعه

## نیازمندی‌ها

- Node.js نسخه 22.12 یا جدیدتر
- npm نسخه 10 یا جدیدتر

## نصب و اجرا

```bash
npm install
npm run dev
```

بررسی TypeScript، تست‌ها و تمام مسیرهای تصویر:

```bash
npm run check
```

ساخت نسخه تولید و اجرای ممیزی HTML/CSS/JavaScript:

```bash
npm run build
```

پیش‌نمایش پوشه `dist/`:

```bash
npm run preview
```

در صورت نیاز می‌توان میزبان و پورت پیش‌نمایش را تغییر داد:

```bash
PREVIEW_HOST=0.0.0.0 PREVIEW_PORT=4173 npm run preview
```

## ساختار پروژه

```text
src/
  assets/brand/             فایل اصلی لوگوی ارسالی
  assets/cafe/              عکس‌های اصلی فضای کافه
  components/               اجزای Astro رابط
  data/cafe.ts              برند، متادیتا و راه‌های ارتباطی
  data/menu.ts              دسته‌ها، محصولات و قیمت‌ها
  layouts/BaseLayout.astro  پوسته، SEO و structured data
  pages/index.astro         صفحه منو
  scripts/                  رفتار ناوبری و fallback تصویر
  styles/                   reset، توکن‌ها و استایل سراسری
  types/menu.ts             مدل‌های TypeScript
  utils/                    قیمت، مسیر دارایی و اعتبارسنجی
public/
  fonts/                    فونت‌های محلی و مجوز OFL
  icons/categories/         آیکون‌های محلی OpenMoji
  images/brand/             نسخه‌های بهینه لوگو
  images/cafe/              عکس‌های واکنش‌گرای فضای کافه
  images/menu/              عکس‌های محصولات و manifestها
scripts/                    پردازش، دانلود و ممیزی دارایی‌ها
tests/                      آزمون‌های داده، قیمت و ناوبری
```

## ویرایش اطلاعات کافه

فایل `src/data/cafe.ts` منبع اصلی اطلاعات کافه است. این فیلدها عمداً خالی مانده‌اند تا اطلاعات ساختگی منتشر نشود:

- `phone`: شماره رسمی، بدون پیشوند `tel:`
- `instagramUrl`: URL کامل صفحه رسمی اینستاگرام
- `mapUrl`: لینک مستقیم Google Maps، بلد، نشان یا سرویس دلخواه
- `address`: نشانی رسمی
- `openingHours`: ساعت کاری ثابت در صورت نیاز؛ وضعیت زنده باز/بسته نمایش داده نمی‌شود

تا پیش از تکمیل سه لینک عملیاتی، دکمه‌های تماس، اینستاگرام و مسیریابی به‌شکل غیرفعال و قابل تشخیص دیده می‌شوند. فیلدهای خالی از structured data نیز حذف می‌شوند.

## ویرایش دسته‌ها و محصولات

تمام دسته‌ها و محصولات در `src/data/menu.ts` قرار دارند و اجزای رابط هیچ متن منویی را hardcode نمی‌کنند.

### افزودن یا حذف دسته

1. شناسه را در `MenuCategoryId` داخل `src/types/menu.ts` تغییر دهید.
2. رکورد متناظر را در `menuCategories` اضافه یا حذف کنید.
3. یک آیکون هم‌نام در `public/icons/categories/` قرار دهید.
4. محصولات وابسته را در `menuItems` به‌روزرسانی کنید.

### افزودن محصول

هر محصول باید شناسه یکتا، دسته معتبر، نام، تصویر، alt فارسی و ترتیب داشته باشد. منبع قیمت باید دقیقاً یکی از این سه حالت باشد:

```ts
price: 230;
```

```ts
variants: [
  { label: "کوچک", price: 180 },
  { label: "بزرگ", price: 220 },
];
```

```ts
priceNote: "استعلام قیمت";
```

قیمت عددی بر حسب هزار تومان ذخیره و هنگام رندر با `Intl.NumberFormat("fa-IR")` فارسی می‌شود.

### تغییر قیمت، وضعیت و برچسب

- قیمت: عدد `price` یا اعداد `variants` را تغییر دهید.
- ناموجود امروز: `available: false` را به آیتم اضافه کنید؛ کارت مخفی نمی‌شود.
- برچسب اختیاری: یکی از `محبوب`، `جدید` یا `گیاهی` را در `badge` قرار دهید.
- حذف محصول: شیء مربوط را از `menuItems` حذف و عکس بلااستفاده را نیز پاک کنید.

پس از هر تغییر داده اجرا کنید:

```bash
npm run check
```

## عکس‌های محصولات

تمام ۵۴ عکس فعلی، فایل محلی WebP با اندازه ۱۲۰۰×۹۰۰ و نسبت ۴:۳ هستند؛ سایت هنگام اجرا هیچ تصویر خارجی بارگذاری نمی‌کند. تصاویر از Pexels انتخاب شده‌اند و جزئیات صفحه منبع هر فایل در `public/images/menu/photo-sources.json` ثبت شده است. وضعیت و نام مورد انتظار هر فایل نیز در `public/images/menu/image-manifest.json` قرار دارد.

برای جایگزینی عکس یک محصول:

1. فایل WebP جدید را با همان نام و در همان پوشه قرار دهید؛ برای نمونه `public/images/menu/coffee/pistachio-latte.webp`.
2. اگر نام فایل عوض شد، فیلد `image` همان محصول را در `src/data/menu.ts` تغییر دهید.
3. `imageAlt` را مطابق محتوای واقعی عکس بازنویسی کنید.
4. `npm run check` و سپس `npm run build` را اجرا کنید.

پیشنهاد عکاسی نهایی کافه:

- فایل اصلی حداقل ۱۲۰۰ پیکسل عرض و نسبت ۴:۳
- پس‌زمینه گرم و خنثی، نور از یک جهت ثابت و crop مشابه
- محصول در مرکز با فضای تنفس کافی
- خروجی WebP یا AVIF بدون نوشته داخل تصویر
- رنگ و ظرف واقعی همان محصولی که در کافه سرو می‌شود

اسکریپت `npm run download:product-photos` مجموعه فعلی را دوباره از منابع ثبت‌شده دریافت و فایل‌های WebP را بازنویسی می‌کند؛ آن را پس از جایگزینی با عکس‌های اختصاصی کافه اجرا نکنید.

## لوگو و تصاویر فضای کافه

- فایل اصلی لوگوی ارسالی در `src/assets/brand/cafe-goftogoo-logo-original.png` نگهداری می‌شود.
- خروجی‌های AVIF/WebP لوگو، favicon و آیکون‌های manifest با `npm run process:brand-assets` بازسازی می‌شوند.
- عکس‌های اصلی فضای کافه در `src/assets/cafe/` و خروجی‌های واکنش‌گرا در `public/images/cafe/` هستند.
- پس از جایگزینی عکس‌های اصلی کافه، `npm run process:cafe-images` را اجرا کنید.

## آیکون‌های دسته‌ها

آیکون‌های رنگی دسته‌ها از OpenMoji هستند، محلی سرو می‌شوند و در `public/icons/categories/` قرار دارند. مجوز CC BY-SA 4.0 در `public/icons/OpenMoji-LICENSE.txt` حفظ شده و attribution نیز در فوتر سایت آمده است. برای تعویض آیکون، SVG هم‌نام را جایگزین کنید و نسبت مربع را حفظ کنید.

## فونت‌ها

Estedad و Vazirmatn از Fontsource دریافت شده‌اند و فایل‌های مجوز SIL Open Font License در `public/fonts/` قرار دارند. برای همگام‌سازی دوباره:

```bash
npm run sync:fonts
```

برای فونت دیگر، WOFF2ها را جایگزین یا مسیرهای `@font-face` را در `src/styles/global.css` اصلاح کنید. `font-display: swap` و fallbackهای Tahoma و Arial فعال هستند.

## رنگ‌ها و عرض دسکتاپ

توکن‌ها در `src/styles/tokens.css` متمرکز هستند. مهم‌ترین متغیرها:

```css
--color-background: #fefae0;
--color-surface: #faedcd;
--color-surface-soft: #e9edc9;
--color-secondary: #ccd5ae;
--color-primary: #d4a373;
--color-text: #2b2118;
--color-text-muted: #655d53;
--color-border: #ded5bd;
--content-max: 82rem;
```

در تغییر پالت، متن تیره روی سطوح روشن و کنتراست فوکوس را حفظ کنید. breakpointهای اصلی در اجزای مربوط قرار دارند: یک ستون زیر ۳۵۰px، دو ستون در موبایل، سه ستون از ۷۲۰px و چهار ستون از ۱۰۸۰px.

## URL اصلی و GitHub Pages

برای canonical و sitemap واقعی:

```bash
SITE_URL=https://menu.example.com npm run build
```

برای GitHub Project Pages:

```bash
SITE_URL=https://username.github.io/repository \
BASE_PATH=/repository/ \
npm run build
```

برای دامنه ریشه یا custom domain مقدار `BASE_PATH` را `/` نگه دارید.

## استقرار روی NGINX

محتوای `dist/` را، برای مثال، در `/var/www/cafe-goftogoo` کپی کنید:

```nginx
server {
    listen 80;
    server_name menu.example.com;
    root /var/www/cafe-goftogoo;
    index index.html;
    charset utf-8;

    location / {
        try_files $uri $uri/ =404;
    }

    location /assets/ {
        try_files $uri =404;
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location ~* ^/(images|fonts|icons)/ {
        try_files $uri =404;
        expires 7d;
        add_header Cache-Control "public, max-age=604800, stale-while-revalidate=86400";
    }

    location = /index.html {
        add_header Cache-Control "no-cache";
    }
}
```

فایل‌های `assets/` دارای hash هستند و می‌توانند immutable باشند. نام تصاویر منو ثابت است تا تعویض آن‌ها آسان بماند، بنابراین cache دائمی برای پوشه `images/` توصیه نمی‌شود.

## Cloudflare Pages

- Build command: `npm run build`
- Output directory: `dist`
- Node.js: `22`
- Environment variables: حداقل `SITE_URL` و در صورت نیاز `BASE_PATH`

## Vercel و Netlify

در هر دو سرویس repository را متصل کنید و موارد زیر را تنظیم کنید:

- Framework preset: Astro یا Other
- Build command: `npm run build`
- Publish/output directory: `dist`
- Environment: `SITE_URL=https://دامنه-نهایی`

هیچ function، server runtime یا adapter لازم نیست.

## Apache، هاست ایرانی و سرویس‌های استاتیک

تمام محتوای پوشه `dist/` را مستقیماً در public root آپلود کنید. MIME typeهای `webp`، `avif`، `woff2` و `webmanifest` باید فعال باشند. برای Apache می‌توان `Cache-Control` معادل تنظیم NGINX را با `mod_expires` و `mod_headers` اعمال کرد. پروژه به rewrite مربوط به SPA نیاز ندارد.

## موارد نیازمند تأیید کافه

تصویر منوی فیزیکی در چند نقطه با ظروف روی پیشخوان پوشیده شده است. برای جلوگیری از درج اطلاعات ساختگی، موارد زیر شفاف نگه داشته شده‌اند:

- قیمت هات نوتلا و ماچا
- قیمت کوبا لیبره، اسموتی چری و اسموتی منگو
- قیمت وافل، کوکی مخصوص و آیس‌کریم مخصوص
- نام و قیمت دو آیتم صبحانه که زیر ظروف پنهان‌اند؛ این دو آیتم اصلاً به داده اضافه نشده‌اند
- توضیح مواد اولیه محصولات، آلرژن‌ها و تصاویر stock باید پیش از انتشار نهایی با سرو واقعی کافه تطبیق داده شوند
- شماره تلفن، اینستاگرام، لینک نقشه، نشانی و ساعت کاری

آیتم‌های دارای قیمت نامشخص در رابط با «استعلام قیمت» دیده می‌شوند و رقم حدسی ندارند.

## مجوزها

کد پروژه تحت MIT در `LICENSE` ارائه شده است. جزئیات دارایی‌های شخص ثالث در `THIRD_PARTY_NOTICES.md` آمده است. عکس‌های فضای کافه و محتوای برند ارسالی کاربر مشمول مجوز نرم‌افزار نیستند.
