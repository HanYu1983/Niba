// This file was automatically generated by genny.
// Any changes will be lost if this file is regenerated.
// see https://github.com/cheekybits/genny

package cmd

import (
	"app/gameplay"
	"bufio"
	"fmt"
	"os"
	"strconv"
	"tool/desktop"
)

// AskOneDesktopCard is
func AskOneDesktopCard(gameplayCtx gameplay.Gameplay, player gameplay.Player, title string, options []desktop.Card, validFn func(desktop.Card) bool) (desktop.Card, error) {
	fmt.Println(title)
	if len(options) == 0 {
		return *new(desktop.Card), nil
	}
	scanner := bufio.NewScanner(os.Stdin)
	for {
		fmt.Println("==DesktopCard==")
		for i, card := range options {
			fmt.Printf("%v) %+v\n", i, card)
		}
		fmt.Print("AskOneDesktopCard->")
		scanner.Scan()
		idxStr := scanner.Text()
		if idxStr == "exit" {
			return *new(desktop.Card), nil
		}
		idx, err := strconv.Atoi(idxStr)
		if err != nil {
			fmt.Println("Please enter integer")
			continue
		}
		if idx >= len(options) {
			fmt.Println("Please enter valid integer")
			continue
		}
		pickCard := options[idx]
		if validFn(pickCard) == false {
			fmt.Printf("card invalid %+v\n", pickCard)
			continue
		}
		return pickCard, nil
	}
}
