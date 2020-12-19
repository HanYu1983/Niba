package p5

import (
	"app/tool/uidata"

	"github.com/gopherjs/gopherjs/js"
)

var (
	eventQueue = make(chan interface{})
	app        uidata.UI
)

func Render(_app uidata.UI) {
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
			go func() {
				keyCode := e.Get("keyCode").Int()
				eventQueue <- uidata.CommandKeyDown{KeyCode: keyCode}
			}()
		})

		_p5.Set("keyReleased", func(e *js.Object) {
			go func() {
				keyCode := e.Get("keyCode").Int()
				eventQueue <- uidata.CommandKeyUp{KeyCode: keyCode}
			}()
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
