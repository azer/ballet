package uzo

import (
	"net/http"
	"fmt"
	"io"
)

type Transport struct {
	responseWriter http.ResponseWriter
	request *http.Request
}

func (t *Transport) write (msg string) {
	fmt.Fprint(t.responseWriter, msg)
}

type JSONPPolling struct {
	Transport
}

func (t *JSONPPolling) write (msg string, conn *Conn) {
	io.WriteString(t.responseWriter, fmt.Sprintf("__gJC(%s);", msg))
	close(conn.channel)
}
