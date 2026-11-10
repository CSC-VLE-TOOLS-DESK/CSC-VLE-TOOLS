# SEO & Launch Guide (CSC VLE TOOLS v32)

Already done in the code: page titles, descriptions, canonical links, Open Graph / Twitter cards (WhatsApp, Facebook, X previews),
structured data (WebApplication, Breadcrumb, FAQ), sitemap.xml, robots.txt, mobile viewport, icons, manifest.

## Before launch
1. Check the site address. Every page uses https://csc-vle-tools-desk.github.io/CSC-VLE-TOOLS/ .
   If your live address is different, tell Claude the exact address and all pages, sitemap and robots will be changed together.
2. Fill SITE.phone, SITE.email, SITE.whatsappNumber and your social links in assets/js/site.js (shown in footer, Contact page and chatbot).
3. Finish your test report (TEST_CHECKLIST_v32.txt) and fix all FAIL items.

## After you upload to GitHub
1. Google Search Console (search.google.com/search-console): Add property > URL prefix > your site address.
   Verify with the HTML-tag method (paste the meta tag into index.html head) or upload the verification file.
2. Sitemaps > add: sitemap.xml  (submit once; Google re-reads it).
3. URL Inspection > paste the home page address > Request indexing. Repeat for 5-10 top tools (PAN & Aadhaar Print, Photo Resizer, PDF Compressor ...).
4. Bing Webmaster Tools (bing.com/webmasters): Import from Google Search Console. This also covers DuckDuckGo and Yahoo.
5. Share the link on WhatsApp / Facebook once to check the preview card (title + picture).
6. Create a Google Business Profile for your CSC centre and add the site address as the website.
7. Indexing takes days to weeks. Check Search Console > Pages after a week.

## Keep growing
- Add a new tool: add it to the list in site.js, add the page, add it to sitemap.xml, and the chatbot finds it by itself.
- Get links: share on CSC groups, YouTube descriptions, Telegram channels.
- Keep tool titles short with the main words people search ("PDF Compressor", "Aadhaar Card Print").
