package viewer

import (
	"app/data"
	"app/tool/ui_data"
)

type Cocos struct{}

func (p Cocos) AskCommand() interface{} {
	return nil
}

func (p Cocos) Install() error {
	return nil
}

func (p Cocos) Render(app ui_data.UI) {
}

func (p Cocos) Alert(msg interface{}) {
}

func (p Cocos) RenderRobotMove(gameplay data.Gameplay, robotID string, from data.Position, to data.Position) {

}
