package lib

import (
	"app/data"
)

type ViewCocos struct{}

func (p ViewCocos) AskCommand() interface{} {
	return nil
}

func (p ViewCocos) Install() error {
	return nil
}

func (p ViewCocos) Render(app data.App) {
}

func (p ViewCocos) Alert(msg interface{}) {
}

func (p ViewCocos) RenderRobotMove(gameplay data.Gameplay, robotID string, from data.Position, to data.Position) {

}
