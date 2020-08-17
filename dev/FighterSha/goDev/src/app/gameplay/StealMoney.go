package gameplay

import (
	"fmt"
	"tool/desktop"
)

// StealMoney 使出劫, 對方用閃反應
func StealMoney(gameplayCtx Gameplay, player Player, target Player, card desktop.Card) (Gameplay, error) {
	if card.CardPrototypeID.CardType != CardTypeStealMoney {
		return gameplayCtx, fmt.Errorf("you must use StealMoney")
	}
	playerCom := gameplayCtx.PlayerBasicComs[player.ID]
	if playerCom.StealMoneyTimes >= 1 {
		return gameplayCtx, fmt.Errorf("you reach StealMoney limit")
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
		targetCharacterCard, err := GetCharacterCard(gameplayCtx, target)
		characterCom := gameplayCtx.CharacterCardCom[targetCharacterCard.ID]
		if characterCom.Money > 0 {
			characterCom.Money--
		} else {
			characterCom.Life--
		}
		gameplayCtx.CharacterCardCom[targetCharacterCard.ID] = characterCom
	} else {
		// move dodge card to gravyard
		targetHand, gravyard, err = desktop.MoveCard(targetHand, gravyard, dodgeCard, 0)
		if err != nil {
			return gameplayCtx, err
		}
		gameplayCtx.Desktop.CardStacks[CardStackGravyard] = gravyard
		gameplayCtx.Desktop.CardStacks[target.ID] = targetHand
	}
	playerCom.StealMoneyTimes++
	gameplayCtx.PlayerBasicComs[player.ID] = playerCom
	return gameplayCtx, nil
}
