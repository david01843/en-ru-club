pdfjsLib.GlobalWorkerOptions.workerSrc = "import/pdf.worker.min.js"
const {jsPDF} = window.jspdf
const WIDTH = 1000; const HEIGHT = 707 // landscape 297mm x 210mm

const connect = document.querySelector("main button")
const editor = document.querySelector("main #editor")
const tools = document.querySelectorAll("main #editor a")
const slides = document.querySelector("main #editor div")
const text = document.querySelector("main #editor div p")
text.style.display = "none"
const color = document.querySelectorAll("main #editor input")
function setcolor(h, l) {
	c = (1-Math.abs(25*l/100-1)); x = c*(1-Math.abs((h/5)%2-1)); m = l/8-c/2
	if (h < 5) {r = c; g = x; b = 0} else if (h < 10) {r = x; g = c; b = 0}
	else if (h < 15) {r = 0; g = c; b = x} else if (h < 20) {r = 0; g = x; b = c}
	else if (h < 25) {r = x; g = 0; b = c} else {r = c; g = 0; b = x}
	hx = (n) => Math.round(255*(n+m)).toString(16).padStart(2, "0")
	color[0].style.background = `#${hx(r)}${hx(g)}${hx(b)}`
	color[1].style.background = color[0].style.background
}
color[0].addEventListener("input", () => setcolor(color[0].value, color[1].value))
color[1].addEventListener("input", () => setcolor(color[0].value, color[1].value))
const search = document.querySelector("main #search")
search.style.display = "none"
const pdf = document.querySelector("main #pdf")
pdf.style.display = "none"
var server = false
var bgd = [] // img elements (can only JSONify img.src)
var cnv = [] // canvas elements (can only JSONify canvas.toDataURL())
var ctx = []
const tempcnv = document.createElement("canvas")
tempcnv.width = WIDTH; tempcnv.height = HEIGHT
const tempctx = tempcnv.getContext("2d")
var page = 0
var drawmode = 0 // 0 = not, 1 = draw, 2 = erase
var drawtime = 0
var istyping = false // typing
var xy0 = [0, 0] // previous cursor position relative to canvas
var xy1 = [0, 0] // current cursor position relative to canvas
var xy2 = [0, 0] // current cursor position relative to document
const kchar = ["`1234567890-=qwertyuiop[]\\asdfghjkl;'zxcvbnm,./ ", '~!@#$%^&*()_+QWERTYUIOP{}|ASDFGHJKL:"ZXCVBNM<>? ', "ё1234567890-=йцукенгшщзхъ\\фывапролджэячсмитьбю. ", 'Ё!"№;%:?*()_+ЙЦУКЕНГШЩЗХЪ/ФЫВАПРОЛДЖЭЯЧСМИТЬБЮ, ']
const kcode = [192, 49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 189, 187, 81, 87, 69, 82, 84, 89, 85, 73, 79, 80, 219, 221, 220, 65, 83, 68, 70, 71, 72, 74, 75, 76, 186, 222, 90, 88, 67, 86, 66, 78, 77, 188, 190, 191, 32]
var lang = 0 // 0 english, 1 russian

