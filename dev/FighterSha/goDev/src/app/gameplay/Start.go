package gameplay

import (
	"fmt"
	"time"
	"tool/desktop"

	"github.com/gopherjs/gopherjs/js"
)

func NextPlayer(gameplay Gameplay, player Player) Player {
	return player
}

func DrawCard(gameplay Gameplay, player Player, cnt int) (Gameplay, error) {
	return gameplay, nil
}

func AskCommand(gameplay Gameplay, player Player) (interface{}, error) {
	return nil, nil
}

type CmdUseCard struct {
	Card desktop.Card
}

func Render(gameplay Gameplay) {
	js.Global.Get("View").Call("Render", gameplay)
}

// Start is
func Start(gameplay Gameplay) (Gameplay, error) {
	Render(gameplay)
	for {
		time.Sleep(1 * time.Second)
		activePlayer := NextPlayer(gameplay, gameplay.Players["A"])
		// 清空狀態
		gameplay.PlayerBasicComs[activePlayer.ID] = PlayerBasicCom{}

		// 抽2
		gameplay, err := DrawCard(gameplay, activePlayer, 2)
		if err != nil {
			return gameplay, err
		}

		// 等玩家指令
		cmd, err := AskCommand(gameplay, activePlayer)
		if err != nil {
			return gameplay, err
		}

		switch cmd.(type) {
		case CmdUseCard:
			// 使用一張卡
			card := cmd.(CmdUseCard).Card
			switch {
			case card.CardPrototypeID.CardType == CardTypeAttack:
				// 殺
				target, err := AskOnePlayer(gameplay, activePlayer, gameplay.Players)
				if err != nil {
					return gameplay, err
				}
				gameplay, err = Attack(gameplay, activePlayer, target, card)
				if err != nil {
					return gameplay, err
				}

			case card.CardPrototypeID.CardType == CardTypeSteal:
				// 盜
				target, err := AskOnePlayer(gameplay, activePlayer, gameplay.Players)
				if err != nil {
					return gameplay, err
				}
				gameplay, err = Steal(gameplay, activePlayer, target, card)
				if err != nil {
					return gameplay, err
				}

			case card.CardPrototypeID.CardType == CardTypeStealMoney:
				// 劫
				target, err := AskOnePlayer(gameplay, activePlayer, gameplay.Players)
				if err != nil {
					return gameplay, err
				}
				gameplay, err = StealMoney(gameplay, activePlayer, target, card)
				if err != nil {
					return gameplay, err
				}
			default:
				return gameplay, fmt.Errorf("%v not found", card)
			}

		default:
			return gameplay, fmt.Errorf("%v not found", cmd)
		}
	}

}
