package lib

import (
	"app/data"
	"app/ui"
)

type Viwer interface {
	Install() error
	AskCommand() interface{}
	Alert(msg interface{})
	Render(ui.UI)
	RenderRobotMove(gameplay data.Gameplay, robotID string, from data.Position, to data.Position)
}

var (
	View Viwer = ViewP5{}
)