tools[0].addEventListener("click", () => {
	bgd[page].classList.add("hide"); cnv[page].classList.add("hide")
	for (let i = 0; i < bgd.length; i++) {
		const img = document.createElement("img")
		tempctx.clearRect(0, 0, WIDTH, HEIGHT)
		tempctx.drawImage(bgd[i], 0, 0, WIDTH, HEIGHT)
		tempctx.drawImage(cnv[i], 0, 0, WIDTH, HEIGHT)
		img.src = tempcnv.toDataURL()
		img.addEventListener("click", () => {
			bgd[i].classList.remove("hide"); cnv[i].classList.remove("hide"); page = i
			search.style.display = "none"; search.innerHTML = ""
			editor.style.display = "block"
		})
		search.appendChild(img)
	}
	editor.style.display = "none"
	search.style.display = "block"
})
tools[1].addEventListener("click", () => {
	server.send(JSON.stringify({cmd: 2.0, b: [false], c: [false]}))
})
pdf.addEventListener("change", (e0) => {
	const r = new FileReader()
	r.onload = (e1) => {
		var imgs = []
		const d = atob(e1.target.result.split(",")[1])
		const b = new Uint8Array(Array.from(d, c => c.charCodeAt(0)))
		pdfjsLib.getDocument(b).promise.then(async function(p) {
			for (let i = 1; i <= p.numPages; i++) {
				const g = await p.getPage(i)
				const v = g.getViewport({scale: 1.0})
				const s = Math.min(WIDTH/v.width, HEIGHT/v.height)
				const t = [s, 0, 0, s, (WIDTH-s*v.width)/2, (HEIGHT-s*v.height)/2]
				await g.render({canvasContext: tempctx, viewport: v, transform: t}).promise
				imgs.push(tempcnv.toDataURL())
			}
			server.send(JSON.stringify({cmd: 2.0, b: imgs, c: new Array(imgs.length).fill(false)}))
		})
	}
	r.readAsDataURL(e0.target.files[0]) // readsAsDataURL avoids CORS issues
	pdf.value = ""
})
tools[2].addEventListener("click", () => {pdf.click()})
tools[3].addEventListener("click", async () => {
	const [c] = await navigator.clipboard.read()
	const d = await c.getType(c.types.find(i => i.startsWith("image/")))
	const b = await createImageBitmap(d)
	const s = Math.min(WIDTH/b.width, HEIGHT/b.height)
	tempctx.clearRect(0, 0, WIDTH, HEIGHT)
	tempctx.drawImage(b, (WIDTH-s*b.width)/2, (HEIGHT-s*b.height)/2, s*b.width, s*b.height)
	server.send(JSON.stringify({cmd: 2.0, b: [tempcnv.toDataURL()], c: [false]}))
})
tools[4].addEventListener("click", () => {
	server.send(JSON.stringify({cmd: 2.0, b: [bgd[page].src], c: [false]}))
})
tools[5].addEventListener("click", async () => {
	const d = new jsPDF({orientation: "landscape", unit: "mm", format: "a4"})
	for (let i = 0; i < bgd.length; i++) {
		tempctx.clearRect(0, 0, WIDTH, HEIGHT)
		tempctx.drawImage(bgd[i], 0, 0, WIDTH, HEIGHT)
		tempctx.drawImage(cnv[i], 0, 0, WIDTH, HEIGHT)
		if (i > 0) d.addPage()
		const w = d.internal.pageSize.getWidth()
		d.addImage(tempcnv.toDataURL(), "JPEG", 0, 0, w, w*HEIGHT/WIDTH)
	}
	d.save("slides_download.pdf")
})
async function translate() {
	var x = [0, 0]
	for (let i of text.innerHTML.toLowerCase()) {
		if ("abcdefghijklmnopqrstuvwxyz".includes(i)) {x[0]++}
		else if ("абвгдеёжзийклмнопрстуфхцчшщъыьэюя".includes(i)) {x[1]++}
	}
	x = (x[0] > x[1]) ? ["en", "ru"] : ["ru", "en"]
	x = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${x[0]}&tl=${x[1]}&dt=t&q=${encodeURIComponent(text.innerHTML)}`)
	x = await x.json()
	return([text.innerHTML, x[0][0][0]])
}
function stoptyping() {istyping = false; text.style.display = "none"; document.body.style.cursor = "auto"}
window.addEventListener("keydown", async (e) => {
	if (editor.style.display == "block") {
		if (!istyping && e.key.trim().length == 1) {
			istyping = true; text.innerHTML = kchar[e.shiftKey+2*lang][kcode.indexOf(e.keyCode)]
			text.style.color = color[0].style.background
			text.style.display = "block"; document.body.style.cursor = "none"
		}
		else if (e.key.length == 1) {text.innerHTML += kchar[e.shiftKey+2*lang][kcode.indexOf(e.keyCode)]}
		else if (e.key == "Backspace") {text.innerHTML = text.innerHTML.slice(0, -1)}
		else if (e.key == "Enter") {stoptyping(); server.send(JSON.stringify({cmd: 5.0, pg: page, xy1: xy1, clr: color[0].style.background, str: e.shiftKey ? await translate() : [text.innerHTML]}))}
		else if (e.key == "Escape") {stoptyping()}
		else if (e.key == "Shift" && e.altKey) {lang = (lang+1)%2}
		else if (e.key == "Control") {lang = (lang+1)%2}
		if (e.keyCode == 86 && e.ctrlKey) {stoptyping(); text.innerHTML = await navigator.clipboard.readText()} // ctrl+V
	}
})

function addslides(b, c) { // b and c are arrays of false, img.src, cnv.toDataURL()
	page = bgd.length
	for (let i = 0; i < b.length; i++) {
		const p = page+i
		bgd.push(new Image)
		bgd[p].width = WIDTH; bgd[p].height = HEIGHT
		if (b[i]) bgd[p].src = b[i]
		bgd[p].classList.add("hide")
		slides.appendChild(bgd[p])
		cnv.push(document.createElement("canvas"))
		cnv[p].width = WIDTH; cnv[p].height = HEIGHT
		ctx.push(cnv[p].getContext("2d"))
		ctx[p].font = "14px sans-serif"; ctx[p].textAlign = "center"; ctx[p].textBaseline = "middle"
		if (c[i]) {
			const _i = new Image()
			_i.onload = () => {ctx[p].drawImage(_i, 0, 0, WIDTH, HEIGHT)}
			_i.src = c[i]
		}
		cnv[p].classList.add("hide")
		slides.appendChild(cnv[p])
		cnv[p].addEventListener("mousedown", () => {drawmode = (Date.now()-drawtime < 200) ? 2 : 1; drawtime = Date.now()})
		cnv[p].addEventListener("mousemove", (e) => {
			xy0 = [e.offsetX-e.movementX, e.offsetY-e.movementY]; xy1 = [e.offsetX, e.offsetY]; xy2 = [e.clientX, e.clientY]
			text.style.left = `${xy1[0]}px`; text.style.top = `${xy1[1]}px`
			if (drawmode == 1) {
				server.send(JSON.stringify({cmd: 3.0, pg: p, xy0: xy0, xy1: xy1, clr: color[0].style.background}))
			} else if (drawmode == 2) {
				server.send(JSON.stringify({cmd: 4.0, pg: p, xy0: xy0, xy1: xy1}))
			}
		})
		cnv[p].addEventListener("mouseup", () => {drawmode = 0})
	}
	bgd[page].classList.remove("hide"); cnv[page].classList.remove("hide")
}
function disconnect() {
	server = false; connect.style.display = "block"
	editor.style.display = "none"; search.style.display = "none"
}

connect.addEventListener("click", () => {
	//server = new WebSocket("ws://192.168.1.6:8080/") // for localhost
	server = new WebSocket(`wss://${window.location.host}/`) // for deno deploy
	server.addEventListener("message", (e) => {
		const d = JSON.parse(e.data)
		switch(d.cmd) {
			case 0.0: // connect, first client
				addslides([false], [false])
				break
			case 1.0: // connect, not first client
				var b = []; bgd.forEach((i) => b.push(i.src))
				var c = []; cnv.forEach((i) => c.push(i.toDataURL()))
				server.send(JSON.stringify({cmd: 1.1, s: d.s, b: b, c: c}))
				break
			case 1.2:
				addslides(d.b, d.c)
				break
			case 2.1: // add new, pdf, screenshot, copy
				bgd[page].classList.add("hide"); cnv[page].classList.add("hide")
				addslides(d.b, d.c)
				break
			case 3.1: // draw
				ctx[d.pg].strokeStyle = d.clr
				ctx[d.pg].lineWidth = 2
				ctx[d.pg].beginPath()
				ctx[d.pg].moveTo(d.xy0[0], d.xy0[1])
				ctx[d.pg].lineTo(d.xy1[0], d.xy1[1])
				ctx[d.pg].stroke()
				break
			case 4.1: // erase
				ctx[d.pg].globalCompositeOperation = "destination-out"
				ctx[d.pg].lineWidth = 64
				ctx[d.pg].beginPath()
				ctx[d.pg].moveTo(xy0[0], xy0[1])
				ctx[d.pg].lineTo(xy1[0], xy1[1])
				ctx[d.pg].stroke()
				ctx[d.pg].globalCompositeOperation = "source-over"
				break
			case 5.1: // write
				ctx[d.pg].strokeStyle = d.clr
				ctx[d.pg].fillStyle = d.clr
				if (d.str.length == 1) {
					ctx[d.pg].fillText(d.str[0], d.xy1[0], d.xy1[1])
				} else {
					ctx[d.pg].fillText(d.str[0], d.xy1[0], d.xy1[1]-8)
					ctx[d.pg].fillText(d.str[1], d.xy1[0], d.xy1[1]+8)
				}
				break
		}
	})
	server.onopen = () => {connect.style.display = "none"; editor.style.display = "block"}
	server.onclose = () => {disconnect()}
	server.onerror = () => {disconnect()}
})
