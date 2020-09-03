package gameplay

import (
	"fmt"
	"tool/desktop"
)

// Attack 使出殺, 對方用閃反應
func Attack(origin Gameplay, player Player, target Player, card desktop.Card) (Gameplay, error) {
	gameplayCtx := origin
	if card.CardPrototypeID.CardType != CardTypeAttack {
		return origin, fmt.Errorf("you must use Attack")
	}
	playerCom := gameplayCtx.PlayerBasicComs[player.ID]
	if playerCom.AttackTimes >= 1 {
		return origin, fmt.Errorf("you reach attack limit")
	}
	gameplayCtx, err := BasicFlow(gameplayCtx, player, target, card, func(origin Gameplay) (Gameplay, error) {
		gameplayCtx := origin
		targetCharacterCard, err := GetCharacterCard(gameplayCtx, target)
		if err != nil {
			return origin, err
		}
		characterCom := gameplayCtx.CharacterCardCom[targetCharacterCard.ID]
		characterCom.Life++
		gameplayCtx.CharacterCardCom = MergeStringCharacterCardCom(gameplayCtx.CharacterCardCom, map[string]CharacterCardCom{
			targetCharacterCard.ID: characterCom,
		})
		return gameplayCtx, nil
	})
	if err != nil {
		return origin, err
	}
	playerCom = gameplayCtx.PlayerBasicComs[player.ID]
	playerCom.AttackTimes++
	gameplayCtx.PlayerBasicComs = MergeStringPlayerBasicCom(gameplayCtx.PlayerBasicComs, map[string]PlayerBasicCom{
		player.ID: playerCom,
	})
	return gameplayCtx, nil
}
