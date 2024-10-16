package helper

import (
	"app/tool/protocol"
	"app/tool/uidata"
	"fmt"
)

type MockView struct {
	Evt chan interface{}
	UI  uidata.UI
}

func CreateMockView() MockView {
	return MockView{Evt: make(chan interface{})}
}

func (p *MockView) AskCommand() interface{} {
	return <-p.Evt
}

func (p *MockView) Install() error {
	return nil
}

func (p *MockView) Render(origin uidata.UI) (uidata.UI, error) {
	ctx := origin
	for pageID, active := range ctx.Actives {
		if active == false {
			continue
		}
		ctxObj, err := ctx.Model.ObservePage(ctx, pageID)
		if err != nil {
			return origin, err
		}
		ctx = ctxObj.(uidata.UI)
	}
	p.UI = ctx
	return ctx, nil
}

func (p *MockView) RenderRobotMove(ui uidata.UI, robotID string, path []protocol.Position) {
	fmt.Printf("[RenderRobotMove]%v\n", robotID)
}

func (p *MockView) RenderRobotBattle(ui uidata.UI, result protocol.BattleResult) {
	fmt.Printf("[RenderRobotBattle]%v\n", result)
}

func (p *MockView) RenderTurnStart(ui uidata.UI, player protocol.Player) {
	fmt.Printf("[RenderTurnStart]%v\n", player)
}

func (p *MockView) Alert(msg string) {
	fmt.Printf("[Alert]%v\n", msg)
}
