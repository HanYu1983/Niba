package gameplay

import (
	"fmt"
	"tool/desktop"
)

// Steal 使出盜, 對方用閃反應
func Steal(gameplayCtx Gameplay, player Player, target Player, card desktop.Card) (Gameplay, error) {
	if card.CardPrototypeID.CardType != CardTypeSteal {
		return gameplayCtx, fmt.Errorf("you must use Steal")
	}
	playerCom := gameplayCtx.PlayerBasicComs[player.ID]
	if playerCom.StealTimes >= 1 {
		return gameplayCtx, fmt.Errorf("you reach Steal limit")
	}
	// move attack card to gravyard
	gravyard := gameplayCtx.Desktop.CardStacks[CardStackGravyard]
	hand := gameplayCtx.Desktop.CardStacks[player.ID]
	hand, gravyard, err := desktop.MoveCard(hand, gravyard, card, 0)
	if err != nil {
		return gameplayCtx, err
	}
	gameplayCtx.Desktop.CardStacks[CardStackGravyard] = gravyard
	gameplayCtx.Desktop.CardStacks[player.ID] = hand

	// ask target player for dodge
	targetHand := gameplayCtx.Desktop.CardStacks[target.ID]
	dodgeCard, err := AskOneCard(gameplayCtx, target, targetHand)
	if err != nil {
		return gameplayCtx, err
	}
	if dodgeCard.CardPrototypeID.CardType != CardTypeDodge {
		return gameplayCtx, fmt.Errorf("you must select dodge card")
	}
	var NotFound desktop.Card
	if dodgeCard == NotFound {
		// steal one equip card
		// or attack one life
		targetEquip := gameplayCtx.Desktop.CardStacks[target.ID+CardStackEquip]
		if len(targetEquip) > 0 {
			equipCard, err := AskOneCard(gameplayCtx, player, targetEquip)
			if err != nil {
				return gameplayCtx, err
			}
			targetEquip, hand, err := desktop.MoveCard(targetEquip, hand, equipCard, 0)
			if err != nil {
				return gameplayCtx, err
			}
			gameplayCtx.Desktop.CardStacks[target.ID+CardStackEquip] = targetEquip
			gameplayCtx.Desktop.CardStacks[player.ID] = hand
		} else {
			targetCharacterCard, err := GetCharacterCard(gameplayCtx, target)
			if err != nil {
				return gameplayCtx, err
			}
			characterCom := gameplayCtx.CharacterCardCom[targetCharacterCard.ID]
			characterCom.Life--
			gameplayCtx.CharacterCardCom[targetCharacterCard.ID] = characterCom
		}
	} else {
		// move dodge card to gravyard
		targetHand, gravyard, err = desktop.MoveCard(targetHand, gravyard, dodgeCard, 0)
		if err != nil {
			return gameplayCtx, err
		}
		gameplayCtx.Desktop.CardStacks[CardStackGravyard] = gravyard
		gameplayCtx.Desktop.CardStacks[target.ID] = targetHand
	}
	playerCom.StealTimes++
	gameplayCtx.PlayerBasicComs[player.ID] = playerCom
	return gameplayCtx, nil
}
