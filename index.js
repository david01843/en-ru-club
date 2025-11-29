const x = `Yandex|darkorange|https://yandex.com/
Ytranslate|darkorange|https://translate.yandex.com/?source_lang=en&target_lang=ru
Ymail|darkorange|https://mail.yandex.ru/
Ymessenger|darkorange|https://messenger.360.yandex.ru/
Google|green|https://www.google.com/
Gtranslate|green|https://translate.google.com/?sl=en&tl=ru&op=translate
Gmail|green|https://mail.google.com/mail/u/0/#inbox
Outlook|steelblue|https://outlook.office.com/mail/inbox
Whatsapp|lime|https://web.whatsapp.com/
SberBank|limegreen|https://online.sberbank.ru/CSAFront/index.do#/
Beeline|darkkhaki|https://kazan.beeline.ru/customers/products/
Deepseek|blue|https://chat.deepseek.com/sign_up
Ruble|red|https://tradingview.com/symbols/USDRUB/
Gold|goldenrod|https://tradingview.com/symbols/XAUUSD/
Silver|skyblue|https://tradingview.com/symbols/XAGUSD/
Oil|brown|https://oilprice.com/
Website|violet|https://en-ru-club.deno.dev/
GitHub|purple|https://github.com/
DenoDeploy|purple|https://dash.deno.com/
KFUlogin|blue|https://shelly.kpfu.ru/e-ksu/portal_podfak_site.login
StudeRus|blue|https://studerus.ru/
Stepik|blue|https://stepik.org/lesson/329538/step/1
RussianRailways|red|https://eng.rzd.ru/
fmhy|hotpink|https://fmhy.net/
MVD-TRP|turquoise|https://xn--b1aew.xn--p1ai/dejatelnost/emvd/guvm/%D0%B2%D1%8B%D0%B4%D0%B0%D1%87%D0%B0-%D1%80%D0%B0%D0%B7%D1%80%D0%B5%D1%88%D0%B5%D0%BD%D0%B8%D1%8F-%D0%BD%D0%B0-%D0%B2%D1%80%D0%B5%D0%BC%D0%B5%D0%BD%D0%BD%D0%BE%D0%B5-%D0%BF%D1%80%D0%BE%D0%B6%D0%B8%D0%B2%D0%B0%D0%BD%D0%B8
OGN|black|https://finance.yahoo.com/quote/OGN.V/
WPM|black|https://finance.yahoo.com/quote/WPM/
KGC|black|https://finance.yahoo.com/quote/KGC/
GDXJ|black|https://finance.yahoo.com/quote/GDXJ/
GDX|black|https://finance.yahoo.com/quote/GDX/
SAND|black|https://finance.yahoo.com/quote/SAND/
Barr|black|https://finance.yahoo.com/quote/B/
NEM|black|https://finance.yahoo.com/quote/NEM/`.split("\n")
m = document.querySelector("main")
m.addEventListener("click", (e) => {
	if (e.target == m) {window.location.href = "https://www.youtube.com/"}
})
x.forEach(i => {
	var y = i.trim().split("|"); var a = document.createElement("a")
	a.innerHTML = y[0]; a.style.color = y[1]; a.href = y[2]; a.target = "_blank"; m.appendChild(a)
})
