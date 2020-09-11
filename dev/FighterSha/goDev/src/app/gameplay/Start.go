package gameplay

import (
	"app/view"
	"fmt"
	"time"
	"tool/desktop"
)

func NextPlayer(ctx IView, gameplayCtx Gameplay, player Player) Player {
	ctx.Alert(fmt.Sprintf("NextPlayer: %+v", player))
	return player
}

func DrawCard(ctx IView, gameplayCtx Gameplay, player Player, cnt int) (Gameplay, error) {
	ctx.Alert(fmt.Sprintf("DrawCard: %+v", player))
	return gameplayCtx, nil
}

func Equip(ctx IView, gameplayCtx Gameplay, player Player, card desktop.Card) error {
	ctx.Alert(fmt.Sprintf("Equip: %+v %+v", player, card))
	return nil
}

func Start(ctx IView, origin Gameplay) (Gameplay, error) {
	gameplayCtx := origin
	ctx.Render(gameplayCtx)
	activePlayer := gameplayCtx.Players["A"]

	ctx.Alert(fmt.Sprintf("Start Play ActivePlayer: %+v", activePlayer))
Turn:
	for {
		time.Sleep(1 * time.Second)
		// 清空狀態
		gameplayCtx.PlayerBasicComs = AssocStringPlayerBasicCom(gameplayCtx.PlayerBasicComs, activePlayer.ID, PlayerBasicCom{})

		// 抽2
		gameplayCtx, err := DrawCard(ctx, gameplayCtx, activePlayer, 2)
		if err != nil {
			return origin, err
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
					return origin, fmt.Errorf("card.CardPrototypeID.CardType %v not found", card)
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
		activePlayer = NextPlayer(ctx, gameplayCtx, activePlayer)
	}

	return gameplayCtx, nil
}
