package moveRange

import (
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
	fmt.Printf("[RenderRobotMove]%v\n", robotID)
}

func (p Mock) RenderRobotBattle(ui uidata.UI, result protocol.BattleResult) {
	fmt.Printf("[RenderRobotBattle]%v\n", result)
}

func (p Mock) RenderTurnStart(ui uidata.UI, player protocol.Player) {
	fmt.Printf("[RenderTurnStart]%v\n", player)
}

func (p Mock) Alert(msg string) {
	fmt.Printf("[Alert]%v\n", msg)
}

var (
	mockModel = v1.Model
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
	mockModel, err = v1.NewRobot(mockModel, protocol.Position{0, 0}, protocol.Robot{
		ID:       RobotA,
		ProtoID:  "gundam",
		PlayerID: protocol.PlayerIDPlayer,
		PilotID:  "pilotA",
	})
	if err != nil {
		panic(err)
	}
	mockModel, err = v1.NewRobot(mockModel, protocol.Position{1, 0}, protocol.Robot{
		ID:       RobotB,
		ProtoID:  "gundam",
		PlayerID: playerAI1,
		PilotID:  "pilotA",
	})
	if err != nil {
		panic(err)
	}
	def.View = Mock{}
}

func TestCore(t *testing.T) {
	log.Category[protocol.LogCategoryPhase] = true
	ui := def.DefaultUI
	ui.Model = mockModel
	wait := make(chan interface{})
	go func() {
		_, err := gameplay.GameLoop(ui)
		for range mockEvt {
		}
		wait <- err
	}()
	mockEvt <- struct{}{}

	mockEvt <- uidata.CommandKeyDown{KeyCode: uidata.KeyCodeEnter}
	time.Sleep(time.Second)
	{
		unitMenu := uiSnapshot.Menu2Ds[uidata.Menu2DUnitMenu]
		if len(unitMenu.Options) == 0 {
			t.Error("必須有選單")
		}
	}
	{
		robotMenu := uiSnapshot.GameplayPages[uidata.PageGameplay].RobotMenu
		if robotMenu.Active == false {
			t.Error("robotMenu.Active must be true")
		}
		weaponIdx := 1
		if robotMenu.RowFunctionMapping[weaponIdx] != protocol.RobotMenuFunctionWeapon {
			t.Error("cursor1必須是武器選單")
		}
		if robotMenu.Weapons["weapon_0"].ProtoID != "beam_sword1" {
			t.Error("第一個武器必須是光束劍")
		}
	}
	{
		robotB := uiSnapshot.GameplayPages[uidata.PageGameplay].Robots[RobotB]
		if robotB.HP != robotB.MaxHP {
			t.Error("robotB必須滿血")
		}
		if robotB.EN != robotB.MaxEN {
			t.Error("robotB必須滿EN")
		}
	}
	fmt.Println("選單中選擇武器")
	mockEvt <- uidata.CommandKeyDown{KeyCode: uidata.KeyCodeDown}
	mockEvt <- uidata.CommandKeyDown{KeyCode: uidata.KeyCodeEnter}
	fmt.Println("選擇敵機")
	mockEvt <- uidata.CommandKeyDown{KeyCode: uidata.KeyCodeRight}
	mockEvt <- uidata.CommandKeyDown{KeyCode: uidata.KeyCodeEnter}
	fmt.Println("戰鬥選單按下武器確定")
	mockEvt <- uidata.CommandKeyDown{KeyCode: uidata.KeyCodeEnter}
	time.Sleep(time.Second)
	{
		robotB := uiSnapshot.GameplayPages[uidata.PageGameplay].Robots[RobotB]
		if robotB.HP == robotB.MaxHP {
			t.Error("robotB必須扣血")
		}
	}
	// fmt.Printf("%+v\n", uiSnapshot)
	close(mockEvt)
	err := <-wait
	if err != nil && err != protocol.ErrTerminate {
		t.Error(err)
	}
}
