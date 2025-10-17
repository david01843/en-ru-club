const keys = document.querySelectorAll("#vocab .row p")
const prompt = document.querySelector("#vocab #prompt")
const answer = document.querySelector("#vocab #answer")
const lists = document.querySelector("#vocab #lists")
const controls = document.querySelectorAll("#vocab #controls p")
controls[0].addEventListener("click", () => {readxlsx.click()})
controls[1].addEventListener("click", () => {
	var d = []
	document.querySelectorAll("#vocab #words p").forEach(i => d.push([i.dataset.ans, i.innerHTML]))
	const b = XLSX.utils.book_new()
	const s = XLSX.utils.aoa_to_sheet(d)
	XLSX.utils.book_append_sheet(b, s, "Sheet1")
	XLSX.writeFile(b, "words_download.xlsx")
})
controls[2].addEventListener("click", () => {
	Array.from(document.querySelectorAll("#words p")).forEach(i => i.remove())
	cycle()
})
controls[3].addEventListener("click", () => {
	if (subset == 5) {subset = 3e3; controls[3].innerHTML = "subset off"}
	else {subset = 5; controls[3].innerHTML = "subset on"}
})
const readxlsx = document.querySelector("#vocab input")
readxlsx.onchange = (e1) => {
	const f = e1.target.files[0]
	if (!f) return
	const r = new FileReader()
	r.onload = (e2) => {
		const w = XLSX.read(e2.target.result, {type: "array"})
		const j = XLSX.utils.sheet_to_json(w.Sheets[w.SheetNames[0]], {header: 1})
		for (let i = 0; i < j.length; i++) {addword(j[i][0].trim(), j[i][1].trim())}
		shuffle()
		cycle()
	}
	e1.target.value = ''
	r.readAsArrayBuffer(f)
}
words = document.querySelector("#vocab #words")

function labelkeys() {for (let i = 0; i < 47; i++) {keys[i].innerHTML = chars[i]}}
function addword(s1, s2) {
	w = document.createElement("p")
	w.dataset.ans = s1 // answer
	w.innerHTML = s2 // prompt
	w.addEventListener("click", (e) => {e.target.remove()})
	words.appendChild(w)
}
function shuffle() {
	const p = Array.from(words.querySelectorAll('p'))
	p.sort(() => Math.random()-.5)
	p.forEach(p => words.appendChild(p))
}
function check() {
	if (prompt.innerHTML != "") {
		if (answer.innerHTML == active.dataset.ans) {
			answer.style.color = "limegreen"
			speechSynthesis.speak(audio)
		} else if (answer.innerHTML != active.dataset.ans.slice(0, answer.innerHTML.length)) {
			answer.style.color = "red"
		} else {
			answer.style.color = "black"
		}
	}
}
function cycle() {
	active = Array.from(words.querySelectorAll("p")).slice(0, subset).filter(i => i != active)
	if (active.length != 0) {
		active = active[Math.floor(Math.random()*active.length)]
		prompt.innerHTML = active.innerHTML
		audio.text = active.dataset.ans
	} else {
		active = null
		prompt.innerHTML = ""
	}
	answer.innerHTML = ""
	answer.style.color = "black"
	speechSynthesis.cancel()
}
document.addEventListener("keydown", (e) => {
	console.log(e.keyCode)
	if (codes.includes(e.keyCode)) {answer.innerHTML += chars[codes.indexOf(e.keyCode)]; check()}
	else if (e.keyCode == 8) {answer.innerHTML = answer.innerHTML.slice(0, -1); check()}
	else if (e.keyCode == 13) {
		if (!active) {cycle()}
		else if (answer.style.color == "limegreen") {if (shift) {active.remove()}; cycle()}
		else {answer.innerHTML = active.dataset.ans; check()}
	}
	else if (e.keyCode == 16) {shift = 1}
	else if (e.keyCode == 17) {speechSynthesis.cancel(); speechSynthesis.speak(audio)}
	else if (e.keyCode == 32) {answer.innerHTML += " "; check()}
})
document.addEventListener("keyup", (e) => {if (e.keyCode == 16) {shift = 0}})

const chars = "ё1234567890-=йцукенгшщзхъ\\фывапролджэячсмитьбю,"
const codes = [192, 49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 189, 187, 81, 87, 69, 82, 84, 89, 85, 73, 79, 80, 219, 221, 220, 65, 83, 68, 70, 71, 72, 74, 75, 76, 186, 222, 90, 88, 67, 86, 66, 78, 77, 188, 190, 191]
var shift = false
var active = null
var audio = new SpeechSynthesisUtterance()
audio.lang = "ru"
var subset = 3e3
data.forEach(i => {
	var p = document.createElement("p")
	p.innerHTML = i[0]
	p.addEventListener("click", () => {
		for (j = 1; j < i.length; j += 2) {addword(i[j], i[j+1])}
		shuffle()
		cycle()
	})
	lists.appendChild(p)
})
labelkeys()
