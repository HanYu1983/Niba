package main

import (
	"app"
	"fmt"

	"github.com/gopherjs/gopherjs/js"
)

func StartGameplay() {
	defer func() {
		if err := recover(); err != nil {
			fmt.Println(err)
		}
	}()
	fmt.Println("start")
	gameplay := app.DefaultGamePlay
	gameplay, err := app.Start(gameplay)
	if err != nil {
		panic(err)
	}
}

func init() {
	js.Global.Set("Model", map[string]interface{}{
		"StartGameplay": func() {
			// JS呼叫的要用goroutine包裝
			go StartGameplay()
		},
	})
}

func main() {

}
