package gameplay

import (
	"fmt"
	"tool/desktop"
)

// Attack 使出殺, 對方用閃反應
func Attack2(gameplayCtx *Gameplay, player Player, target Player, card desktop.Card) error {
	if card.CardPrototypeID.CardType != CardTypeAttack {
		return fmt.Errorf("you must use Attack")
	}
	playerCom := gameplayCtx.PlayerBasicComs[player.ID]
	if playerCom.AttackTimes >= 1 {
		return fmt.Errorf("you reach attack limit")
	}
	// move attack card to gravyard
	gravyard := gameplayCtx.Desktop.CardStacks[CardStackGravyard]
	hand := gameplayCtx.Desktop.CardStacks[player.ID]
	hand, gravyard, err := desktop.MoveCard(hand, gravyard, card, 0)
	if err != nil {
		return err
	}
	originCard := card
	card.Face = desktop.FaceUp
	gravyard = desktop.Replace(gravyard, map[desktop.Card]desktop.Card{originCard: card})
	gameplayCtx.Desktop.CardStacks[CardStackGravyard] = gravyard
	gameplayCtx.Desktop.CardStacks[player.ID] = hand

	// ask target player for dodge
	targetHand := gameplayCtx.Desktop.CardStacks[target.ID]
	dodgeCard, err := AskOneCard(*gameplayCtx, target, targetHand)
	if err != nil {
		return err
	}
	if dodgeCard.CardPrototypeID.CardType != CardTypeDodge {
		return fmt.Errorf("you must select dodge card")
	}
	var NotFound desktop.Card
	if dodgeCard == NotFound {
		targetCharacterCard, err := GetCharacterCard(*gameplayCtx, target)
		if err != nil {
			return err
		}
		characterCom := gameplayCtx.CharacterCardCom[targetCharacterCard.ID]
		characterCom.Life++
		gameplayCtx.CharacterCardCom[targetCharacterCard.ID] = characterCom
	} else {
		// move dodge card to gravyard
		targetHand, gravyard, err = desktop.MoveCard(targetHand, gravyard, dodgeCard, 0)
		if err != nil {
			return err
		}
		originDodgeCard := dodgeCard
		dodgeCard.Face = desktop.FaceUp
		gravyard = desktop.Replace(gravyard, map[desktop.Card]desktop.Card{originDodgeCard: dodgeCard})
		gameplayCtx.Desktop.CardStacks[CardStackGravyard] = gravyard
		gameplayCtx.Desktop.CardStacks[target.ID] = targetHand
	}

	playerCom.AttackTimes++
	gameplayCtx.PlayerBasicComs[player.ID] = playerCom
	return nil
}

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
	hand, err := desktop.RemoveCard(hand, card)
	// face up
	card.Face = desktop.FaceUp
	gravyard = append(gravyard, card)
	if err != nil {
		return gameplayCtx, err
	}
	gameplayCtx.Desktop.CardStacks = desktop.MergeCardStack(gameplayCtx.Desktop.CardStacks, map[string]desktop.CardStack{
		CardStackGravyard: gravyard,
		player.ID:         hand,
	})

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
		if err != nil {
			return gameplayCtx, err
		}
		characterCom := gameplayCtx.CharacterCardCom[targetCharacterCard.ID]
		characterCom.Life++
		gameplayCtx.CharacterCardCom = MergeCharacterCardCom(gameplayCtx.CharacterCardCom, map[string]CharacterCardCom{
			targetCharacterCard.ID: characterCom,
		})
	} else {
		// move dodge card to gravyard
		targetHand, err := desktop.RemoveCard(targetHand, dodgeCard)
		// face up
		dodgeCard.Face = desktop.FaceUp
		gravyard = append(gravyard, dodgeCard)
		if err != nil {
			return gameplayCtx, err
		}
		gameplayCtx.Desktop.CardStacks = desktop.MergeCardStack(gameplayCtx.Desktop.CardStacks, map[string]desktop.CardStack{
			CardStackGravyard: gravyard,
			target.ID:         targetHand,
		})
	}

	playerCom.AttackTimes++
	gameplayCtx.PlayerBasicComs = MergePlayerBasicCom(gameplayCtx.PlayerBasicComs, map[string]PlayerBasicCom{
		player.ID: playerCom,
	})
	return gameplayCtx, nil
}
