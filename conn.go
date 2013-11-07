package uzo

import (
	"net/http"
)

type Conn struct {
	transport *JSONPPolling
	channel chan *Message
}

func (c Conn) write (msg string) {
	c.transport.write(msg, &c)
}

func NewConn (w http.ResponseWriter, r *http.Request) Conn {
	debug("Creating a new connection...")
	transport := &JSONPPolling{Transport{w, r}}
	return Conn{transport, make(chan *Message) }
}
