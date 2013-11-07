package uzo

import (
	"math/rand"
	"time"
)

type Clients map[int]*Client

var (
	clients = make(Clients)
)

type Client struct {
	id int
	ts int64
}

func NewClient () *Client {
	client := &Client{rand.Int(), Now()}
	clients[client.id] = client
	return client
}

func ReturningClient (id int) (*Client, bool) {
	record, isStillOnline := clients[id]

	if !isStillOnline {
		return NewClient(), true
	}

	record.ts = Now()

	return record, false
}

func Now () int64 {
  return time.Now().UnixNano()
}
