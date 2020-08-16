package main

import (
	"app/gameplay"
	"fmt"

	"github.com/gopherjs/gopherjs/js"
)

func StartGameplay() {
	defer func() {
		fmt.Println("end")
	}()
	defer func() {
		if err := recover(); err != nil {
			fmt.Println(err)
		}
	}()
	fmt.Println("start")
	gameplayCtx := gameplay.DefaultGamePlay
	gameplayCtx, err := gameplay.Start(gameplayCtx)
	if err != nil {
		panic(err)
	}
}

func init() {
	js.Global.Set("Model", map[string]interface{}{
		"StartGameplay": func() {
			// JS呼叫的要用goroutine包裝, 不然chan和time.Sleep等blocking的都不能用
			go StartGameplay()
		},
	})
}

func main() {

}
