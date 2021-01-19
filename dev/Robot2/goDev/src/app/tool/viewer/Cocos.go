package viewer

import (
	"app/tool/data"
	"app/tool/uidata"
	"fmt"

	"github.com/gopherjs/gopherjs/js"
)

var (
	evtQueue = make(chan interface{})
)

type Cocos struct{}

func (p Cocos) AskCommand() interface{} {
	return <-evtQueue
}

func (p Cocos) Install() error {
	js.Global.Set("Model", map[string]interface{}{
		"OnKeyDown": func(evt *js.Object) {
			go func() {
				//js.Global.Get("console").Call("log", evt)
				keyCode := evt.Get("keyCode").Int()
				evtQueue <- uidata.CommandKeyDown{KeyCode: keyCode}
			}()
		},
		"OnKeyUp": func(evt *js.Object) {
			go func() {
				//js.Global.Get("console").Call("log", evt)
				keyCode := evt.Get("keyCode").Int()
				evtQueue <- uidata.CommandKeyUp{KeyCode: keyCode}
			}()
		},
		"Flush": func(evt *js.Object) {
			go func() {
				evtQueue <- uidata.CommandFlush{}
			}()
		},
	})
	return nil
}

func (p Cocos) Render(app uidata.UI) {
	view := js.Global.Get("View")
	if view == js.Undefined {
		fmt.Println("view not ready")
		return
	}
}

func (p Cocos) Alert(msg string) {
	view := js.Global.Get("View")
	if view == js.Undefined {
		fmt.Println("view not ready")
		return
	}
	view.Call("Alert", msg)
}

func (p Cocos) RenderRobotMove(gameplay data.Gameplay, robotID string, from data.Position, to data.Position) {

}
