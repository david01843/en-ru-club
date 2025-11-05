const header = `
<header>
	<h1>Pages</h1>
	<div id="pages">
		<a href="index.html">Home</a>
		<a href="rwd.html">Read, write, draw</a>
		<a href="vocab.html">Study vocabulary</a>
		<a href="vocab_mobile_main.html">Flash cards for mobile</a>
		<a href="show_data.html">Show database</a>
		<a href="clock.html">Clock</a>
		<a href="alias.html">Alias</a>
	</div>
</header>`
var body = document.querySelector("body")
body.innerHTML = header+body.innerHTML
document.querySelectorAll("header #resources a").forEach(i => {i.target = "_blank"})
