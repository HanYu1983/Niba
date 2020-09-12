package gameplay

import (
	"fmt"
	"tool/desktop"
)

// StealMoney 使出劫, 對方用閃反應
func StealMoney(ctx IView, origin Gameplay, player Player, target Player, card desktop.Card) (Gameplay, error) {
	gameplayCtx := origin
	if card.CardPrototypeID.CardType != CardTypeStealMoney {
		return gameplayCtx, fmt.Errorf("you must use StealMoney")
	}
	playerCom := gameplayCtx.PlayerBasicComs[player.ID]
	if playerCom.StealMoneyTimes >= 1 {
		return gameplayCtx, fmt.Errorf("you reach StealMoney limit")
	}
	gameplayCtx, err := BasicFlow(ctx, gameplayCtx, player, target, card, func(origin Gameplay) (Gameplay, error) {
		gameplayCtx := origin
		gameplayCtx, err := UpdateCharacterCom(gameplayCtx, target, func(characterCom CharacterCardCom) CharacterCardCom {
			if characterCom.Money > 0 {
				characterCom.Money--
			} else {
				characterCom.Life--
			}
			return characterCom
		})
		if err != nil {
			return origin, err
		}
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
