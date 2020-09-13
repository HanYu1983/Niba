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
		case view.CmdBuyItem:
			switch cmdDetail.ItemID {
			case view.ItemIDPower:
				otherPlayers := FilterPlayer(ValsStringPlayer(gameplayCtx.Players), func(p Player) bool {
					return p.ID != activePlayer.ID
				})
				target, err := ctx.AskOnePlayer(gameplayCtx, activePlayer, otherPlayers)
				if err != nil {
					return origin, err
				}
				if target == playerNotFound {
					ctx.Alert("user cancel action")
					break
				}
				gameplayCtx, err = UpdateCharacterCom(gameplayCtx, activePlayer, func(characterCom CharacterCardCom) (CharacterCardCom, error) {
					if characterCom.Money < 2 {
						return characterCom, moneyNotEnough
					}
					characterCom.Money -= 2
					return characterCom, nil
				})
				if err == moneyNotEnough {
					ctx.Alert(err.Error())
					break
				}
				if err != nil {
					return origin, err
				}
				gameplayCtx, err = Attack(ctx, gameplayCtx, activePlayer, target)
				if err != nil {
					ctx.Alert(err)
					break
				}
			case view.ItemIDPotion:
				gameplayCtx, err = UpdateCharacterCom(gameplayCtx, activePlayer, func(characterCom CharacterCardCom) (CharacterCardCom, error) {
					if characterCom.Money < 2 {
						return characterCom, moneyNotEnough
					}
					characterCom.Money -= 2
					return characterCom, nil
				})
				if err == moneyNotEnough {
					ctx.Alert(err.Error())
					break
				}
				if err != nil {
					return origin, err
				}
				gameplayCtx, err = UpdateCharacterCom(gameplayCtx, activePlayer, func(characterCom CharacterCardCom) (CharacterCardCom, error) {
					characterCom.Life++
					return characterCom, nil
				})
				if err != nil {
					return origin, err
				}
			case view.ItemIDInt:
				gameplayCtx, err = UpdateCharacterCom(gameplayCtx, activePlayer, func(characterCom CharacterCardCom) (CharacterCardCom, error) {
					if characterCom.Money < 2 {
						return characterCom, moneyNotEnough
					}
					characterCom.Money -= 2
					return characterCom, nil
				})
				if err == moneyNotEnough {
					ctx.Alert(err.Error())
					break
				}
				if err != nil {
					return origin, err
				}
				gameplayCtx, err = DrawCard(ctx, gameplayCtx, activePlayer, 1)
				if err != nil {
					return origin, err
				}
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
						otherPlayers := FilterPlayer(ValsStringPlayer(gameplayCtx.Players), func(p Player) bool {
							return p.ID != activePlayer.ID
						})
						// 殺
						target, err := ctx.AskOnePlayer(gameplayCtx, activePlayer, otherPlayers)
						if err != nil {
							return origin, err
						}
						if target == playerNotFound {
							ctx.Alert("user cancel action")
							break
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
							ctx.Alert(err)
							break Menu
						}
						continue
					}
					if err != nil {
						return origin, err
					}
				}
			}
			switch card.CardPrototypeID.CardType {
			case CardTypeAttack:
				otherPlayers := FilterPlayer(ValsStringPlayer(gameplayCtx.Players), func(p Player) bool {
					return p.ID != activePlayer.ID
				})
				// 殺
				target, err := ctx.AskOnePlayer(gameplayCtx, activePlayer, otherPlayers)
				if err != nil {
					return origin, err
				}
				if target == playerNotFound {
					ctx.Alert("user cancel action")
					break
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
					ctx.Alert(err)
					break
				}

			case CardTypeSteal:
				otherPlayers := FilterPlayer(ValsStringPlayer(gameplayCtx.Players), func(p Player) bool {
					return p.ID != activePlayer.ID
				})
				// 盜
				target, err := ctx.AskOnePlayer(gameplayCtx, activePlayer, otherPlayers)
				if err != nil {
					return origin, err
				}
				if target == playerNotFound {
					ctx.Alert("user cancel action")
					break
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
					ctx.Alert(err)
					break
				}
			case CardTypeStealMoney:
				otherPlayers := FilterPlayer(ValsStringPlayer(gameplayCtx.Players), func(p Player) bool {
					return p.ID != activePlayer.ID
				})
				// 劫
				target, err := ctx.AskOnePlayer(gameplayCtx, activePlayer, otherPlayers)
				if err != nil {
					return origin, err
				}
				if target == playerNotFound {
					ctx.Alert("user cancel action")
					break
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
			case CardTypeMake:
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
			default:
				ctx.Alert(fmt.Sprintf("不能使用這類型的卡%v\n", card))
			}
		case view.CmdSellCard:
			card := cmdDetail.Card
			switch card.CardPrototypeID.CardType {
			case CardTypeArm, CardTypeArmor, CardTypeAccessory, CardTypeGrind, CardTypeBarrier:
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

	return gameplayCtx, nil
}

// HasAbilityAttackWithAnyCard 任何卡都能當殺的能力
func HasAbilityAttackWithAnyCard(gameplayCtx Gameplay, player Player) bool {
	// 如果是戰士, 有裝備武器
	card, err := GetCharacterCard(gameplayCtx, player)
	if err != nil {
		fmt.Println(err.Error())
		return false
	}
	if card.CardPrototypeID.ID != CharacterIDWarrior {
		return false
	}
	if HasEquip(gameplayCtx, player, CardTypeArm) == false {
		return false
	}
	return true
}

func HasAbilityHealing(gameplayCtx Gameplay, player Player) bool {
	// 如果是戰士, 有裝備防具
	card, err := GetCharacterCard(gameplayCtx, player)
	if err != nil {
		fmt.Println(err.Error())
		return false
	}
	if card.CardPrototypeID.ID != CharacterIDWarrior {
		return false
	}
	if HasEquip(gameplayCtx, player, CardTypeArmor) == false {
		return false
	}
	return true
}

func HasAbilityBreakArmor(gameplayCtx Gameplay, player Player) bool {
	// 如果是戰士, 有裝備配件
	card, err := GetCharacterCard(gameplayCtx, player)
	if err != nil {
		fmt.Println(err.Error())
		return false
	}
	if card.CardPrototypeID.ID != CharacterIDWarrior {
		return false
	}
	if HasEquip(gameplayCtx, player, CardTypeAccessory) == false {
		return false
	}
	return true
}

func HasAbilityEvadeWithAnyCard(gameplayCtx Gameplay, player Player) bool {
	card, err := GetCharacterCard(gameplayCtx, player)
	if err != nil {
		fmt.Println(err.Error())
		return false
	}
	if card.CardPrototypeID.ID != CharacterIDThief {
		return false
	}
	if HasEquip(gameplayCtx, player, CardTypeArmor) == false {
		return false
	}
	return true
}

func HasAbilityAttackHealing(gameplayCtx Gameplay, player Player) bool {
	card, err := GetCharacterCard(gameplayCtx, player)
	if err != nil {
		fmt.Println(err.Error())
		return false
	}
	if card.CardPrototypeID.ID != CharacterIDThief {
		return false
	}
	if HasEquip(gameplayCtx, player, CardTypeAccessory) == false {
		return false
	}
	return true
}
