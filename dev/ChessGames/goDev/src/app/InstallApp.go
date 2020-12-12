package app

import (
	"app/gameplay"
	"app/tool"
	"fmt"

	"github.com/gopherjs/gopherjs/js"
)

var (
	defaultGameplay = tool.Gameplay{Board: tool.DefaultChessBoard}
)

func InstallApp() {
	js.Global.Set("App", map[string]interface{}{
		"StartGame": func() {
			go func() {
				_, err := gameplay.StartGame(defaultGameplay)
				if err != nil {
					fmt.Printf("err: %v\n", err)
				}
			}()
		},
	})
}
