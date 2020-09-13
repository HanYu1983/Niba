package html

import (
	"app/gameplay"
	"app/gameplay/ai"
	"app/view"
	"fmt"

	"github.com/gopherjs/gopherjs/js"
)

// AskCommand is
func (v HTMLView) AskCommand(gameplayCtx gameplay.Gameplay, player gameplay.Player) (interface{}, error) {
	if player.GroupID != gameplay.GroupIDPlayer {
		return ai.AskCommand(gameplayCtx, player)
	}
	wait := make(chan interface{})
	go func() {
		js.Global.Get("View").Call("AskCommand", player, map[string]interface{}{
			"CmdUseCard": func(cardID *js.Object) {
				go func() {
					targetCS := gameplayCtx.Desktop.CardStacks[gameplay.CardStackIDHand(player)]
					for _, _card := range targetCS {
						if _card.ID == cardID.String() {
							wait <- view.CmdUseCard{Card: _card}
							return
						}
					}
					wait <- fmt.Errorf("%v not found", cardID.String())
				}()
			},
			"Cancel": func() {
				// return default of type
				close(wait)
			},
		})
	}()
	cmd := <-wait
	if err, ok := cmd.(error); ok {
		return nil, err
	}
	return cmd, nil
}
