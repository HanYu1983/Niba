package viewer

import (
	"app/tool/helper"
	"app/tool/protocol"
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
				//keyCode := evt.Get("keyCode").Int()
				//evtQueue <- uidata.CommandKeyUp{KeyCode: keyCode}
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
	view.Call("Render", app)
}

func (p Cocos) RenderRobotMove(ui uidata.UI, robotID string, path []protocol.Position) {
	for i, local := range path {
		path[i] = helper.World2Local(ui.GameplayPages[uidata.PageGameplay].Camera, local)
	}
	wait := make(chan interface{})
	view := js.Global.Get("View")
	if view == js.Undefined {
		fmt.Println("view not ready")
		return
	}
	view.Call("RenderRobotMove", robotID, path, func() {
		go func() {
			close(wait)
		}()
	})
	<-wait
}

func (p Cocos) RenderRobotBattle(ui uidata.UI, result protocol.BattleResultSet) {
	// @TODO: world to local
	wait := make(chan interface{})
	view := js.Global.Get("View")
	if view == js.Undefined {
		fmt.Println("view not ready")
		return
	}
	view.Call("RenderRobotBattle", result, func() {
		go func() {
			close(wait)
		}()
	})
	<-wait
}

func (p Cocos) Alert(msg string) {
	view := js.Global.Get("View")
	if view == js.Undefined {
		fmt.Println("view not ready")
		return
	}
	view.Call("Alert", msg)
}
