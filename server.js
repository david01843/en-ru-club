// run server for local test
// cd "/home/david/Desktop/website/"
// deno run --allow-read --allow-write --allow-net --allow-env --allow-sys server.js
// between localhost and deno deploy, toggle lines in both rwd.js and server.js

import {serve} from "https://deno.land/std@0.224.0/http/server.ts"
import {serveDir} from "https://deno.land/std@0.224.0/http/file_server.ts"

const WIDTH = 1000; const HEIGHT = 707 // landscape 297mm x 210mm
var clients = []

function sendall(d) {
	clients.forEach((c) => {
		if (c.readyState == WebSocket.OPEN) c.send(JSON.stringify(d))
	})
}

serve(async (request) => {
	if (request.headers.get("upgrade") === "websocket") {
		const {socket, response} = Deno.upgradeWebSocket(request)
		socket.onopen = () => {
			clients.push(socket); const l = clients.length
			if (l == 1) {
				socket.send(JSON.stringify({cmd: 0.0}))
			} else {
				clients[0].send(JSON.stringify({cmd: 1.0, s: l-1}))
			}
		}
		socket.onmessage = (e) => {
			const d = JSON.parse(e.data)
			switch (d.cmd) {
				case 1.1:
					clients[d.s].send(JSON.stringify({cmd: 1.2, b: d.b, c: d.c})); break
				case 2.0:
					sendall({cmd: 2.1, b: d.b, c: d.c}); break
				case 3.0:
					sendall({cmd: 3.1, pg: d.pg, xy0: d.xy0, xy1: d.xy1, clr: d.clr}); break
				case 4.0:
					sendall({cmd: 4.1, pg: d.pg, xy0: d.xy0, xy1: d.xy1}); break
				case 5.0:
					sendall({cmd: 5.1, pg: d.pg, xy1: d.xy1, clr: d.clr, str: d.str}); break
			}
		}
		socket.onclose = () => {
			const index = clients.indexOf(socket)
			if (index > -1) clients.splice(index, 1)
		}
		socket.onerror = () => {
			const index = clients.indexOf(socket)
			if (index > -1) clients.splice(index, 1)
		}
		return response
	}
	return serveDir(request, {fsRoot: ".", showDirListing: false, enableCors: true })
//}, {port: 8080}) // for localhost
}) // for deno deploy

