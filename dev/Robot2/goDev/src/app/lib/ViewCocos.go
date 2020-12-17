package lib

import (
	"app/data"
	"app/tool/ui_data"
)

type ViewCocos struct{}

func (p ViewCocos) AskCommand() interface{} {
	return nil
}

func (p ViewCocos) Install() error {
	return nil
}

func (p ViewCocos) Render(app ui_data.UI) {
}

func (p ViewCocos) Alert(msg interface{}) {
}

func (p ViewCocos) RenderRobotMove(gameplay data.Gameplay, robotID string, from data.Position, to data.Position) {

}
