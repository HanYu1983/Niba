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
		"QueryMoveRange": func(_x *js.Object, _y *js.Object) interface{} {
			x, y := _x.Int(), _y.Int()
			moveRange, err := QueryMoveRange(queryModel, tool.Position{x, y})
			if err != nil {
				return []interface{}{err.Error(), nil}
			}
			return []interface{}{nil, moveRange}
		},
		"Query": func(_callback *js.Object) interface{} {
			return queryModel
		},
	})
}

func SetQueryModel(ctx tool.Gameplay) {
	queryModel = ctx
}
