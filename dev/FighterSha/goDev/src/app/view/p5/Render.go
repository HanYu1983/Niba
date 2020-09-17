package p5

import (
	"app/gameplay"
	"fmt"
	"time"

	"github.com/gopherjs/gopherjs/js"
)

// Render is
func (v *P5View) Render(gameplayCtx gameplay.Gameplay) {
	v.Gameplay = gameplayCtx
}

var (
	_p5 = js.Global.Get("p5")
)

func (v *P5View) InstallCanvas() {

	var msg interface{}

	go func() {
		for {
			msg = <-v.AlertPopup
			time.Sleep(3 * time.Second)
			msg = nil
		}
	}()

	_p5.New(func(p *js.Object) {
		p.Set("keyPressed", func(e *js.Object) {
			v.EventChan <- StartGameplayEvent{}
		})

		p.Set("setup", func() {
			p.Call("createCanvas", 640, 480)
		})

		p.Set("draw", func() {
			p.Call("background", 0)
			p.Call("fill", 100)
			p.Call("stroke", 255)
			p.Call("text", fmt.Sprintf("%+v", v.Gameplay), 0, 20)

			if msg != nil {
				p.Call("text", fmt.Sprintf("%+v", msg.(string)), 0, 50)
			}
		})
	}, "canvas")
}
