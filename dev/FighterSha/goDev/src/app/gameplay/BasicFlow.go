package gameplay

import (
	"fmt"
	"tool/desktop"
)

// GameplayReducer is
type GameplayReducer func(Gameplay) (Gameplay, error)

// BasicFlow is
func BasicFlow(ctx IView, origin Gameplay, player Player, target Player, onHit GameplayReducer) (Gameplay, error) {
	gameplayCtx := origin
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
		// 是否買敏捷藥
		var answer string
		moneyNotEnougth := fmt.Errorf("Money is not enough")
		if answer, err = ctx.AskOption(gameplayCtx, target, "是否買敏捷藥", []string{"Yes", "No"}); answer == "Yes" {
			gameplayCtx, err = UpdateCharacterCom(gameplayCtx, target, func(origin CharacterCardCom) (CharacterCardCom, error) {
				com := origin
				if com.Money < 2 {
					return origin, moneyNotEnougth
				}
				com.Money -= 2
				return com, nil
			})
			if err == moneyNotEnougth {
				ctx.Alert(moneyNotEnougth.Error())

			} else if err != nil {
				return origin, err
			} else {
				ctx.Alert(fmt.Sprintf("Player Dodged: %+v", target))
				return gameplayCtx, nil
			}
		}

		ctx.Alert(fmt.Sprintf("Hit Player: %+v", target))
		gameplayCtx, err = onHit(gameplayCtx)
		if err != nil {
			return origin, err
		}
	} else {
		gameplayCtx, dodgeCard, err = MoveCard(ctx, gameplayCtx, CardStackIDHand(target), CardStackGravyard, func(card desktop.Card) desktop.Card {
			card.Face = desktop.FaceUp
			return card
		}, dodgeCard)
		if err != nil {
			return origin, err
		}
		ctx.Alert(fmt.Sprintf("Player Dodged: %+v", target))
	}

	targetCharacter, err := GetCharacterCardCom(gameplayCtx, target)
	if err != nil {
		return origin, err
	}
	if targetCharacter.Life == 0 {
		gameplayCtx.EndState.Completed = true
		gameplayCtx.EndState.Reason = "玩家被攻擊而死"
	}
	return gameplayCtx, nil
}
