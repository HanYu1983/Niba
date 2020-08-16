package gameplay

import (
	"fmt"
	"time"
	"tool/desktop"

	"github.com/gopherjs/gopherjs/js"
)

func NextPlayer(gameplayCtx Gameplay, player Player) Player {
	return player
}

func DrawCard(gameplayCtx Gameplay, player Player, cnt int) (Gameplay, error) {
	return gameplayCtx, nil
}

func Equip(gameplayCtx Gameplay, player Player, card Card) (Gameplay, error) {
	return gameplayCtx, nil
}

func AskCommand(gameplayCtx Gameplay, player Player) (interface{}, error) {
	wait := make(chan interface{})
	go func() {
		js.Global.Get("View").Call("AskCommand", player, map[string]interface{}{
			"CmdUseCard": func(cardID *js.Object) {
				go func() {
					targetCS := gameplayCtx.Desktop.CardStacks[player.ID]
					for _, _card := range targetCS.Cards {
						if _card.ID == cardID.String() {
							wait <- CmdUseCard{_card}
							return
						}
					}
					wait <- fmt.Errorf("%v not found", cardID.String())
				}()
			},
			"Cancel": func() {
				// return default of type
				close(wait)
			},
		})
	}()
	cmd := <-wait
	if err, ok := cmd.(error); ok {
		return nil, err
	}
	return cmd, nil
}

type CmdUseCard struct {
	Card desktop.Card
}

func Render(gameplayCtx Gameplay) {
	js.Global.Get("View").Call("Render", gameplayCtx)
}

// Start is
func Start(gameplayCtx Gameplay) (Gameplay, error) {
	Render(gameplayCtx)
	for {
		time.Sleep(1 * time.Second)
		activePlayer := NextPlayer(gameplayCtx, gameplayCtx.Players["A"])
		// 清空狀態
		gameplayCtx.PlayerBasicComs[activePlayer.ID] = PlayerBasicCom{}

		// 抽2
		gameplayCtx, err := DrawCard(gameplayCtx, activePlayer, 2)
		if err != nil {
			return gameplayCtx, err
		}

		// 等玩家指令
		cmd, err := AskCommand(gameplayCtx, activePlayer)
		if err != nil {
			return gameplayCtx, err
		}

		if cmd == nil {
			// cancel
			continue
		}

		switch cmdDetail := cmd.(type) {
		case CmdUseCard:
			// 使用一張卡
			card := cmdDetail.Card
			switch card.CardPrototypeID.CardType {
			case CardTypeAttack:
				// 殺
				target, err := AskOnePlayer(gameplayCtx, activePlayer, gameplayCtx.Players)
				if err != nil {
					return gameplayCtx, err
				}
				gameplayCtx, err = Attack(gameplayCtx, activePlayer, target, card)
				if err != nil {
					return gameplayCtx, err
				}

			case CardTypeSteal:
				// 盜
				target, err := AskOnePlayer(gameplayCtx, activePlayer, gameplayCtx.Players)
				if err != nil {
					return gameplayCtx, err
				}
				gameplayCtx, err = Steal(gameplayCtx, activePlayer, target, card)
				if err != nil {
					return gameplayCtx, err
				}

			case CardTypeStealMoney:
				// 劫
				target, err := AskOnePlayer(gameplayCtx, activePlayer, gameplayCtx.Players)
				if err != nil {
					return gameplayCtx, err
				}
				gameplayCtx, err = StealMoney(gameplayCtx, activePlayer, target, card)
				if err != nil {
					return gameplayCtx, err
				}

			case CardTypeArm, CardTypeArmor, CardTypeAccessory:
				// 裝備
				gameplayCtx, err := Equip(gameplayCtx, activePlayer, card)
				if err != nil {
					return gameplayCtx, err
				}
			default:
				return gameplayCtx, fmt.Errorf("%v not found", card)
			}

		default:
			return gameplayCtx, fmt.Errorf("%v not found", cmd)
		}
	}

}
