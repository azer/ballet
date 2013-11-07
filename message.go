package uzo

import (
	"time"
)

type Message struct {
	Content string
	Ts int64
}

func NewMessage (text string) *Message {
	return &Message{text, time.Now().UnixNano()}
}
