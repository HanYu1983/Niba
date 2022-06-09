package cmd

import (
	"app/gameplay"
	"app/gameplay/ai"
	"app/view"
	"bufio"
	"fmt"
	"os"
	"tool/desktop"
)

// AskCommand is
func (v CmdView) AskCommand(gameplayCtx gameplay.Gameplay, player gameplay.Player) (interface{}, error) {
	if player.GroupID != gameplay.GroupIDPlayer {
		return ai.AskCommand(gameplayCtx, player)
	}
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
			card, err := v.AskOneCard(gameplayCtx, player, gameplayCtx.Desktop.CardStacks[gameplay.CardStackIDHand(player)], func(card desktop.Card) bool {
				return true
			})
			if err != nil {
				fmt.Println(err.Error())
			} else {
				var cancel = desktop.Card{}
				if card == cancel {
					fmt.Println("cancel useCard")
					break
				}
				return view.CmdUseCard{Card: card}, nil
			}
		case "buyItem":
			var cancel string
			answer, err := v.AskOption(gameplayCtx, player, "買什麼藥?", []string{
				view.ItemIDPower,
				view.ItemIDPotion,
				view.ItemIDDodge,
				view.ItemIDInt,
			})
			if err != nil {
				fmt.Println(err.Error())
				continue
			}
			if answer == cancel {
				continue
			}
			return view.CmdBuyItem{ItemID: answer}, nil
		case "endTurn":
			return view.CmdEndTurn{}, nil
		case "exit":
			return view.CmdExit{}, nil
		default:
		}
	}
}
