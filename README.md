Real-time Transport Library for Golang. It's under development right now.

## Usage

In Server:

```go
import "github.com/ballet/ballet"

http.ListenAndServe("0.0.0.0:4000", ballet.OnOpen(server, func (io uzo.IO) {
  io.Pub("{ \"foo\": 123 }")

  io.Sub(func (msg *ballet.Message) {
    fmt.Printf("New message: %s @ %s \n", msg.Content, msg.Ts)
  })
}))
```

In Browser:

```js
var io = require('ballet')(':4000')

io.sub(function (message) {
  console.log('< message', message)
})

io.pub({ 'hello': 'world' })
```
