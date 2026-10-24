# CSC VLE TOOLS - Setup Guide

## 1. Publish on GitHub
1. Open your repo `CSC-VLE-TOOLS` on GitHub, click **Add file > Upload files**.
2. Drag in everything from inside this folder (including the `assets` folder), then **Commit changes**.
3. In **Settings > Pages**, set Source to the `main` branch and `/ (root)`.
4. Wait 1-2 minutes, open the site and press **Ctrl + F5**.

## 2. Add your own contact and social links (one place only)
Open `assets/js/site.js` and edit the block called **SITE SETTINGS** near the top.

- `email`, `phone`, `whatsappNumber` (digits with country code, e.g. 919876543210)
- `social`: whatsapp, telegram, facebook, instagram, youtube, x, linkedin, github
- `formEndpoint`: optional Formspree URL so feedback arrives by email directly

Anything left as `''` is hidden automatically. Filled-in links appear in the footer on every page, on the Contact page, the Feedback page and the home page.

## 3. SEO checklist after publishing
1. Open https://search.google.com/search-console and add the property `https://csc-vle-tools-desk.github.io/CSC-VLE-TOOLS/`.
2. Submit `https://csc-vle-tools-desk.github.io/CSC-VLE-TOOLS/sitemap.xml`.
3. Use "URL inspection" > "Request indexing" for the home page.
4. Add the same site to Bing Webmaster Tools.
5. Share the site links on WhatsApp and Telegram groups; real visits and links help ranking.
6. If you later buy a custom domain, change the URL in `assets/js/site.js`, `index.html`, `sitemap.xml`, `robots.txt` and the canonical links.

No one can promise a ranking position. Search results depend on content quality, competition and time.

## 4. Style
Colours live in `assets/css/portal.css` (tokens) and `assets/css/csc-system.css`. Homepage layout is in `assets/css/home.css`. The visitor theme picker (header > Theme) lets users change colours.

## 5. Adding a new tool
Copy `TEMPLATE_STARTER.html`, give it a unique title and description, register it in the TOOLS list in `assets/js/site.js`, and add it to `sitemap.xml`.
