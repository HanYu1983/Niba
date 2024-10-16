package viewer

import (
	"app/tool/protocol"
	"app/tool/uidata"
)

type IView interface {
	Install() error
	AskCommand() interface{}
	Alert(msg string)
	Render(ui uidata.UI) (uidata.UI, error)
	RenderRobotMove(ui uidata.UI, robotID string, path []protocol.Position)
	RenderRobotBattle(ui uidata.UI, result protocol.BattleResult)
	RenderTurnStart(ui uidata.UI, player protocol.Player)
}
