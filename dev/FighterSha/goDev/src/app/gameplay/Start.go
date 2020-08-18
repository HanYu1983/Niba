package gameplay

import (
	"encoding/json"
	"fmt"
	"time"
	"tool/desktop"

	"github.com/gopherjs/gopherjs/js"
)

func NextPlayer(gameplayCtx *Gameplay, player Player) Player {
	return player
}

func DrawCard(gameplayCtx *Gameplay, player Player, cnt int) error {
	return nil
}

func Equip(gameplayCtx *Gameplay, player Player, card desktop.Card) error {
	return nil
}

func AskCommand(gameplayCtx *Gameplay, player Player) (interface{}, error) {
	wait := make(chan interface{})
	go func() {
		js.Global.Get("View").Call("AskCommand", player, map[string]interface{}{
			"CmdUseCard": func(cardID *js.Object) {
				go func() {
					targetCS := gameplayCtx.Desktop.CardStacks[player.ID]
					for _, _card := range targetCS {
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

func Render(gameplayCtx *Gameplay) {
	js.Global.Get("View").Call("Render", *gameplayCtx)
}

func Alert(msg interface{}) {
	switch t := msg.(type) {
	case error:
		fmt.Println(t.Error())
	case string:
		fmt.Println(t)
	default:
		panic(msg)
	}
}

// Start is
func Start(gameplayCtx *Gameplay) error {
	var err error
	Render(gameplayCtx)
	activePlayer := gameplayCtx.Players["A"]
Turn:
	for {
		time.Sleep(1 * time.Second)
		// 清空狀態
		gameplayCtx.PlayerBasicComs[activePlayer.ID] = PlayerBasicCom{}
		// 抽2
		err = DrawCard(gameplayCtx, activePlayer, 2)
		if err != nil {
			return err
		}
	Menu:
		for {
			time.Sleep(1 * time.Second)
			// 準備回復點
			// golang不是函數式語言, slice和map都無法deep copy,
			// 所以必須手動
			memonto, err := json.Marshal(gameplayCtx)
			if err != nil {
				return err
			}
			resetMemonto := func(memonto []byte) func(*Gameplay) {
				return func(gameplay *Gameplay) {
					err2 := json.Unmarshal(memonto, gameplay)
					if err2 != nil {
						panic(err2)
					}
					Render(gameplayCtx)
				}
			}(memonto)

			// 等玩家指令
			cmd, err := AskCommand(gameplayCtx, activePlayer)
			if err != nil {
				Alert(err)
				resetMemonto(gameplayCtx)
				continue
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
						Alert(err)
						resetMemonto(gameplayCtx)
						break
					}
					err = Attack(gameplayCtx, activePlayer, target, card)
					if err != nil {
						Alert(err)
						resetMemonto(gameplayCtx)
						break
					}

				case CardTypeSteal:
					// 盜

				case CardTypeStealMoney:
					// 劫

				case CardTypeArm, CardTypeArmor, CardTypeAccessory:
					// 裝備

				default:
					panic(fmt.Errorf("card.CardPrototypeID.CardType %v not found", card))
				}

			case CmdExit:
				break Turn

			case CmdEndTurn:
				break Menu

			default:
				panic(fmt.Errorf("%v not found", cmd))
			}
		}

		// 下個玩家
		activePlayer = NextPlayer(gameplayCtx, activePlayer)
	}

	return nil
}
