package cmd

import (
	"app/gameplay"
	"app/view"
	"bufio"
	"fmt"
	"os"
)

// AskCommand is
func (v CmdView) AskCommand(gameplayCtx gameplay.Gameplay, player gameplay.Player) (interface{}, error) {
	scanner := bufio.NewScanner(os.Stdin)
	for {
		fmt.Print("AskCommand->")

		scanner.Scan()
		text := scanner.Text()
		fmt.Printf("handle cmd [%v]\n", text)

		switch text {
		case "query":
			v.Render(gameplayCtx)
		case "useCard":
			fmt.Print("useCard->")
			scanner.Scan()
			cardID := scanner.Text()
			targetCS := gameplayCtx.Desktop.CardStacks[player.ID]
			for _, _card := range targetCS {
				if _card.ID == cardID {
					return view.CmdUseCard{Card: _card}, nil
				}
			}
			fmt.Printf("card not found %v\n", cardID)
		case "endTurn":
			return view.CmdEndTurn{}, nil
		case "exit":
			return view.CmdExit{}, nil
		default:
		}
	}
}
