package uzo

import (
	"net/http"
	"fmt"
)

type Subscriber func(*Message)
type Publisher func(string)

type IO struct {
	client *Client
	conn *Conn
}

func ContinueIO (clientID int, w http.ResponseWriter, r *http.Request) IO {
	conn := NewConn(w, r)
	client, _ := ReturningClient(clientID)
	return IO{client, &conn}
}

func NewIO (w http.ResponseWriter, r *http.Request) IO {
	conn := NewConn(w, r)
	client := NewClient()
	return IO{client, &conn}
}

func (io IO) HandShake () {
	debug("Handshaking with %d", io.client.id)
	io.conn.write(fmt.Sprintf("{ \"handshake\": %d }", io.client.id))
}

func (io IO) Sub (callback Subscriber) {
	debug("Subscribing to updates on Conn/%d", io.client.id)
	for msg := range io.conn.channel {
		callback(msg)
  }
}

func (io IO) Pub (msg string) {
	/*go func(){
		debug("Publishing %s", msg)
		io.conn.channel <- NewMessage(msg)
	}()*/
	debug("Publishing %s", msg)
	io.conn.write(msg)
}
