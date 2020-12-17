package viewer

import (
	"app/tool/data"
	"app/tool/ui_data"
	"app/view/p5"

	"github.com/gopherjs/gopherjs/js"
)

type P5 struct {
}

func (p P5) AskCommand() interface{} {
	return p5.AskCommand()
}

func (p P5) Install() error {
	return p5.Install()
}

func (p P5) Render(ui ui_data.UI) {
	p5.Render(ui)
}

func (p P5) Alert(msg interface{}) {
	js.Global.Get("alert").Invoke(msg)
}

func (p P5) RenderRobotMove(gameplay data.Gameplay, robotID string, from data.Position, to data.Position) {

}
