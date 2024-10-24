package lib

import (
	"app2/data"
	"app2/view/p5"

	"github.com/gopherjs/gopherjs/js"
)

type Viwer interface {
	Install() error
	AskCommand() interface{}
	Alert(msg interface{})
	Render(data.App)
	RenderRobotMove(gameplay data.Gameplay, robotID string, from data.Position, to data.Position)
}

var (
	View Viwer = ViewP5{}
)

type ViewP5 struct {
}

func (p ViewP5) AskCommand() interface{} {
	return p5.AskCommand()
}

func (p ViewP5) Install() error {
	return p5.Install()
}

func (p ViewP5) Render(app data.App) {
	p5.Render(app)
}

func (p ViewP5) Alert(msg interface{}) {
	js.Global.Get("alert").Invoke(msg)
}

func (p ViewP5) RenderRobotMove(gameplay data.Gameplay, robotID string, from data.Position, to data.Position) {

}
