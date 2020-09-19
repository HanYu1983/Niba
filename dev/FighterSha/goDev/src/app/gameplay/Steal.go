package gameplay

import (
	"fmt"
	"tool/desktop"
)

// Steal 使出盜, 對方用閃反應
func Steal(ctx IView, origin Gameplay, player Player, target Player) (Gameplay, error) {
	gameplayCtx := origin
	playerCom := gameplayCtx.PlayerBasicComs[player.ID]
	if playerCom.StealTimes >= 1 {
		return origin, fmt.Errorf("you reach Steal limit")
	}
	gameplayCtx, err := BasicFlow(ctx, gameplayCtx, player, target, func(origin Gameplay) (Gameplay, error) {
		var err error
		gameplayCtx := origin
		// steal one equip card
		// or attack one life
		targetEquip := gameplayCtx.Desktop.CardStacks[CardStackIDEquip(target)]
		if len(targetEquip) > 0 {
			var cancel desktop.Card
			ctx.Alert("請選擇要盜走的裝備")
			gameplayCtx, err = SwapGameplay(gameplayCtx, func(origin Gameplay) (Gameplay, error) {
				gameplayCtx := origin
				equipCard, err := ctx.AskOneCard(gameplayCtx, player, targetEquip, func(card desktop.Card) bool {
					switch card.CardPrototypeID.CardType {
					case CardTypeArm, CardTypeArmor, CardTypeAccessory:
						return true
					default:
						return false
					}
				})
				if err != nil {
					return origin, err
				}
				if equipCard == cancel {
					return origin, fmt.Errorf("user cancel")
				}
				gameplayCtx, equipCard, err = MoveCard(ctx, gameplayCtx, CardStackIDEquip(target), CardStackIDHand(player), func(card desktop.Card) desktop.Card {
					card.Player = player.ID
					return card
				}, equipCard)
				if err != nil {
					return origin, err
				}
				return gameplayCtx, nil
			})
			if err != nil {
				return origin, err
			}
		} else {
			gameplayCtx, err = UpdateCharacterCom(gameplayCtx, target, func(characterCom CharacterCardCom) (CharacterCardCom, error) {
				characterCom.Life--
				return characterCom, nil
			})
			if err != nil {
				return origin, err
			}
		}
		return gameplayCtx, nil
	})
	if err != nil {
		return origin, err
	}
	playerCom = gameplayCtx.PlayerBasicComs[player.ID]
	playerCom.StealTimes++
	gameplayCtx.PlayerBasicComs = MergeStringPlayerBasicCom(gameplayCtx.PlayerBasicComs, map[string]PlayerBasicCom{
		CardStackIDHand(player): playerCom,
	})
	return gameplayCtx, nil
}
