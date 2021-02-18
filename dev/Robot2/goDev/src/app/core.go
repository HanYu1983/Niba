package app

import (
	v1 "app/model/v1"
	"app/page/gameplay"
	"app/page/title"
	"app/tool/def"
	"app/tool/protocol"
	"fmt"
	"tool/log"
)

// 有時候在結構中新增欄位後, 在運行時會出現set undefined之類的錯誤
// 原因是gopherjs內部的編譯器會快取, 所以有引用到那個修改的結構的檔案也許需要修改(新增一個隨意結構再儲存), 強迫gopherjs重編譯檔案
// 比如就發生下面的程式碼在golang環境中可以跑, 但在js的環境中會出錯
// 解法是重新修改儲存app/tool/uidata/core.go檔案後就可以了
// {
// 	slot := uidata.BattleMenuSlot{}
// 	slot2 := slot  // <- 這行copy會出錯
// 	fmt.Printf("%+v\n", slot2)
// }
func Main() {
	log.Category[protocol.LogCategoryPhase] = false
	log.Category[protocol.LogCategoryDetail] = true
	log.Category[protocol.LogCategoryWarning] = false
	log.Category[protocol.LogCategoryRender] = false
	view := def.View
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
	var err error
	ui := def.DefaultUI
	ui.Model, err = v1.DefaultModel.New(nil)
	if err != nil {
		panic(err)
	}
	var _ = gameplay.GameLoop
	var _ = title.StartPagePhase
	startPhase := gameplay.GameLoop
	_, err = startPhase(ui)
	if err != nil {
		panic(err)
	}
	log.Log(protocol.LogCategoryPhase, "Main", "end")
}
