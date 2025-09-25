const header = `
	<header>
		<h1>Pages</h1>
		<div id="pages">
			<a href="index.html">Home</a>
			<a href="rwd.html">Read, write, draw</a>
			<a href="vocab.html">Study vocabulary</a>
			<a href="vocab_mobile.html">Vocab demo (mobile)</a>
		</div>
		<h1>Resources</h1>
		<div id="resources">
			<a href="https://translate.google.com/?sl=en&tl=ru&op=translate">Google translate</a>
			<a href="https://translate.yandex.com/?source_lang=en&target_lang=ru">Yandex translate</a>
			<a href="https://www.merriam-webster.com/">Dictionary</a>
			<a href="https://www.urbandictionary.com/">Urban dictionary</a>
			<a href="https://chat.deepseek.com/">Deepseek</a>
		</div>
	</header>
`
var body = document.querySelector("body")
body.innerHTML = header+body.innerHTML
document.querySelectorAll("header #resources a").forEach(i => {i.target = "_blank"})
