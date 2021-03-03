package impl

import (
	"app/model/v1/internal/tool/types"
	"app/tool/protocol"
	"encoding/json"
	"fmt"
	"tool/log"

	"github.com/gopherjs/gopherjs/js"
)

func Save(model types.Model) error {
	log.Log(protocol.LogCategoryPhase, "Save", "start")
	// 注意：json.Marshal不能使用在map[string]array of anything(ex. map[string][]int, map[string]protocol.Position是不行的)，應該是gopherjs的關係。
	// 所以要為map[string]protocol.Position(model.App.Gameplay.Positions)另外存成map[string]interface{}才行
	// app
	positions := model.App.Gameplay.Positions
	{
		model.App.Gameplay.Positions = nil
		txt, err := json.Marshal(model)
		if err != nil {
			return err
		}
		log.Log(protocol.LogCategoryDetail, "Save", string(txt))
		js.Global.Get("localStorage").Call("setItem", "model", string(txt))
	}
	// pos
	{
		tmpPos := map[string]interface{}{}
		for k, v := range positions {
			tmpPos[k] = []interface{}{v[0], v[1]}
		}
		txt, err := json.Marshal(tmpPos)
		if err != nil {
			return err
		}
		js.Global.Get("localStorage").Call("setItem", "positions", string(txt))
	}
	log.Log(protocol.LogCategoryPhase, "Save", "end")
	return nil
}

func Load() (types.Model, bool, error) {
	var err error
	txt := js.Global.Get("localStorage").Call("getItem", "model")
	if txt == nil {
		return types.Model{}, false, nil
	}
	if txt == js.Undefined {
		return types.Model{}, false, nil
	}
	positionsTxt := js.Global.Get("localStorage").Call("getItem", "positions")
	if positionsTxt == nil {
		return types.Model{}, false, fmt.Errorf("must have localStorage.positions")
	}
	if positionsTxt == js.Undefined {
		return types.Model{}, false, fmt.Errorf("must have localStorage.positions")
	}
	var model types.Model
	err = json.Unmarshal([]byte(txt.String()), &model)
	if err != nil {
		return types.Model{}, false, err
	}
	{
		var positions map[string][]int
		err = json.Unmarshal([]byte(positionsTxt.String()), &positions)
		if err != nil {
			return types.Model{}, false, err
		}
		tmpPos := map[string]protocol.Position{}
		for k, v := range positions {
			tmpPos[k] = protocol.Position{v[0], v[1]}
		}
		model.App.Gameplay.Positions = tmpPos
	}
	return model, true, err
}
