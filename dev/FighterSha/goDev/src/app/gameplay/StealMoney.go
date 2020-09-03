package gameplay

import (
	"fmt"
	"tool/desktop"
)

// StealMoney 使出劫, 對方用閃反應
func StealMoney(origin Gameplay, player Player, target Player, card desktop.Card) (Gameplay, error) {
	gameplayCtx := origin
	if card.CardPrototypeID.CardType != CardTypeStealMoney {
		return gameplayCtx, fmt.Errorf("you must use StealMoney")
	}
	playerCom := gameplayCtx.PlayerBasicComs[player.ID]
	if playerCom.StealMoneyTimes >= 1 {
		return gameplayCtx, fmt.Errorf("you reach StealMoney limit")
	}
	gameplayCtx, err := BasicFlow(gameplayCtx, player, target, card, func(origin Gameplay) (Gameplay, error) {
		gameplayCtx := origin
		targetCharacterCard, err := GetCharacterCard(gameplayCtx, target)
		if err != nil {
			return origin, err
		}
		characterCom := gameplayCtx.CharacterCardCom[targetCharacterCard.ID]
		if characterCom.Money > 0 {
			characterCom.Money--
		} else {
			characterCom.Life--
		}
		gameplayCtx.CharacterCardCom = MergeStringCharacterCardCom(gameplayCtx.CharacterCardCom, map[string]CharacterCardCom{
			targetCharacterCard.ID: characterCom,
		})
		return gameplayCtx, nil
	})
	if err != nil {
		return origin, err
	}
	playerCom = gameplayCtx.PlayerBasicComs[player.ID]
	playerCom.StealMoneyTimes++
	gameplayCtx.PlayerBasicComs = MergeStringPlayerBasicCom(gameplayCtx.PlayerBasicComs, map[string]PlayerBasicCom{
		player.ID: playerCom,
	})
	return gameplayCtx, nil
}
