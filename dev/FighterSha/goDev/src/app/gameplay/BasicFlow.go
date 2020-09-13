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

	gameplayCtx, card, err := MoveCard(ctx, gameplayCtx, CardStackIDHand(player), CardStackGravyard, func(card desktop.Card) desktop.Card {
		card.Face = desktop.FaceUp
		return card
	}, card)

	if err != nil {
		return origin, err
	}

	ctx.Alert(fmt.Sprintf("Ask Player For Dodge: %+v", target))
	// ask target player for dodge
	targetHand := gameplayCtx.Desktop.CardStacks[CardStackIDHand(target)]
	dodgeCard, err := ctx.AskOneCard(gameplayCtx, target, targetHand, func(card desktop.Card) bool {
		if HasAbilityEvadeWithAnyCard(gameplayCtx, player) {
			return true
		}
		return card.CardPrototypeID.CardType == CardTypeDodge
	})
	if err != nil {
		return origin, err
	}
	var NotFound desktop.Card
	if dodgeCard == NotFound {
		ctx.Alert(fmt.Sprintf("Hit Player: %+v", target))
		gameplayCtx, err = onHit(gameplayCtx)
		if err != nil {
			return origin, err
		}
	} else {
		ctx.Alert(fmt.Sprintf("Player Dodged: %+v", target))
		gameplayCtx, dodgeCard, err = MoveCard(ctx, gameplayCtx, CardStackIDHand(target), CardStackGravyard, func(card desktop.Card) desktop.Card {
			card.Face = desktop.FaceUp
			return card
		}, dodgeCard)

		if err != nil {
			return origin, err
		}
	}
	return gameplayCtx, nil
}
