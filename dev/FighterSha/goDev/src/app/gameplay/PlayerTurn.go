package gameplay

import (
	"app/view"
	"fmt"
	"time"
	"tool/desktop"
)

func PlayerTurn(ctx IView, origin Gameplay, activePlayer Player) (Gameplay, error) {
	var err error
	var playerNotFound Player
	moneyNotEnough := fmt.Errorf("Money is not enougth")
	gameplayCtx := origin
	// 清空狀態
	gameplayCtx.PlayerBasicComs = AssocStringPlayerBasicCom(gameplayCtx.PlayerBasicComs, activePlayer.ID, PlayerBasicCom{})

	if HasAbilityHealing(gameplayCtx, activePlayer) {
		gameplayCtx, err = UpdateCharacterCom(gameplayCtx, activePlayer, func(com CharacterCardCom) (CharacterCardCom, error) {
			com.Life++
			return com, nil
		})
		if err != nil {
			return origin, err
		}
	}

	// 抽2
	gameplayCtx, err = DrawCard(ctx, gameplayCtx, activePlayer, 2)
	if err != nil {
		return origin, err
	}
	ctx.Render(gameplayCtx)

	outOfCard := len(gameplayCtx.Desktop.CardStacks[CardStackHome]) == 0
	if outOfCard {
		gameplayCtx.EndState.Completed = true
		gameplayCtx.EndState.Reason = "牌庫抽完了, 遊戲結束"
		ctx.Render(gameplayCtx)
		return gameplayCtx, nil
	}

Menu:
	for {
		time.Sleep(1 * time.Second)
		ctx.Render(gameplayCtx)
		if gameplayCtx.EndState.Completed {
			return gameplayCtx, nil
		}

		// 等玩家指令
		cmd, err := ctx.AskCommand(gameplayCtx, activePlayer)
		if err != nil {
			ctx.Alert(err)
			continue
		}
		ctx.Alert(fmt.Sprintf("%v選了指令%+v", activePlayer.ID, cmd))
		// 跳過回合
		if cmd == nil {
			// cancel
			continue
		}
		switch cmdDetail := cmd.(type) {
		case view.CmdBuyItem:
			switch cmdDetail.ItemID {
			case view.ItemIDPower:
				ctx.Alert(fmt.Sprintf("%v使用力量藥", activePlayer.ID))

				gameplayCtx, err = SwapGameplay(gameplayCtx, func(origin Gameplay) (Gameplay, error) {
					gameplayCtx := origin
					otherPlayers := FilterPlayer(ValsStringPlayer(gameplayCtx.Players), func(p Player) bool {
						return p.ID != activePlayer.ID
					})
					target, err := ctx.AskOnePlayer(gameplayCtx, activePlayer, otherPlayers)
					if err != nil {
						return origin, err
					}
					if target == playerNotFound {
						return origin, fmt.Errorf("%v取消", target.ID)
					}
					gameplayCtx, err = UpdateCharacterCom(gameplayCtx, activePlayer, func(characterCom CharacterCardCom) (CharacterCardCom, error) {
						if characterCom.Money < 2 {
							return characterCom, moneyNotEnough
						}
						characterCom.Money -= 2
						return characterCom, nil
					})
					if err != nil {
						return origin, err
					}
					gameplayCtx, err = Attack(ctx, gameplayCtx, activePlayer, target)
					if err != nil {
						return origin, err
					}
					return gameplayCtx, nil
				})
				if err != nil {
					ctx.Alert(err.Error())
					err = nil
					break Menu
				}
				ctx.Render(gameplayCtx)
			case view.ItemIDPotion:
				ctx.Alert(fmt.Sprintf("%v使用恢復藥", activePlayer.ID))
				gameplayCtx, err = SwapGameplay(gameplayCtx, func(origin Gameplay) (Gameplay, error) {
					gameplayCtx := origin
					gameplayCtx, err = UpdateCharacterCom(gameplayCtx, activePlayer, func(characterCom CharacterCardCom) (CharacterCardCom, error) {
						if characterCom.Money < 2 {
							return characterCom, moneyNotEnough
						}
						characterCom.Money -= 2
						return characterCom, nil
					})
					if err != nil {
						return origin, err
					}
					gameplayCtx, err = UpdateCharacterCom(gameplayCtx, activePlayer, func(characterCom CharacterCardCom) (CharacterCardCom, error) {
						characterCom.Life++
						return characterCom, nil
					})
					return gameplayCtx, nil
				})
				if err != nil {
					ctx.Alert(err.Error())
					err = nil
					break Menu
				}
				ctx.Render(gameplayCtx)
			case view.ItemIDInt:
				ctx.Alert(fmt.Sprintf("%v使用智慧藥", activePlayer.ID))
				gameplayCtx, err = SwapGameplay(gameplayCtx, func(origin Gameplay) (Gameplay, error) {
					gameplayCtx := origin
					gameplayCtx, err = UpdateCharacterCom(gameplayCtx, activePlayer, func(characterCom CharacterCardCom) (CharacterCardCom, error) {
						if characterCom.Money < 2 {
							return characterCom, moneyNotEnough
						}
						characterCom.Money -= 2
						return characterCom, nil
					})
					if err != nil {
						return origin, err
					}
					gameplayCtx, err = DrawCard(ctx, gameplayCtx, activePlayer, 1)
					if err != nil {
						return origin, err
					}
					return gameplayCtx, nil
				})
				if err != nil {
					ctx.Alert(err.Error())
					err = nil
					break Menu
				}
				ctx.Render(gameplayCtx)
			default:
				return origin, fmt.Errorf("can not handle item here: %+v", cmdDetail)
			}
		case view.CmdUseCard:
			// 使用一張卡
			card := cmdDetail.Card
			if HasAbilityAttackWithAnyCard(gameplayCtx, activePlayer) {
				switch card.CardPrototypeID.CardType {
				case CardTypeAttack:
				default:
					var answer string
					if answer, err = ctx.AskOption(gameplayCtx, activePlayer, "沒有使用殺, 是否要當成殺", []string{"Yes", "No"}); answer == "Yes" {
						gameplayCtx, err = SwapGameplay(gameplayCtx, func(origin Gameplay) (Gameplay, error) {
							gameplayCtx := origin
							otherPlayers := FilterPlayer(ValsStringPlayer(gameplayCtx.Players), func(p Player) bool {
								return p.ID != activePlayer.ID
							})
							// 殺
							target, err := ctx.AskOnePlayer(gameplayCtx, activePlayer, otherPlayers)
							if err != nil {
								return origin, err
							}
							if target == playerNotFound {
								return origin, fmt.Errorf("user cancel action")
							}
							gameplayCtx, card, err = MoveCard(ctx, gameplayCtx, CardStackIDHand(activePlayer), CardStackGravyard, func(card desktop.Card) desktop.Card {
								card.Face = desktop.FaceUp
								return card
							}, card)
							if err != nil {
								return origin, err
							}
							gameplayCtx, err = Attack(ctx, gameplayCtx, activePlayer, target)
							if err != nil {
								return origin, err
							}
							return gameplayCtx, nil
						})
						if err != nil {
							ctx.Alert(err.Error())
							err = nil
							break Menu
						}
						ctx.Render(gameplayCtx)
						continue
					}
					if err != nil {
						return origin, nil
					}
				}
			}
			switch card.CardPrototypeID.CardType {
			case CardTypeAttack:
				ctx.Alert(fmt.Sprintf("%v使出殺", activePlayer.ID))

				gameplayCtx, err = SwapGameplay(gameplayCtx, func(origin Gameplay) (Gameplay, error) {
					gameplayCtx := origin
					otherPlayers := FilterPlayer(ValsStringPlayer(gameplayCtx.Players), func(p Player) bool {
						return p.ID != activePlayer.ID
					})
					// 殺
					target, err := ctx.AskOnePlayer(gameplayCtx, activePlayer, otherPlayers)
					if err != nil {
						return origin, err
					}
					if target == playerNotFound {
						return origin, fmt.Errorf("user cancel action")
					}

					gameplayCtx, card, err = MoveCard(ctx, gameplayCtx, CardStackIDHand(activePlayer), CardStackGravyard, func(card desktop.Card) desktop.Card {
						card.Face = desktop.FaceUp
						return card
					}, card)
					if err != nil {
						return origin, err
					}

					gameplayCtx, err = Attack(ctx, gameplayCtx, activePlayer, target)
					if err != nil {
						return origin, err
					}
					return gameplayCtx, nil
				})
				if err != nil {
					ctx.Alert(err.Error())
					err = nil
					break Menu
				}
				ctx.Render(gameplayCtx)
			case CardTypeSteal:
				ctx.Alert(fmt.Sprintf("%v使出盜", activePlayer.ID))

				gameplayCtx, err = SwapGameplay(gameplayCtx, func(origin Gameplay) (Gameplay, error) {
					gameplayCtx := origin
					otherPlayers := FilterPlayer(ValsStringPlayer(gameplayCtx.Players), func(p Player) bool {
						return p.ID != activePlayer.ID
					})
					// 盜
					target, err := ctx.AskOnePlayer(gameplayCtx, activePlayer, otherPlayers)
					if err != nil {
						return origin, err
					}
					if target == playerNotFound {
						return origin, fmt.Errorf("user cancel action")
					}

					gameplayCtx, card, err = MoveCard(ctx, gameplayCtx, CardStackIDHand(activePlayer), CardStackGravyard, func(card desktop.Card) desktop.Card {
						card.Face = desktop.FaceUp
						return card
					}, card)
					if err != nil {
						return origin, err
					}

					gameplayCtx, err = Steal(ctx, gameplayCtx, activePlayer, target)
					if err != nil {
						return origin, err
					}

					return gameplayCtx, nil
				})
				if err != nil {
					ctx.Alert(err.Error())
					err = nil
					break Menu
				}
				ctx.Render(gameplayCtx)
			case CardTypeStealMoney:
				ctx.Alert(fmt.Sprintf("%v使出劫", activePlayer.ID))
				gameplayCtx, err = SwapGameplay(gameplayCtx, func(origin Gameplay) (Gameplay, error) {
					gameplayCtx := origin
					otherPlayers := FilterPlayer(ValsStringPlayer(gameplayCtx.Players), func(p Player) bool {
						return p.ID != activePlayer.ID
					})
					// 盜
					target, err := ctx.AskOnePlayer(gameplayCtx, activePlayer, otherPlayers)
					if err != nil {
						return origin, err
					}
					if target == playerNotFound {
						return origin, fmt.Errorf("user cancel action")
					}

					gameplayCtx, card, err = MoveCard(ctx, gameplayCtx, CardStackIDHand(activePlayer), CardStackGravyard, func(card desktop.Card) desktop.Card {
						card.Face = desktop.FaceUp
						return card
					}, card)
					if err != nil {
						return origin, err
					}

					gameplayCtx, err = StealMoney(ctx, gameplayCtx, activePlayer, target)
					if err != nil {
						return origin, err
					}

					return gameplayCtx, nil
				})
				if err != nil {
					ctx.Alert(err.Error())
					err = nil
					break Menu
				}
				ctx.Render(gameplayCtx)
			case CardTypeArm, CardTypeArmor, CardTypeAccessory, CardTypeGrind, CardTypeBarrier:
				// 裝備
				gameplayCtx, err = Equip(ctx, gameplayCtx, activePlayer, card)
				if err != nil {
					ctx.Alert(err)
				}
				ctx.Render(gameplayCtx)
			case CardTypeJob:
				gameplayCtx, err = SwapGameplay(gameplayCtx, func(origin Gameplay) (Gameplay, error) {
					gameplayCtx := origin
					gameplayCtx, card, err = MoveCard(ctx, gameplayCtx, CardStackIDHand(activePlayer), CardStackGravyard, func(card desktop.Card) desktop.Card {
						card.Face = desktop.FaceUp
						return card
					}, card)
					if err != nil {
						return origin, err
					}

					gameplayCtx, err = UpdateCharacterCom(gameplayCtx, activePlayer, func(characterCom CharacterCardCom) (CharacterCardCom, error) {
						characterCom.Money += 2
						return characterCom, nil
					})
					if err != nil {
						return origin, err
					}
					return gameplayCtx, nil
				})
				if err != nil {
					ctx.Alert(err.Error())
					err = nil
					break Menu
				}
				ctx.Render(gameplayCtx)
			case CardTypeMake:
				gameplayCtx, err = SwapGameplay(gameplayCtx, func(origin Gameplay) (Gameplay, error) {
					gameplayCtx := origin
					gameplayCtx, card, err = MoveCard(ctx, gameplayCtx, CardStackIDHand(activePlayer), CardStackGravyard, func(card desktop.Card) desktop.Card {
						card.Face = desktop.FaceUp
						return card
					}, card)
					if err != nil {
						return origin, err
					}

					gameplayCtx, err = DrawCard(ctx, gameplayCtx, activePlayer, 2)
					if err != nil {
						return origin, err
					}
					return gameplayCtx, nil
				})
				if err != nil {
					ctx.Alert(err.Error())
					err = nil
					break Menu
				}
				ctx.Render(gameplayCtx)
			default:
				ctx.Alert(fmt.Sprintf("不能使用這類型的卡%v\n", card))
			}
			ctx.Render(gameplayCtx)
		case view.CmdSellCard:
			card := cmdDetail.Card
			switch card.CardPrototypeID.CardType {
			case CardTypeArm, CardTypeArmor, CardTypeAccessory, CardTypeGrind, CardTypeBarrier:
				gameplayCtx, err = SwapGameplay(gameplayCtx, func(origin Gameplay) (Gameplay, error) {
					gameplayCtx := origin
					gameplayCtx, card, err = MoveCard(ctx, gameplayCtx, CardStackIDHand(activePlayer), CardStackGravyard, func(card desktop.Card) desktop.Card {
						card.Face = desktop.FaceUp
						return card
					}, card)
					if err != nil {
						return origin, err
					}

					gameplayCtx, err = UpdateCharacterCom(gameplayCtx, activePlayer, func(characterCom CharacterCardCom) (CharacterCardCom, error) {
						characterCom.Money++
						return characterCom, nil
					})
					if err != nil {
						return origin, err
					}
					return gameplayCtx, nil
				})
				if err != nil {
					ctx.Alert(err.Error())
					err = nil
					break Menu
				}
				ctx.Render(gameplayCtx)
			default:
				ctx.Alert(fmt.Sprintf("不能賣掉這類型的卡%v\n", card))
			}
		case view.CmdExit:
			gameplayCtx.EndState.Completed = true
			gameplayCtx.EndState.Reason = "User Exit"
			return gameplayCtx, nil

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
	ctx.Render(gameplayCtx)

	return gameplayCtx, nil
}
