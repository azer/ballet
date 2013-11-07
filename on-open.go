package uzo

import (
	"fmt"
	"net/http"
	"strings"
	"strconv"
)

type NewConnectionCallback func(IO)

type Proxy struct {
	origin http.Handler
	OnNewConnection NewConnectionCallback
}

func (p *Proxy) ServeHTTP (w http.ResponseWriter, r *http.Request) {
	url := r.URL.String()

	if len(url) >= 6 && url[0:6] == "/uzoio" {
		p.Route(w, r)
		return
	}

	p.origin.ServeHTTP(w, r)
}

func (p *Proxy) Route (w http.ResponseWriter, r *http.Request) {
	url := r.URL.String()
	path := url[6:]

	debug("Routing %s", path)

	if (path == "/new" || path == "/new/") {
		io := NewIO(w, r)
		io.HandShake()
		return
	}

	if (strings.Contains(path, "/continue")) {
		clientID, _ := strconv.Atoi(path[10:len(path)-1])
		io := ContinueIO(clientID, w, r)
		p.OnNewConnection(io)
		return
	}

	if (path == "/index.js") {
		ServeJSDist(w, r)
		return
	}

	fmt.Fprint(w, "\n\n    Valid endpoints: \n      * /new \n      * /continue \n      * /index.js \n\n")
}

func OnOpen (server http.Handler, callback NewConnectionCallback) *Proxy {
	debug("Setting up Uzo Proxy")
	return &Proxy{ server, callback }
}

func ServeJSDist (w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "client/dist/uzo.js") // FIXME
}
