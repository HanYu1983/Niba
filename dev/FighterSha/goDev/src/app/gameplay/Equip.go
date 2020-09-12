package gameplay

import (
	"fmt"
	"tool/desktop"
)

// HasEquip is
func HasEquip(ctx IView, gameplayCtx Gameplay, player Player, equipType desktop.CardType) bool {
	return len(desktop.FilterCard(gameplayCtx.Desktop.CardStacks[CardStackIDEquip(player)], func(c desktop.Card) bool {
		return c.CardPrototypeID.CardType == equipType
	})) > 0
}

// Equip is
func Equip(ctx IView, origin Gameplay, player Player, card desktop.Card) (Gameplay, error) {
	ctx.Alert(fmt.Sprintf("Equip: %+v %+v", player, card))
	gameplayCtx := origin

	switch card.CardPrototypeID.CardType {
	case CardTypeAccessory, CardTypeArm, CardTypeArmor, CardTypeGrind, CardTypeBarrier:
	default:
		return origin, fmt.Errorf("You Must Use Equip Card %+v", card)
	}

	if HasEquip(ctx, gameplayCtx, player, card.CardPrototypeID.CardType) {
		return origin, fmt.Errorf("Already Equip %+v", card)
	}

	nextHand, err := desktop.RemoveCard(gameplayCtx.Desktop.CardStacks[CardStackIDHand(player)], card)
	if err != nil {
		return origin, err
	}
	card.Face = desktop.FaceUp
	nextEquipCS := append(gameplayCtx.Desktop.CardStacks[CardStackIDEquip(player)], card)

	gameplayCtx.Desktop.CardStacks = desktop.MergeStringCardStack(gameplayCtx.Desktop.CardStacks, map[string]desktop.CardStack{
		CardStackIDHand(player):  nextHand,
		CardStackIDEquip(player): nextEquipCS,
	})
	return gameplayCtx, nil
}
