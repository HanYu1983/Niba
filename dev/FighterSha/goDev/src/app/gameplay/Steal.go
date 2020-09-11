package gameplay

import (
	"fmt"
	"tool/desktop"
)

// Steal 使出盜, 對方用閃反應
func Steal(ctx IView, origin Gameplay, player Player, target Player, card desktop.Card) (Gameplay, error) {
	gameplayCtx := origin
	if card.CardPrototypeID.CardType != CardTypeSteal {
		return gameplayCtx, fmt.Errorf("you must use Steal")
	}
	playerCom := gameplayCtx.PlayerBasicComs[player.ID]
	if playerCom.StealTimes >= 1 {
		return gameplayCtx, fmt.Errorf("you reach Steal limit")
	}
	gameplayCtx, err := BasicFlow(ctx, gameplayCtx, player, target, card, func(origin Gameplay) (Gameplay, error) {
		gameplayCtx := origin
		// steal one equip card
		// or attack one life
		targetEquip := gameplayCtx.Desktop.CardStacks[CardStackIDEquip(target)]
		if len(targetEquip) > 0 {
			equipCard, err := ctx.AskOneCard(gameplayCtx, player, targetEquip, func(card desktop.Card) bool {
				return card.CardPrototypeID.CardType == CardTypeArm
			})
			if err != nil {
				return origin, err
			}
			targetEquip, err := desktop.RemoveCard(targetEquip, equipCard)
			if err != nil {
				return origin, err
			}
			hand := gameplayCtx.Desktop.CardStacks[CardStackIDHand(player)]
			hand = append(hand, equipCard)
			gameplayCtx.Desktop.CardStacks = desktop.MergeStringCardStack(gameplayCtx.Desktop.CardStacks, map[string]desktop.CardStack{
				CardStackIDEquip(target): targetEquip,
				CardStackIDHand(player):  hand,
			})
		} else {
			targetCharacterCard, err := GetCharacterCard(gameplayCtx, target)
			if err != nil {
				return origin, err
			}
			characterCom := gameplayCtx.CharacterCardCom[targetCharacterCard.ID]
			characterCom.Life--
			gameplayCtx.CharacterCardCom = MergeStringCharacterCardCom(gameplayCtx.CharacterCardCom, map[string]CharacterCardCom{
				targetCharacterCard.ID: characterCom,
			})
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
