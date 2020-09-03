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
	// move attack card to gravyard
	gravyard := gameplayCtx.Desktop.CardStacks[CardStackGravyard]
	hand := gameplayCtx.Desktop.CardStacks[player.ID]
	hand, err := desktop.RemoveCard(hand, card)
	if err != nil {
		return origin, err
	}
	// face up
	card.Face = desktop.FaceUp
	gravyard = append(gravyard, card)
	if err != nil {
		return origin, err
	}
	gameplayCtx.Desktop.CardStacks = desktop.MergeStringCardStack(gameplayCtx.Desktop.CardStacks, map[string]desktop.CardStack{
		CardStackGravyard: gravyard,
		player.ID:         hand,
	})

	// ask target player for dodge
	targetHand := gameplayCtx.Desktop.CardStacks[target.ID]
	dodgeCard, err := AskOneCard(gameplayCtx, target, targetHand)
	if err != nil {
		return origin, err
	}
	if dodgeCard.CardPrototypeID.CardType != CardTypeDodge {
		return origin, fmt.Errorf("you must select dodge card")
	}
	var NotFound desktop.Card
	if dodgeCard == NotFound {
		targetCharacterCard, err := GetCharacterCard(gameplayCtx, target)
		if err != nil {
			return origin, err
		}
		characterCom := gameplayCtx.CharacterCardCom[targetCharacterCard.ID]
		characterCom.Life++
		gameplayCtx.CharacterCardCom = MergeStringCharacterCardCom(gameplayCtx.CharacterCardCom, map[string]CharacterCardCom{
			targetCharacterCard.ID: characterCom,
		})
	} else {
		// move dodge card to gravyard
		targetHand, err := desktop.RemoveCard(targetHand, dodgeCard)
		if err != nil {
			return origin, err
		}
		// face up
		dodgeCard.Face = desktop.FaceUp
		gravyard = append(gravyard, dodgeCard)
		gameplayCtx.Desktop.CardStacks = desktop.MergeStringCardStack(gameplayCtx.Desktop.CardStacks, map[string]desktop.CardStack{
			CardStackGravyard: gravyard,
			target.ID:         targetHand,
		})
	}

	playerCom.AttackTimes++
	gameplayCtx.PlayerBasicComs = MergeStringPlayerBasicCom(gameplayCtx.PlayerBasicComs, map[string]PlayerBasicCom{
		player.ID: playerCom,
	})
	return gameplayCtx, nil
}
