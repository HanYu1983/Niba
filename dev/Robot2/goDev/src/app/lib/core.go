package lib

import (
	"app/data"
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
