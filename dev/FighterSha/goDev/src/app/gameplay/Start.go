package gameplay

import (
	"app/view"
	"fmt"
	"time"
	"tool/desktop"
)

func End(ctx IView, gameplayCtx Gameplay) (Gameplay, error) {
	ctx.Alert("Game End")
	ctx.Render(gameplayCtx)
	return gameplayCtx, nil
}

func Start(ctx IView, origin Gameplay) (Gameplay, error) {
	var err error
	var playerNotFound Player
	gameplayCtx := origin
Turn:
	for {
		time.Sleep(1 * time.Second)
		activePlayer := gameplayCtx.Players[gameplayCtx.ActivePlayerID]

		// 清空狀態
		gameplayCtx.PlayerBasicComs = AssocStringPlayerBasicCom(gameplayCtx.PlayerBasicComs, activePlayer.ID, PlayerBasicCom{})

		// 抽2
		gameplayCtx, err = DrawCard(ctx, gameplayCtx, activePlayer, 2)
		if err != nil {
			return origin, err
		}
		ctx.Render(gameplayCtx)

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
					if target == playerNotFound {
						ctx.Alert("user cancel action")
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
					if target == playerNotFound {
						ctx.Alert("user cancel action")
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
					if target == playerNotFound {
						ctx.Alert("user cancel action")
						break
					}
					gameplayCtx, err = StealMoney(ctx, gameplayCtx, activePlayer, target, card)
					if err != nil {
						ctx.Alert(err)
						break
					}
				case CardTypeArm, CardTypeArmor, CardTypeAccessory, CardTypeGrind, CardTypeBarrier:
					// 裝備
					gameplayCtx, err = Equip(ctx, gameplayCtx, activePlayer, card)
					if err != nil {
						ctx.Alert(err)
						break
					}
				case CardTypeJob:
					gameplayCtx, err = UpdateCharacterCom(gameplayCtx, activePlayer, func(characterCom CharacterCardCom) CharacterCardCom {
						characterCom.Money += 2
						return characterCom
					})
					if err != nil {
						return origin, err
					}
				case CardTypeMake:
					gameplayCtx, err = DrawCard(ctx, gameplayCtx, activePlayer, 2)
					if err != nil {
						return origin, err
					}
				default:
					ctx.Alert(fmt.Sprintf("不能使用這類型的卡%v\n", card))
				}
			case view.CmdSellCard:
				card := cmdDetail.Card
				switch card.CardPrototypeID.CardType {
				case CardTypeArm, CardTypeArmor, CardTypeAccessory, CardTypeGrind, CardTypeBarrier:
					nextHand, err := desktop.RemoveCard(gameplayCtx.Desktop.CardStacks[CardStackIDHand(activePlayer)], card)
					if err != nil {
						return origin, err
					}
					card.Face = desktop.FaceUp
					nextGravyard := append(gameplayCtx.Desktop.CardStacks[CardStackGravyard], card)
					gameplayCtx.Desktop.CardStacks = desktop.MergeStringCardStack(gameplayCtx.Desktop.CardStacks, map[string]desktop.CardStack{
						CardStackIDHand(activePlayer): nextHand,
						CardStackGravyard:             nextGravyard,
					})

					gameplayCtx, err = UpdateCharacterCom(gameplayCtx, activePlayer, func(characterCom CharacterCardCom) CharacterCardCom {
						characterCom.Money++
						return characterCom
					})
					if err != nil {
						return origin, err
					}
				default:
					ctx.Alert(fmt.Sprintf("不能賣掉這類型的卡%v\n", card))
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
