package gameplay

import (
	"tool/desktop"

	"github.com/gopherjs/gopherjs/js"
)

// AskOneCard 等待玩家選一張卡
func AskOneCard(gameplay Gameplay, player Player, targetCS desktop.CardStack) (desktop.Card, error) {
	wait := make(chan interface{})
	go func() {
		js.Global.Get("View").Call("AskOneHandCard", player, targetCS, func(cardID *js.Object) {
			if cardID == nil || cardID == js.Undefined {
				wait <- nil
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
