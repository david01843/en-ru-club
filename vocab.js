const toggle = document.querySelector("#vocab button")
toggle.addEventListener("click", (e) => {
	lang = (lang+1)%2
	labelkeys()
	active = null
	audio.lang = ["ru", "en"][lang]
	prompt.innerHTML = ""
	answer.innerHTML = ""
	words.innerHTML = ""
	e.target.blur()
})
const keys = document.querySelectorAll("#vocab .row p")
const prompt = document.querySelector("#vocab #prompt")
const answer = document.querySelector("#vocab #answer")
const controls = document.querySelectorAll("#vocab #controls p")
readxlsx = document.querySelector("#vocab input")
readxlsx.onchange = (e1) => {
	const f = e1.target.files[0]
	if (!f) return
	const r = new FileReader()
	r.onload = (e2) => {
		const w = XLSX.read(e2.target.result, {type: "array"})
		const j = XLSX.utils.sheet_to_json(w.Sheets[w.SheetNames[0]], {header: 1})
		for (let i = 0; i < j.length; i++) {addword(j[i][0].trim(), j[i][1].trim())}
		e1.target.value = ''
	}
	r.readAsArrayBuffer(f)
	cycle()
}
controls[0].addEventListener("click", () => {readxlsx.click()})
controls[1].addEventListener("click", () => {
	let a = Array.from(document.querySelectorAll("#words p"))
	for (let i = a.length-1; i > 0; i--) {
		let j = Math.floor(Math.random()*(i+1))
		let k = a[i]; a[i] = a[j]; a[j] = k
	}
	a.slice(10).forEach(i => i.remove())
	cycle()
})
controls[2].addEventListener("click", () => {
	Array.from(document.querySelectorAll("#words p")).forEach(i => i.remove())
	cycle()
})
controls[3].addEventListener("click", () => {
	for (let i = 0; i < exdata[0].length; i++) {addword(exdata[lang][i], exdata[(lang+1)%2][i])}
	cycle()
})
controls[4].addEventListener("click", () => {
	var d = []
	document.querySelectorAll("#vocab #words p").forEach(i => d.push([i.dataset.ans, i.innerHTML]))
	const b = XLSX.utils.book_new()
	const s = XLSX.utils.aoa_to_sheet(d)
	XLSX.utils.book_append_sheet(b, s, "Sheet1")
	XLSX.writeFile(b, "words_download.xlsx")
})
words = document.querySelector("#vocab #words")
exdata = [["ноль", "один", "два", "три", "четыре", "пять", "шесть", "семь", "восемь", "девять", "десять"], ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"]]
chars = ["ё1234567890-=йцукенгшщзхъ\\фывапролджэячсмитьбю,", "`1234567890-=qwertyuiop[]\\asdfghjkl;'zxcvbnm,./"]
codes = [192, 49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 189, 187, 81, 87, 69, 82, 84, 89, 85, 73, 79, 80, 219, 221, 220, 65, 83, 68, 70, 71, 72, 74, 75, 76, 186, 222, 90, 88, 67, 86, 66, 78, 77, 188, 190, 191]
shift = false
lang = 0
active = null
audio = new SpeechSynthesisUtterance()
audio.lang = "ru"
labelkeys()
clear.click()

function labelkeys() {for (let i = 0; i < 47; i++) {keys[i].innerHTML = chars[lang][i]}}
function addword(s1, s2) {
	w = document.createElement("p")
	w.dataset.ans = s1 // answer
	w.innerHTML = s2 // prompt
	w.addEventListener("click", () => {w.remove()})
	words.appendChild(w)
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
	active = Array.from(words.querySelectorAll("p")).filter(i => i != active)
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
	if (codes.includes(e.keyCode)) {answer.innerHTML += chars[lang][codes.indexOf(e.keyCode)]; check()}
	else if (e.keyCode == 8) {answer.innerHTML = answer.innerHTML.slice(0, -1); check()}
	else if (e.keyCode == 13) {
		if (!active) {cycle()}
		else if (answer.style.color == "limegreen") {if (shift) {active.remove()}; cycle()}
		else {answer.innerHTML = active.dataset.ans; check()}
	}
	else if (e.keyCode == 16) {shift = 1}
	else if (e.keyCode == 32) {answer.innerHTML += " "; check()}
})
document.addEventListener("keyup", (e) => {if (e.keyCode == 16) {shift = 0}})
