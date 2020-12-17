package lib

import (
	"app/data"
	"app/tool/ui_data"
	"app/view/p5"

	"github.com/gopherjs/gopherjs/js"
)

type ViewP5 struct {
}

func (p ViewP5) AskCommand() interface{} {
	return p5.AskCommand()
}

func (p ViewP5) Install() error {
	return p5.Install()
}

func (p ViewP5) Render(ui ui_data.UI) {
	p5.Render(ui)
}

func (p ViewP5) Alert(msg interface{}) {
	js.Global.Get("alert").Invoke(msg)
}

func (p ViewP5) RenderRobotMove(gameplay data.Gameplay, robotID string, from data.Position, to data.Position) {

}
