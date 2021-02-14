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
	mockModel = v1.Model
	mockView  = helper.CreateMockView()
)

const (
	RobotA = "RobotA"
	RobotB = "RobotB"
)

func init() {
	var err error
	temp := [][]int{}
	i := 0
	for y := 0; y < 30; y++ {
		row := []int{}
		for x := 0; x < 30; x++ {
			row = append(row, i%7)
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
	mockModel.App.Gameplay.Pilots = map[string]protocol.Pilot{
		"pilotA": {ID: "pilotA"},
	}
	mockModel, _, err = v1.NewRobot(mockModel, protocol.Position{0, 0}, protocol.Robot{
		ID:       RobotA,
		ProtoID:  "gundam",
		PlayerID: protocol.PlayerIDPlayer,
		PilotID:  "pilotA",
	})
	if err != nil {
		panic(err)
	}
	mockModel, _, err = v1.NewRobot(mockModel, protocol.Position{1, 0}, protocol.Robot{
		ID:       RobotB,
		ProtoID:  "gundam",
		PlayerID: playerAI1,
		PilotID:  "pilotA",
	})
	if err != nil {
		panic(err)
	}

	def.View = &mockView
}

func TestCore(t *testing.T) {
	log.Category[protocol.LogCategoryPhase] = true
	ui := def.DefaultUI
	ui.Model = mockModel
	wait := make(chan interface{})
	go func() {
		_, err := gameplay.GameLoop(ui)
		for range mockView.Evt {
		}
		wait <- err
	}()
	mockView.Evt <- struct{}{}

	mockView.Evt <- uidata.CommandKeyDown{KeyCode: uidata.KeyCodeEnter}
	time.Sleep(time.Second)
	{
		unitMenu := mockView.UI.Menu2Ds[uidata.Menu2DUnitMenu]
		if len(unitMenu.Options) == 0 {
			t.Error("必須有選單")
		}
	}
	{
		robotMenu := mockView.UI.GameplayPages[uidata.PageGameplay].RobotMenu
		if robotMenu.Active == false {
			t.Error("robotMenu.Active must be true")
		}
		weaponIdx := 1
		if robotMenu.RowFunctionMapping[weaponIdx] != protocol.RobotMenuFunctionWeapon {
			t.Error("cursor1必須是武器選單")
		}
		if robotMenu.Options[weaponIdx][0] != "machinegun1" {
			t.Error("第一個武器必須是機砲")
		}
	}
	{
		robotB := mockView.UI.GameplayPages[uidata.PageGameplay].Robots[RobotB]
		if robotB.HP != robotB.MaxHP {
			t.Error("robotB必須滿血")
		}
		if robotB.EN != robotB.MaxEN {
			t.Error("robotB必須滿EN")
		}
	}
	fmt.Println("選單中選擇武器")
	mockView.Evt <- uidata.CommandKeyDown{KeyCode: uidata.KeyCodeDown}
	mockView.Evt <- uidata.CommandKeyDown{KeyCode: uidata.KeyCodeEnter}
	fmt.Println("選擇敵機")
	mockView.Evt <- uidata.CommandKeyDown{KeyCode: uidata.KeyCodeRight}
	mockView.Evt <- uidata.CommandKeyDown{KeyCode: uidata.KeyCodeEnter}
	fmt.Println("戰鬥選單按下武器確定")
	mockView.Evt <- uidata.CommandKeyDown{KeyCode: uidata.KeyCodeEnter}
	time.Sleep(time.Second)
	{
		robotB := mockView.UI.GameplayPages[uidata.PageGameplay].Robots[RobotB]
		if robotB.HP == robotB.MaxHP {
			t.Error("robotB必須扣血")
		}
	}
	// fmt.Printf("%+v\n", mockView.UI)
	close(mockView.Evt)
	err := <-wait
	if err != nil && err != protocol.ErrTerminate {
		t.Error(err)
	}
}
