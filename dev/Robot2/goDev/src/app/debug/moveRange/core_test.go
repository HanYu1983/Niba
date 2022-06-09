package moveRange

import (
	"app/debug/helper"
	v1 "app/model/v1"
	"app/page/gameplay"
	"app/tool/def"
	"app/tool/protocol"
	"app/tool/uidata"
	"fmt"
	"testing"
	"time"
	"tool/log"
)

var (
	mockModel = v1.DefaultModel
	mockView  = helper.CreateMockView()
)

func init() {
	temp := [][]int{}
	i := 0
	for y := 0; y < 30; y++ {
		row := []int{}
		for x := 0; x < 30; x++ {
			row = append(row, 3)
			i++
		}
		temp = append(temp, row)
	}
	const (
		playerAI1 = "ai1"
	)
	mockModel.App.Gameplay.Players = map[string]protocol.Player{
		protocol.PlayerIDPlayer: {ID: protocol.PlayerIDPlayer, GroupID: "0"},
		playerAI1:               {ID: playerAI1, GroupID: "1"},
	}
	mockModel.App.Gameplay.PlayerOrder = []string{protocol.PlayerIDPlayer, playerAI1}
	mockModel.App.Gameplay.ActivePlayerID = protocol.PlayerIDPlayer
	mockModel.App.Gameplay.Map = temp
	mockModel.App.Gameplay.Units = []string{"0", "1"}
	mockModel.App.Gameplay.Robots = map[string]protocol.Robot{"0": {
		ID:                 "0",
		ProtoID:            "gundam",
		PlayerID:           protocol.PlayerIDPlayer,
		WeaponsByTransform: map[string]protocol.Weapons{},
	}, "1": {
		ID:                 "1",
		ProtoID:            "gundam",
		PlayerID:           protocol.PlayerIDPlayer,
		WeaponsByTransform: map[string]protocol.Weapons{},
	}}
	mockModel.App.Gameplay.Positions = map[string]protocol.Position{"0": {0, 0}, "1": {5, 5}}

	def.View = &mockView
}

func TestMoveRange(t *testing.T) {
	log.Category[protocol.LogCategoryPhase] = true
	ui := def.DefaultUI
	ui.Model = mockModel
	wait := make(chan interface{})
	go func() {
		_, err := gameplay.GameLoop(ui)
		// rain event
		for range mockView.Evt {
		}
		wait <- err
	}()
	mockView.Evt <- struct{}{}
	if pos, has := mockView.UI.GameplayPages[uidata.PageGameplay].Positions["0"]; (has == false || pos != protocol.Position{0, 0}) {
		t.Error("(0,0)必須有機體")
	}
	// if len(mockView.UI.GameplayPages[uidata.PageGameplay].MoveRange) == 0 {
	// 	t.Error("(0,0)位置有機體, 必須有移動範圍")
	// }
	mockView.Evt <- uidata.CommandKeyDown{KeyCode: uidata.KeyCodeRight}
	time.Sleep(time.Second)
	if len(mockView.UI.GameplayPages[uidata.PageGameplay].MoveRange) > 0 {
		t.Error("向右移動一格, 沒有機體, 必須沒有移動範圍")
	}

	mockView.Evt <- uidata.CommandKeyDown{KeyCode: uidata.KeyCodeLeft}
	mockView.Evt <- uidata.CommandKeyDown{KeyCode: uidata.KeyCodeEnter}
	time.Sleep(time.Second)
	unitMenu := mockView.UI.Menu2Ds[uidata.Menu2DUnitMenu]
	fmt.Printf("%+v\n", unitMenu)
	if len(unitMenu.Options) == 0 {
		t.Error("必須有選單")
	}
	if unitMenu.Options[0][0] != uidata.MenuOptionMove {
		t.Error("第一個選項必須是移動")
	}
	mockView.Evt <- uidata.CommandKeyDown{KeyCode: uidata.KeyCodeEnter}
	time.Sleep(time.Second)

	mockView.Evt <- uidata.CommandKeyDown{KeyCode: uidata.KeyCodeRight}
	mockView.Evt <- uidata.CommandKeyDown{KeyCode: uidata.KeyCodeEnter}
	time.Sleep(time.Second)
	if pos := mockView.UI.GameplayPages[uidata.PageGameplay].Positions["0"]; (pos != protocol.Position{1, 0}) {
		t.Error("(1,0)必須有機體")
	}
	//fmt.Printf("%+v\n", mockView.UI)
	close(mockView.Evt)
	err := <-wait
	if err != nil && err != protocol.ErrTerminate {
		t.Error(err)
	}
}
