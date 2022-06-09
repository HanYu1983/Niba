package gameplay

import (
	"fmt"
)

// StealMoney 使出劫, 對方用閃反應
func StealMoney(ctx IView, origin Gameplay, player Player, target Player) (Gameplay, error) {
	gameplayCtx := origin
	playerCom := gameplayCtx.PlayerBasicComs[player.ID]
	if playerCom.StealMoneyTimes >= 1 {
		return origin, fmt.Errorf("you reach StealMoney limit")
	}

	gameplayCtx, err := BasicFlow(ctx, gameplayCtx, player, target, func(origin Gameplay) (Gameplay, error) {
		var err error
		gameplayCtx := origin
		isStealMoney := false
		gameplayCtx, err = UpdateCharacterCom(gameplayCtx, target, func(characterCom CharacterCardCom) (CharacterCardCom, error) {
			if characterCom.Money > 0 {
				characterCom.Money--
				isStealMoney = true
			} else {
				characterCom.Life--
			}
			return characterCom, nil
		})

		if err != nil {
			return origin, err
		}

		if isStealMoney {
			gameplayCtx, err = UpdateCharacterCom(gameplayCtx, player, func(characterCom CharacterCardCom) (CharacterCardCom, error) {
				characterCom.Money++
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
	playerCom.StealMoneyTimes++
	gameplayCtx.PlayerBasicComs = MergeStringPlayerBasicCom(gameplayCtx.PlayerBasicComs, map[string]PlayerBasicCom{
		player.ID: playerCom,
	})
	return gameplayCtx, nil
}
