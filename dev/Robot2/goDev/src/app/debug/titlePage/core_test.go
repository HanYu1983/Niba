package titlePage

import (
	"app/debug/helper"
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
	mockView = helper.CreateMockView()
)

func init() {
	def.View = &mockView
}

func TestStartPagePhaseBasic(t *testing.T) {
	log.Category[protocol.LogCategoryPhase] = true
	ui := def.DefaultUI
	ui.Model = v1.Model
	wait := make(chan interface{})
	go func() {
		_, err := title.StartPagePhase(ui)
		// rain event
		for range mockView.Evt {
		}
		wait <- err
	}()
	mockView.Evt <- struct{}{}
	if mockView.UI.Actives[uidata.PageStart] == false {
		t.Error("一開始在首頁")
	}
	mockView.Evt <- uidata.CommandKeyDown{KeyCode: uidata.KeyCodeEnter}
	time.Sleep(time.Second)
	if mockView.UI.Actives[uidata.PageStart] {
		t.Error("必須離開首頁")
	}
	if mockView.UI.Actives[uidata.PageLobby] == false {
		t.Error("必須進入lobby")
	}
	if mockView.UI.Menu1Ds[uidata.Menu1DLobbyMenu].Options[0] != uidata.MenuOptionBuyRobot {
		t.Error("Menu1DLobbyMenu的第一個選項是MenuOptionBuyRobot")
	}
	mockView.Evt <- uidata.CommandKeyDown{KeyCode: uidata.KeyCodeEnter}
	time.Sleep(time.Second)
	if mockView.UI.Actives[uidata.PageBuyRobot] == false {
		t.Error("必須進入PageBuyRobot")
	}
	if mockView.UI.Menus[uidata.PageBuyRobot][mockView.UI.Focus[uidata.PageBuyRobot]] != uidata.Menu1DRobotListMenu {
		t.Error("PageBuyRobot focus一開始在Menu1DRobotListMenu")
	}
	mockView.Evt <- uidata.CommandKeyDown{KeyCode: uidata.KeyCodeEnter}
	time.Sleep(time.Second)
	if mockView.UI.Menus[uidata.PageBuyRobot][mockView.UI.Focus[uidata.PageBuyRobot]] != uidata.Menu1DBuyOrSellOrElseMenu {
		t.Error("PageBuyRobot focus一開始在Menu1DBuyOrSellOrElseMenu")
	}
	mockView.Evt <- uidata.CommandKeyDown{KeyCode: uidata.KeyCodeCancel}
	time.Sleep(time.Second)
	if mockView.UI.Menus[uidata.PageBuyRobot][mockView.UI.Focus[uidata.PageBuyRobot]] != uidata.Menu1DRobotListMenu {
		t.Error("按cancel回到Menu1DRobotListMenu")
	}
	close(mockView.Evt)
	err := <-wait
	if err != nil && err != protocol.ErrTerminate {
		t.Error(err)
	}
}
