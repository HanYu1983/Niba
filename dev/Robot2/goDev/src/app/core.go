package app

import (
	"app/tool/def"
	"app/tool/ui_data"
)

var (
	view = def.View
)

func Main() {
	view.Install()
	StartPagePhase(ui_data.DefaultUI)
}
