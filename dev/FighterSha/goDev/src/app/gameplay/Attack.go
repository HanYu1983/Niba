package gameplay

import (
	"fmt"
	"tool/desktop"
)

// Attack 使出殺, 對方用閃反應
func Attack(gameplay Gameplay, player Player, target Player, card desktop.Card) (Gameplay, error) {
	if card.CardPrototypeID.CardType != CardTypeAttack {
		return gameplay, fmt.Errorf("you must use Attack")
	}
	playerCom := gameplay.PlayerBasicComs[player.ID]
	if playerCom.AttackTimes >= 1 {
		return gameplay, fmt.Errorf("you reach attack limit")
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
		//target.Life--
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

	playerCom.AttackTimes++
	gameplay.PlayerBasicComs[player.ID] = playerCom
	return gameplay, nil
}
