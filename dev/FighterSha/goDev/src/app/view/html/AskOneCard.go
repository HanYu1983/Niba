package html

import (
	"app/gameplay"
	"app/gameplay/ai"
	"tool/desktop"

	"github.com/gopherjs/gopherjs/js"
)

// AskOneCard 等待玩家選一張卡
func (view HTMLView) AskOneCard(gameplayCtx gameplay.Gameplay, player gameplay.Player, targetCS desktop.CardStack, validFn func(desktop.Card) bool) (desktop.Card, error) {
	if player.GroupID != gameplay.GroupIDPlayer {
		return ai.AskOneCard(gameplayCtx, player, targetCS, validFn)
	}
	wait := make(chan interface{})
	go func() {
		js.Global.Get("View").Call("AskOneHandCard", player, targetCS, func(cardID *js.Object) {
			if cardID == nil || cardID == js.Undefined {
				close(wait)
			} else {
				wait <- cardID.String()
			}
		})
	}()
	cardID := <-wait
	if cardID == nil {
		return desktop.Card{}, nil
	}
	for _, _card := range targetCS {
		if _card.ID == cardID.(string) {
			return _card, nil
		}
	}
	return desktop.Card{}, nil
}
