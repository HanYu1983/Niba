package gameplay

import (
	"encoding/json"
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

type CmdExit struct{}
type CmdEndTurn struct{}

func Render(gameplayCtx Gameplay) {
	js.Global.Get("View").Call("Render", gameplayCtx)
}

func Alert(msg string) {
	fmt.Println(msg)
}

// Start is
func Start(gameplayCtx Gameplay) (Gameplay, error) {
	var err error
	Render(gameplayCtx)
	activePlayer := gameplayCtx.Players["A"]
Turn:
	for {
		time.Sleep(1 * time.Second)

		// 清空狀態
		gameplayCtx.PlayerBasicComs[activePlayer.ID] = PlayerBasicCom{}

		// 抽2
		gameplayCtx, err = DrawCard(gameplayCtx, activePlayer, 2)
		if err != nil {
			return gameplayCtx, err
		}

		for {
			time.Sleep(1 * time.Second)
			// 準備回復點
			// golang不是函數式語言, slice和map都無法deep copy,
			// 所以必須手動
			memonto, err := json.Marshal(gameplayCtx)
			if err != nil {
				return gameplayCtx, err
			}
			// 只要panic就回到上一個回復點
			defer func(memonto []byte) {
				if err := recover(); err != nil {
					err2 := json.Unmarshal(memonto, &gameplayCtx)
					if err2 != nil {
						panic(err2)
					}
					Render(gameplayCtx)
					switch e := err.(type) {
					case error:
						Alert(e.Error())
					case string:
						Alert(e)
					default:
						panic(err)
					}
				}
			}(memonto)

			// 等玩家指令
			cmd, err := AskCommand(gameplayCtx, activePlayer)
			if err != nil {
				panic(err)
			}

			// 跳過回合
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
						panic(err)
					}
					gameplayCtx, err = Attack(gameplayCtx, activePlayer, target, card)
					if err != nil {
						panic(err)
					}

				case CardTypeSteal:
					// 盜
					target, err := AskOnePlayer(gameplayCtx, activePlayer, gameplayCtx.Players)
					if err != nil {
						panic(err)
					}
					gameplayCtx, err = Steal(gameplayCtx, activePlayer, target, card)
					if err != nil {
						panic(err)
					}

				case CardTypeStealMoney:
					// 劫
					target, err := AskOnePlayer(gameplayCtx, activePlayer, gameplayCtx.Players)
					if err != nil {
						panic(err)
					}
					gameplayCtx, err = StealMoney(gameplayCtx, activePlayer, target, card)
					if err != nil {
						panic(err)
					}

				case CardTypeArm, CardTypeArmor, CardTypeAccessory:
					// 裝備
					gameplayCtx, err := Equip(gameplayCtx, activePlayer, card)
					if err != nil {
						panic(err)
					}

				default:
					panic(fmt.Errorf("%v not found", card))
				}

			case CmdExit:
				break Turn

			case CmdEndTurn:
				break

			default:
				panic(fmt.Errorf("%v not found", cmd))
			}
		}

		// 下個玩家
		activePlayer := NextPlayer(gameplayCtx, activePlayer)
	}

	return gameplayCtx, nil
}
