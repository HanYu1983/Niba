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

func (p Cocos) Render(origin uidata.UI) (uidata.UI, error) {
	view := js.Global.Get("View")
	if view == js.Undefined {
		fmt.Println("view not ready")
		return origin, nil
	}
	ctx := origin
	for pageID, active := range ctx.Actives {
		if active == false {
			continue
		}
		ctxObj, err := ctx.Model.ObservePage(ctx, pageID)
		if err != nil {
			return origin, err
		}
		ctx = ctxObj.(uidata.UI)
	}
	model := ctx.Model
	ctx.Model = nil
	view.Call("Render", ctx)
	ctx.Model = model
	return ctx, nil
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

func (p Cocos) RenderRobotBattle(ui uidata.UI, result protocol.BattleResult) {
	// @TODO: world to local
	wait := make(chan interface{})
	view := js.Global.Get("View")
	if view == js.Undefined {
		fmt.Println("view not ready")
		return
	}
	result = result.MapPosition(func(pos protocol.Position) protocol.Position {
		return helper.World2Local(ui.GameplayPages[uidata.PageGameplay].Camera, pos)
	})
	result = result.MapRobot(func(robot protocol.Robot) protocol.Robot {
		robot, err := ui.Model.ObserveRobot(robot, true)
		if err != nil {
			fmt.Println(err.Error())
		}
		return robot
	})
	view.Call("RenderRobotBattle", result, func() {
		go func() {
			close(wait)
		}()
	})
	<-wait
}

func (p Cocos) RenderTurnStart(ui uidata.UI, player protocol.Player) {
	wait := make(chan interface{})
	view := js.Global.Get("View")
	if view == js.Undefined {
		fmt.Println("view not ready")
		return
	}
	view.Call("RenderTurnStart", player, func() {
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
