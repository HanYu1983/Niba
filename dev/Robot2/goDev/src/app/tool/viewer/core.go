package viewer

import (
	"app/tool/data"
	"app/tool/uidata"
)

type IViwer interface {
	Install() error
	AskCommand() interface{}
	Alert(msg string)
	Render(ui uidata.UI)
	RenderRobotMove(gameplay data.Gameplay, robotID string, from data.Position, to data.Position)
}
