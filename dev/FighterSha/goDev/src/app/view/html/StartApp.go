package html

import (
	"app/gameplay"
	"fmt"

	"github.com/gopherjs/gopherjs/js"
)

// StartApp is
func StartApp() {
	view := HTMLView{}
	gameplayCtx := gameplay.DefaultGamePlay

	js.Global.Set("Model", map[string]interface{}{
		"StartGameplay": func() {
			// JS呼叫的要用goroutine包裝, 不然chan和time.Sleep等blocking的都不能用
			go func() {
				nextGameplayCtx, err := gameplay.Start(gameplay.IView(view), gameplayCtx)
				if err != nil {
					fmt.Println(err.Error())
				}
				gameplayCtx = nextGameplayCtx
			}()
		},
	})
}
