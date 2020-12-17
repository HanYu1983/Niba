package app

import (
	"app/lib"
	"app/tool/ui_data"
)

var (
	view = lib.View
)

func Main() {
	view.Install()
	StartUI(ui_data.DefaultUI)
}
