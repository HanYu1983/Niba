package gameplay

import (
	"fmt"
	"tool/desktop"
)

// StealMoney 使出劫, 對方用閃反應
func StealMoney(gameplay Gameplay, player Player, target Player, card desktop.Card) (Gameplay, error) {
	if card.CardPrototypeID.CardType != CardTypeStealMoney {
		return gameplay, fmt.Errorf("you must use StealMoney")
	}
	playerCom := gameplay.PlayerBasicComs[player.ID]
	if playerCom.StealMoneyTimes >= 1 {
		return gameplay, fmt.Errorf("you reach StealMoney limit")
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
		/*if target.Money > 0 {
			target.Money--
		} else {
			target.Life--
		}*/
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
	playerCom.StealMoneyTimes++
	gameplay.PlayerBasicComs[player.ID] = playerCom
	return gameplay, nil
}
