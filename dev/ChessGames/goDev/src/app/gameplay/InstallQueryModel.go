package gameplay

import (
	"app/tool"

	"github.com/gopherjs/gopherjs/js"
)

var (
	queryModel tool.Gameplay
)

func InstallQueryModel() {
	js.Global.Set("QueryModel", map[string]interface{}{
		"queryMoveRange": func(_x *js.Object, _y *js.Object, _callback *js.Object) {
			go func() {
				x, y := _x.Int(), _y.Int()
				moveRange, err := QueryMoveRange(queryModel, tool.Position{x, y})
				if err != nil {
					_callback.Invoke(err)
					return
				}
				_callback.Invoke(nil, moveRange)
			}()
		},
	})
}

func SetQueryModel(ctx tool.Gameplay) {
	queryModel = ctx
}

func init() {
	InstallQueryModel()
}
