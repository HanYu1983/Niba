package gameplay

import (
	"app/common"
	"app/tool/uidata"
)

var (
	view  = common.View
	model = common.Model
)

func Render(ctx uidata.UI) {
	view.Render(ctx)
}
