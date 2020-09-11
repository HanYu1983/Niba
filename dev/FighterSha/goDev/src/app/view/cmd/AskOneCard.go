package cmd

import (
	"app/gameplay"
	"bufio"
	"fmt"
	"os"
	"tool/desktop"
)

// AskOneCard 等待玩家選一張卡
func (view CmdView) AskOneCard(gameplayCtx gameplay.Gameplay, player gameplay.Player, targetCS desktop.CardStack, validFn func(desktop.Card) bool) (desktop.Card, error) {
	scanner := bufio.NewScanner(os.Stdin)
	for {
		fmt.Print("AskOneCard->")
		scanner.Scan()
		cardID := scanner.Text()
		if cardID == "exit" {
			break
		}
		for _, _card := range targetCS {
			if _card.ID == cardID {
				if validFn(_card) == false {
					fmt.Printf("card invalid %v\n", cardID)
					break
				}
				return _card, nil
			}
		}
		fmt.Printf("card not found %v\n", cardID)
	}
	return desktop.Card{}, nil
}
