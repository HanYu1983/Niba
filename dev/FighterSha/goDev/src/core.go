package main

import (
	"app/gameplay"
	"fmt"

	"github.com/gopherjs/gopherjs/js"
)

func startGameplay() {
	defer func() {
		fmt.Println("end")
	}()
	defer func() {
		if err := recover(); err != nil {
			fmt.Println(err)
			panic(err)
		}
	}()
	fmt.Println("start")
	gameplayCtx := gameplay.DefaultGamePlay
	err := gameplay.Start(gameplayCtx)
	if err != nil {
		panic(err)
	}
}

func init() {
	js.Global.Set("Model", map[string]interface{}{
		"StartGameplay": func() {
			// JS呼叫的要用goroutine包裝, 不然chan和time.Sleep等blocking的都不能用
			go startGameplay()
		},
	})
}

func main() {

}
