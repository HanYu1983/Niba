package gameplay

import (
	"app/view"
	"fmt"
	"time"
	"tool/desktop"
)

func Equip(ctx IView, gameplayCtx Gameplay, player Player, card desktop.Card) error {
	ctx.Alert(fmt.Sprintf("Equip: %+v %+v", player, card))
	return nil
}

func End(ctx IView, gameplayCtx Gameplay) (Gameplay, error) {
	ctx.Alert("Game End")
	ctx.Render(gameplayCtx)
	return gameplayCtx, nil
}

func Start(ctx IView, origin Gameplay) (Gameplay, error) {
	var err error
	gameplayCtx := origin
Turn:
	for {
		time.Sleep(1 * time.Second)
		activePlayer := gameplayCtx.Players[gameplayCtx.ActivePlayerID]
		ctx.Render(gameplayCtx)

		// 清空狀態
		gameplayCtx.PlayerBasicComs = AssocStringPlayerBasicCom(gameplayCtx.PlayerBasicComs, activePlayer.ID, PlayerBasicCom{})

		// 抽2
		gameplayCtx, err = DrawCard(ctx, gameplayCtx, activePlayer, 2)
		if err != nil {
			return origin, err
		}

		outOfCard := len(gameplayCtx.Desktop.CardStacks[CardStackHome]) == 0
		if outOfCard {
			fmt.Printf("牌庫抽完了, 遊戲結束\n")
			gameplayCtx, err = End(ctx, gameplayCtx)
			if err != nil {
				return origin, err
			}
			return gameplayCtx, nil
		}

	Menu:
		for {
			time.Sleep(1 * time.Second)

			// 等玩家指令
			cmd, err := ctx.AskCommand(gameplayCtx, activePlayer)
			if err != nil {
				ctx.Alert(err)
				continue
			}

			// 跳過回合
			if cmd == nil {
				// cancel
				continue
			}
			switch cmdDetail := cmd.(type) {
			case view.CmdUseCard:
				// 使用一張卡
				card := cmdDetail.Card
				switch card.CardPrototypeID.CardType {
				case CardTypeAttack:
					// 殺
					target, err := ctx.AskOnePlayer(gameplayCtx, activePlayer, gameplayCtx.Players)
					if err != nil {
						ctx.Alert(err)
						break
					}
					gameplayCtx, err = Attack(ctx, gameplayCtx, activePlayer, target, card)
					if err != nil {
						ctx.Alert(err)
						break
					}

				case CardTypeSteal:
					// 盜
					target, err := ctx.AskOnePlayer(gameplayCtx, activePlayer, gameplayCtx.Players)
					if err != nil {
						ctx.Alert(err)
						break
					}
					gameplayCtx, err = Steal(ctx, gameplayCtx, activePlayer, target, card)
					if err != nil {
						ctx.Alert(err)
						break
					}
				case CardTypeStealMoney:
					// 劫
					target, err := ctx.AskOnePlayer(gameplayCtx, activePlayer, gameplayCtx.Players)
					if err != nil {
						ctx.Alert(err)
						break
					}
					gameplayCtx, err = StealMoney(ctx, gameplayCtx, activePlayer, target, card)
					if err != nil {
						ctx.Alert(err)
						break
					}
				case CardTypeArm, CardTypeArmor, CardTypeAccessory:
					// 裝備

				default:
					fmt.Printf("不能使用這類型的卡%v\n", card)
				}

			case view.CmdExit:
				break Turn

			case view.CmdEndTurn:
				break Menu

			default:
				return origin, fmt.Errorf("%v not found", cmd)
			}
		}

		// 下個玩家
		gameplayCtx, err = NextPlayer(ctx, gameplayCtx, activePlayer)
		if err != nil {
			return origin, err
		}
	}

	return gameplayCtx, nil
}
