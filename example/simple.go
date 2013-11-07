package main

import (
	"fmt"
	"net/http"
	"github.com/azer/uzo"
)

type Hello struct{}

func (h Hello) ServeHTTP (w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "<html><script src='/uzoio/index.js'></script>Hello!</html>")
}

func main() {
	var server Hello

	http.ListenAndServe("0.0.0.0:4000", uzo.OnOpen(server, func (io uzo.IO) {
		io.Pub("{ \"foo\": 123 }")

		io.Sub(func (msg *uzo.Message) {
			fmt.Printf("New message: %s @ %s \n", msg.Content, msg.Ts)
		})
	}))
}
