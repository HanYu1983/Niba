package impl

import (
	"app/model/v1/internal/tool/types"
	"encoding/json"

	"github.com/gopherjs/gopherjs/js"
)

func Save(model types.Model) error {
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
	var memonto []byte
	memonto, err = json.Marshal(model)
	if err != nil {
		return err
	}
	js.Global.Get("localStorage").Call("setItem", "model", string(memonto))
	return nil
}
