package ai

import (
	"app/gameplay"
	"app/view"
	"fmt"
	"tool/desktop"
)

func CardWeight(gameplayCtx gameplay.Gameplay, player gameplay.Player, card desktop.Card) int {
	switch card.CardPrototypeID.CardType {
	case gameplay.CardTypeAttack:
		return 90
	case gameplay.CardTypeArm, gameplay.CardTypeArmor, gameplay.CardTypeAccessory, gameplay.CardTypeBarrier, gameplay.CardTypeGrind:
		if gameplay.HasEquip(gameplayCtx, player, card.CardPrototypeID.CardType) == false {
			return 100
		}
		return 0
	case gameplay.CardTypeMake, gameplay.CardTypeJob:
		return 50
	}
	return 0
}

func CmdWeight(gameplayCtx gameplay.Gameplay, player gameplay.Player, cmd interface{}) (interface{}, int) {
	hand := gameplayCtx.Desktop.CardStacks[gameplay.CardStackIDHand(player)]
	character, err := gameplay.GetCharacterCardCom(gameplayCtx, player)
	if err != nil {
		fmt.Printf(err.Error())
		return cmd, 0
	}
	switch detail := cmd.(type) {
	case view.CmdUseCard:
		if len(hand) == 0 {
			return detail, 0
		}
		cardWs := []int{}
		maxW := 0
		maxI := 0
		for i, card := range hand {
			w := CardWeight(gameplayCtx, player, card)
			cardWs = append(cardWs, w)
			if maxW < w {
				maxW = w
				maxI = i
			}
		}
		detail.Card = hand[maxI]
		return detail, maxW
	case view.CmdBuyItem:
		if character.Money >= 4 {
			detail.ItemID = view.ItemIDPower
			return detail, 100
		}
		if character.Money >= 2 {
			detail.ItemID = view.ItemIDPower
			return detail, 50
		}
	case view.CmdSellCard:
		if len(hand) >= 5 {
			for _, card := range hand {
				switch card.CardPrototypeID.CardType {
				case gameplay.CardTypeArm, gameplay.CardTypeArmor, gameplay.CardTypeAccessory, gameplay.CardTypeBarrier, gameplay.CardTypeGrind:
					detail.Card = card
					return detail, 100
				}
			}
		}
		return detail, 0
	case view.CmdEndTurn:
		if len(hand) == 0 {
			return detail, 100
		}
	}
	return cmd, 0
}
