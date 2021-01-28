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

func (p Mock) Alert(msg string) {
	fmt.Printf("[Alert]%v\n", msg)
}

var (
	mockModel = v1.DefaultModel
)

func init() {
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
	mockModel.App.Gameplay.Map = temp
	mockModel.App.Gameplay.Units = []string{"0", "1"}
	mockModel.App.Gameplay.Robots = map[string]protocol.Robot{"0": {
		ProtoID: "gundam",
	}, "1": {
		ProtoID: "gundam",
	}}
	mockModel.App.Gameplay.Positions = map[string]protocol.Position{"0": {0, 0}, "1": {5, 5}}

	def.View = Mock{}
	def.Model = protocol.IModel(&mockModel)
}

func TestMoveRange(t *testing.T) {
	wait := make(chan interface{})
	go func() {
		_, err := gameplay.GameLoop(uidata.DefaultUI)
		// rain event
		for range mockEvt {
		}
		wait <- err
	}()
	mockEvt <- struct{}{}
	if len(uiSnapshot.GameplayPages[uidata.PageGameplay].MoveRange) == 0 {
		t.Error("(0,0)位置有機體, 必須有移動範圍")
	}
	mockEvt <- uidata.CommandKeyDown{KeyCode: uidata.KeyCodeRight}
	time.Sleep(time.Second)
	if len(uiSnapshot.GameplayPages[uidata.PageGameplay].MoveRange) > 0 {
		t.Error("向右移動一格, 沒有機體, 必須沒有移動範圍")
	}

	mockEvt <- uidata.CommandKeyDown{KeyCode: uidata.KeyCodeLeft}
	mockEvt <- uidata.CommandKeyDown{KeyCode: uidata.KeyCodeEnter}
	time.Sleep(time.Second)
	unitMenu := uiSnapshot.Menu2Ds[uidata.Menu2DUnitMenu]
	fmt.Printf("%+v\n", unitMenu)
	if len(unitMenu.Options) == 0 {
		t.Error("必須有選單")
	}
	if unitMenu.Options[0][0] != uidata.MenuOptionMove {
		t.Error("第一個必須選項是移動")
	}
	mockEvt <- uidata.CommandKeyDown{KeyCode: uidata.KeyCodeEnter}
	time.Sleep(time.Second)

	mockEvt <- uidata.CommandKeyDown{KeyCode: uidata.KeyCodeEnter}
	time.Sleep(time.Second)

	//fmt.Printf("%+v\n", uiSnapshot)
	close(mockEvt)
	err := <-wait
	if err != nil && err != protocol.ErrTerminate {
		t.Error(err)
	}
}
