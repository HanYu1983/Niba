package html

import (
	"app/gameplay"
	"fmt"

	"github.com/gopherjs/gopherjs/js"
)

// StartApp is
func StartApp() {
	view := HTMLView{}
	gameplayCtx := gameplay.Gameplay{}

	js.Global.Set("Model", map[string]interface{}{
		"StartGameplay": func() {
			// JS呼叫的要用goroutine包裝, 不然chan和time.Sleep等blocking的都不能用
			go func() {
				nextGameplayCtx, err := gameplay.PrepareGameplay(gameplayCtx)
				if err != nil {
					fmt.Println(err.Error())
					return
				}
				nextGameplayCtx, err = gameplay.Start(gameplay.IView(view), nextGameplayCtx)
				if err != nil {
					fmt.Println(err.Error())
					return
				}
				gameplayCtx = nextGameplayCtx
			}()
		},
	})
}
