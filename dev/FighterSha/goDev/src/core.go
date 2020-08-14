package main

import (
	"app"
	"fmt"
)

func init() {
	defer func() {
		if err := recover(); err != nil {
			fmt.Println(err)
		}
	}()
	gameplay := app.DefaultGamePlay
	var _ = gameplay
	_, err := app.AskOneCard(gameplay, gameplay.Players["A"], gameplay.Desktop.CardStacks[app.CardStackEquip])
	if err != nil {
		panic(err)
	}
	fmt.Println("OK")
}

func main() {

}
