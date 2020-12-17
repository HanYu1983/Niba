package p5

import (
	"app/data"
	"app/tool/ui_data"

	"github.com/gopherjs/gopherjs/js"
)

var (
	eventQueue = make(chan interface{})
	app        ui_data.UI
)

func Render(_app ui_data.UI) {
	js.Global.Get("console").Call("log", _app)
	app = _app
}

func AskCommand() interface{} {
	return <-eventQueue
}

func Install() error {
	js.Global.Get("p5").New(func(p *js.Object) {
		_p5 := p

		_p5.Set("keyPressed", func(e *js.Object) {
			keyCode := e.Get("keyCode").Int()
			eventQueue <- data.CommandKeyDown{KeyCode: keyCode}
		})

		_p5.Set("keyReleased", func(e *js.Object) {
			keyCode := e.Get("keyCode").Int()
			eventQueue <- data.CommandKeyUp{KeyCode: keyCode}
		})

		_p5.Set("setup", func() {
			p.Call("createCanvas", 640, 480)
		})

		_p5.Set("draw", func() {
			_p5.Call("background", 0)
			_p5.Call("fill", 100)
		})
	}, "canvas")
	return nil
}
