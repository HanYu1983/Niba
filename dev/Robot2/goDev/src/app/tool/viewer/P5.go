package viewer

import (
	"app/tool/data"
	"app/tool/uidata"
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

func (p P5) Render(ui uidata.UI) {
	p5.Render(ui)
}

func (p P5) Alert(msg string) {
	js.Global.Get("alert").Invoke(msg)
}

func (p P5) RenderRobotMove(gameplay data.Gameplay, robotID string, from data.Position, to data.Position) {

}
