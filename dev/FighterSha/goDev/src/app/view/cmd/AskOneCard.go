package cmd

import (
	"app/gameplay"
	"bufio"
	"fmt"
	"os"
	"strconv"
	"tool/desktop"
)

// AskOneCard 等待玩家選一張卡
func (view CmdView) AskOneCard(gameplayCtx gameplay.Gameplay, player gameplay.Player, targetCS desktop.CardStack, validFn func(desktop.Card) bool) (desktop.Card, error) {
	if len(targetCS) == 0 {
		return desktop.Card{}, nil
	}
	scanner := bufio.NewScanner(os.Stdin)
	for {
		fmt.Println("==Cards==")
		for i, card := range targetCS {
			fmt.Printf("%v) %+v\n", i, card)
		}
		fmt.Print("AskOneCard->")
		scanner.Scan()
		idxStr := scanner.Text()
		if idxStr == "exit" {
			return desktop.Card{}, nil
		}
		idx, err := strconv.Atoi(idxStr)
		if err != nil {
			fmt.Println("Please enter integer")
			continue
		}
		if idx >= len(targetCS) {
			fmt.Println("Please enter valid integer")
			continue
		}
		pickCard := targetCS[idx]
		if validFn(pickCard) == false {
			fmt.Printf("card invalid %+v\n", pickCard)
			continue
		}
		return pickCard, nil
	}
}
