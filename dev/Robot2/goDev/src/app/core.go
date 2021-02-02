package app

import (
	v1 "app/model/v1"
	"app/page/gameplay"
	"app/page/title"
	"app/tool/def"
	"app/tool/protocol"
	"app/tool/uidata"
	"fmt"
	"tool/log"
)

func Main() {
	log.Category[protocol.LogCategoryPhase] = true
	log.Category[protocol.LogCategoryDetail] = true
	view := def.View
	model := &v1.DefaultModel
	def.Model = model
	uidata.DefaultUI.Model = model

	defer func() {
		if x := recover(); x != nil {
			fmt.Printf("error: %v\n", x)
			switch detail := x.(type) {
			case string:
				view.Alert(detail)
			case error:
				view.Alert(detail.Error())
			default:
				view.Alert(fmt.Sprintf("%v", x))
			}
			panic(x)
		}
	}()
	view.Install()

	var _ = gameplay.GameLoop
	var _ = title.StartPagePhase
	startPhase := gameplay.GameLoop
	_, err := startPhase(uidata.DefaultUI)
	if err != nil {
		panic(err)
	}
	fmt.Println("model done")
}
