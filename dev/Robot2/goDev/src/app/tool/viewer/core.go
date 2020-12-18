package viewer

import (
	"app/tool/data"
	"app/tool/ui_data"
)

type IViwer interface {
	Install() error
	AskCommand() interface{}
	Alert(msg interface{})
	Render(ui ui_data.UI)
	RenderRobotMove(gameplay data.Gameplay, robotID string, from data.Position, to data.Position)
}
