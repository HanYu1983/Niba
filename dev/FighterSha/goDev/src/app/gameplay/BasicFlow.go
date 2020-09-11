package gameplay

import (
	"fmt"
	"tool/desktop"
)

// GameplayReducer is
type GameplayReducer func(Gameplay) (Gameplay, error)

// BasicFlow is
func BasicFlow(ctx IView, origin Gameplay, player Player, target Player, card desktop.Card, onHit GameplayReducer) (Gameplay, error) {
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
	gameplayCtx.Desktop.CardStacks = desktop.MergeStringCardStack(gameplayCtx.Desktop.CardStacks, map[string]desktop.CardStack{
		CardStackGravyard: gravyard,
		player.ID:         hand,
	})

	// ask target player for dodge
	targetHand := gameplayCtx.Desktop.CardStacks[target.ID]
	dodgeCard, err := ctx.AskOneCard(gameplayCtx, target, targetHand)
	if err != nil {
		return origin, err
	}
	var NotFound desktop.Card
	if dodgeCard == NotFound {
		gameplayCtx, err = onHit(gameplayCtx)
		if err != nil {
			return origin, err
		}
	} else {
		if dodgeCard.CardPrototypeID.CardType != CardTypeDodge {
			return origin, fmt.Errorf("you must select dodge card")
		}
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
