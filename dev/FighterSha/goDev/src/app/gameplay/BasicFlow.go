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
	hand := gameplayCtx.Desktop.CardStacks[CardStackIDHand(player)]
	hand, err := desktop.RemoveCard(hand, card)
	if err != nil {
		return origin, err
	}
	// face up
	card.Face = desktop.FaceUp
	gravyard = append(gravyard, card)
	gameplayCtx.Desktop.CardStacks = desktop.MergeStringCardStack(gameplayCtx.Desktop.CardStacks, map[string]desktop.CardStack{
		CardStackGravyard:       gravyard,
		CardStackIDHand(player): hand,
	})

	ctx.Alert(fmt.Sprintf("Ask Player For Dodge: %+v", target))
	// ask target player for dodge
	targetHand := gameplayCtx.Desktop.CardStacks[CardStackIDHand(target)]
	dodgeCard, err := ctx.AskOneCard(gameplayCtx, target, targetHand, func(card desktop.Card) bool {
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
		// move dodge card to gravyard
		targetHand, err := desktop.RemoveCard(targetHand, dodgeCard)
		if err != nil {
			return origin, err
		}
		// face up
		dodgeCard.Face = desktop.FaceUp
		gravyard = append(gravyard, dodgeCard)
		gameplayCtx.Desktop.CardStacks = desktop.MergeStringCardStack(gameplayCtx.Desktop.CardStacks, map[string]desktop.CardStack{
			CardStackGravyard:       gravyard,
			CardStackIDHand(target): targetHand,
		})
	}

	playerCom.AttackTimes++
	gameplayCtx.PlayerBasicComs = MergeStringPlayerBasicCom(gameplayCtx.PlayerBasicComs, map[string]PlayerBasicCom{
		player.ID: playerCom,
	})
	return gameplayCtx, nil
}
