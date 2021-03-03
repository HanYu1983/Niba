package impl

import (
	"app/model/v1/internal/tool/types"
	"encoding/json"

	"github.com/gopherjs/gopherjs/js"
)

func Load() (types.Model, bool, error) {
	var err error
	defer func() {
		if x := recover(); x != nil {
			switch detail := x.(type) {
			case error:
				err = detail
			default:
				panic(x)
			}
		}
	}()
	memonto := js.Global.Get("localStorage").Call("getItem", "model")
	if memonto == nil {
		return types.Model{}, false, nil
	}
	if memonto == js.Undefined {
		return types.Model{}, false, nil
	}
	var model types.Model
	err = json.Unmarshal([]byte(memonto.String()), &model)
	return model, true, err
}
