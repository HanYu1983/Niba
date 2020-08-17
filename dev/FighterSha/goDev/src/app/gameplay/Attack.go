package gameplay

import (
	"fmt"
	"tool/desktop"
)

// Attack 使出殺, 對方用閃反應
func Attack(gameplayCtx Gameplay, player Player, target Player, card desktop.Card) (Gameplay, error) {
	if card.CardPrototypeID.CardType != CardTypeAttack {
		return gameplayCtx, fmt.Errorf("you must use Attack")
	}
	playerCom := gameplayCtx.PlayerBasicComs[player.ID]
	if playerCom.AttackTimes >= 1 {
		return gameplayCtx, fmt.Errorf("you reach attack limit")
	}
	// move attack card to gravyard
	gravyard := gameplayCtx.Desktop.CardStacks[CardStackGravyard]
	hand := gameplayCtx.Desktop.CardStacks[player.ID]
	hand, gravyard, err := desktop.MoveCard(hand, gravyard, card, 0)
	if err != nil {
		return gameplayCtx, err
	}
	originCard := card
	card.Face = desktop.FaceUp
	gravyard = desktop.Replace(gravyard, map[desktop.Card]desktop.Card{originCard: card})
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
		characterCom.Life++
		gameplayCtx.CharacterCardCom[targetCharacterCard.ID] = characterCom
	} else {
		// move dodge card to gravyard
		targetHand, gravyard, err = desktop.MoveCard(targetHand, gravyard, dodgeCard, 0)
		if err != nil {
			return gameplayCtx, err
		}
		originDodgeCard := dodgeCard
		dodgeCard.Face = desktop.FaceUp
		gravyard = desktop.Replace(gravyard, map[desktop.Card]desktop.Card{originDodgeCard: dodgeCard})
		gameplayCtx.Desktop.CardStacks[CardStackGravyard] = gravyard
		gameplayCtx.Desktop.CardStacks[target.ID] = targetHand
	}

	playerCom.AttackTimes++
	gameplayCtx.PlayerBasicComs[player.ID] = playerCom
	return gameplayCtx, nil
}
