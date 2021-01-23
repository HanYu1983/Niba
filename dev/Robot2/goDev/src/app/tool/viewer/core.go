package viewer

import (
	"app/tool/uidata"
)

type IViwer interface {
	Install() error
	AskCommand() interface{}
	Alert(msg string)
	Render(ui uidata.UI)
}
