package titlePage

import (
	v1 "app/model/v1"
	"app/page/title"
	"app/tool/def"
	"app/tool/protocol"
	"app/tool/uidata"
	"testing"
	"time"
	"tool/log"
)

var (
	mockEvt    = make(chan interface{})
	uiSnapshot uidata.UI
)

type Mock struct {
}

func (p Mock) AskCommand() interface{} {
	return <-mockEvt
}

func (p Mock) Install() error {
	return nil
}

func (p Mock) Render(ui uidata.UI) {
	uiSnapshot = ui
}

func (p Mock) RenderRobotMove(ui uidata.UI, robotID string, path []protocol.Position) {

}

func (p Mock) RenderRobotBattle(ui uidata.UI, result protocol.BattleResult) {

}

func (p Mock) RenderTurnStart(ui uidata.UI, player protocol.Player) {

}

func (p Mock) Alert(msg string) {

}

func init() {
	def.View = Mock{}
}

func TestStartPagePhaseBasic(t *testing.T) {
	log.Category[protocol.LogCategoryPhase] = true
	ui := def.DefaultUI
	ui.Model = v1.Model
	wait := make(chan interface{})
	go func() {
		_, err := title.StartPagePhase(ui)
		// rain event
		for range mockEvt {
		}
		wait <- err
	}()
	mockEvt <- struct{}{}
	if uiSnapshot.Actives[uidata.PageStart] == false {
		t.Error("一開始在首頁")
	}
	mockEvt <- uidata.CommandKeyDown{KeyCode: uidata.KeyCodeEnter}
	time.Sleep(time.Second)
	if uiSnapshot.Actives[uidata.PageStart] {
		t.Error("必須離開首頁")
	}
	if uiSnapshot.Actives[uidata.PageLobby] == false {
		t.Error("必須進入lobby")
	}
	if uiSnapshot.Menu1Ds[uidata.Menu1DLobbyMenu].Options[0] != uidata.MenuOptionBuyRobot {
		t.Error("Menu1DLobbyMenu的第一個選項是MenuOptionBuyRobot")
	}
	mockEvt <- uidata.CommandKeyDown{KeyCode: uidata.KeyCodeEnter}
	time.Sleep(time.Second)
	if uiSnapshot.Actives[uidata.PageBuyRobot] == false {
		t.Error("必須進入PageBuyRobot")
	}
	if uiSnapshot.Menus[uidata.PageBuyRobot][uiSnapshot.Focus[uidata.PageBuyRobot]] != uidata.Menu1DRobotListMenu {
		t.Error("PageBuyRobot focus一開始在Menu1DRobotListMenu")
	}
	mockEvt <- uidata.CommandKeyDown{KeyCode: uidata.KeyCodeEnter}
	time.Sleep(time.Second)
	if uiSnapshot.Menus[uidata.PageBuyRobot][uiSnapshot.Focus[uidata.PageBuyRobot]] != uidata.Menu1DBuyOrSellOrElseMenu {
		t.Error("PageBuyRobot focus一開始在Menu1DBuyOrSellOrElseMenu")
	}
	mockEvt <- uidata.CommandKeyDown{KeyCode: uidata.KeyCodeCancel}
	time.Sleep(time.Second)
	if uiSnapshot.Menus[uidata.PageBuyRobot][uiSnapshot.Focus[uidata.PageBuyRobot]] != uidata.Menu1DRobotListMenu {
		t.Error("按cancel回到Menu1DRobotListMenu")
	}
	close(mockEvt)
	err := <-wait
	if err != nil && err != protocol.ErrTerminate {
		t.Error(err)
	}
}
