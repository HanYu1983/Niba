package cmd

import (
	"app/gameplay"
	"bufio"
	"fmt"
	"os"
)

// StartApp is
func StartApp() {
	defer func() {
		fmt.Println("FighterSha End")
	}()

	defer func() {
		if err := recover(); err != nil {
			fmt.Println(err)
		}
	}()
	view := CmdView{}

	fmt.Println("FighterSha Start")
	scanner := bufio.NewScanner(os.Stdin)

	gameplayCtx := gameplay.DefaultGamePlay
	var err error
WaitCmd:
	for {
		fmt.Print("FighterSha->")

		scanner.Scan()
		text := scanner.Text()
		fmt.Printf("handle cmd [%v]\n", text)

		switch text {
		case "startGameplay":
			gameplayCtx, err = gameplay.Start(gameplay.IView(view), gameplayCtx)
			if err != nil {
				panic(err)
			}
		case "exit":
			break WaitCmd
		}
	}
}
