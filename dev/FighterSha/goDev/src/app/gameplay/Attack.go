package gameplay

import (
	"fmt"
)

// Attack 使出殺, 對方用閃反應
func Attack(ctx IView, origin Gameplay, player Player, target Player) (Gameplay, error) {
	gameplayCtx := origin
	playerCom := gameplayCtx.PlayerBasicComs[player.ID]
	if playerCom.AttackTimes >= 1 {
		return origin, fmt.Errorf("you reach attack limit")
	}
	gameplayCtx, err := BasicFlow(ctx, gameplayCtx, player, target, func(origin Gameplay) (Gameplay, error) {
		gameplayCtx := origin
		gameplayCtx, err := UpdateCharacterCom(gameplayCtx, target, func(characterCom CharacterCardCom) (CharacterCardCom, error) {
			characterCom.Life--
			return characterCom, nil
		})
		if err != nil {
			return origin, err
		}
		if HasAbilityBreakArmor(gameplayCtx, player) {

		}
		if HasAbilityAttackHealing(gameplayCtx, player) {
			gameplayCtx, err = UpdateCharacterCom(gameplayCtx, player, func(characterCom CharacterCardCom) (CharacterCardCom, error) {
				characterCom.Life++
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
	playerCom.AttackTimes++
	gameplayCtx.PlayerBasicComs = MergeStringPlayerBasicCom(gameplayCtx.PlayerBasicComs, map[string]PlayerBasicCom{
		player.ID: playerCom,
	})
	return gameplayCtx, nil
}
