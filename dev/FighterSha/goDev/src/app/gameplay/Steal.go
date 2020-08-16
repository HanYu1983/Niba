package gameplay

import (
	"fmt"
	"tool/desktop"
)

// Steal 使出盜, 對方用閃反應
func Steal(gameplay Gameplay, player Player, target Player, card desktop.Card) (Gameplay, error) {
	if card.CardPrototypeID.CardType != CardTypeSteal {
		return gameplay, fmt.Errorf("you must use Steal")
	}
	playerCom := gameplay.PlayerBasicComs[player.ID]
	if playerCom.StealTimes >= 1 {
		return gameplay, fmt.Errorf("you reach Steal limit")
	}
	// move attack card to gravyard
	gravyard := gameplay.Desktop.CardStacks[CardStackGravyard]
	hand := gameplay.Desktop.CardStacks[player.ID]
	hand, gravyard, err := desktop.MoveCard(hand, gravyard, card, 0)
	if err != nil {
		return gameplay, err
	}
	gameplay.Desktop.CardStacks[CardStackGravyard] = gravyard
	gameplay.Desktop.CardStacks[player.ID] = hand

	// ask target player for dodge
	targetHand := gameplay.Desktop.CardStacks[target.ID]
	dodgeCard, err := AskOneCard(gameplay, target, targetHand)
	if err != nil {
		return gameplay, err
	}
	if dodgeCard.CardPrototypeID.CardType != CardTypeDodge {
		return gameplay, fmt.Errorf("you must select dodge card")
	}
	var NotFound desktop.Card
	if dodgeCard == NotFound {
		// steal one equip card
		// or attack one life
		targetEquip := gameplay.Desktop.CardStacks[target.ID+CardStackEquip]
		if len(targetEquip.Cards) > 0 {
			equipCard, err := AskOneCard(gameplay, player, targetEquip)
			if err != nil {
				return gameplay, err
			}
			targetEquip, hand, err := desktop.MoveCard(targetEquip, hand, equipCard, 0)
			if err != nil {
				return gameplay, err
			}
			gameplay.Desktop.CardStacks[target.ID+CardStackEquip] = targetEquip
			gameplay.Desktop.CardStacks[player.ID] = hand
		} else {
			//target.Life--
		}
		gameplay.Players[target.ID] = target
	} else {
		// move dodge card to gravyard
		targetHand, gravyard, err = desktop.MoveCard(targetHand, gravyard, dodgeCard, 0)
		if err != nil {
			return gameplay, err
		}
		gameplay.Desktop.CardStacks[CardStackGravyard] = gravyard
		gameplay.Desktop.CardStacks[target.ID] = targetHand
	}
	playerCom.StealTimes++
	gameplay.PlayerBasicComs[player.ID] = playerCom
	return gameplay, nil
}
