package p5

import (
	"app/gameplay"
	"fmt"

	"github.com/gopherjs/gopherjs/js"
)

// Render is
func (v *P5View) Render(gameplayCtx gameplay.Gameplay) {
	v.Gameplay = gameplayCtx
}

var (
	_p5 = js.Global.Get("p5")
)

const (
	CanvasWidth  = 600
	CanvasHeight = 480
)

func (v *P5View) InstallCanvas() {

	var msg interface{}

	go func() {
		for {
			msg = <-v.AlertPopup
			//time.Sleep(3 * time.Second)
			//msg = nil
		}
	}()

	_p5.New(func(p *js.Object) {
		p.Set("keyPressed", func(e *js.Object) {
			if v.Page == PageStart {
				v.EventChan <- StartGameplayEvent{}
			}
		})

		p.Set("setup", func() {
			p.Call("createCanvas", CanvasWidth, CanvasHeight)
		})

		p.Set("draw", func() {
			p.Call("background", 0)
			p.Call("fill", 100)
			p.Call("stroke", 255)

			if v.Page == PageStart {
				p.Call("text", "StartPage", CanvasWidth>>1, CanvasHeight>>1)
				return
			}

			//p.Call("text", fmt.Sprintf("%+v", v.Gameplay), 0, 20)

			cards := map[string]CardView{}
			for cskey, cs := range v.Gameplay.Desktop.CardStacks {
				for _, c := range cs {
					cards[c.ID] = CardView{
						Card:        c,
						CardStackID: cskey,
					}
				}
			}

			for k := range v.GameplayView.CardViews {
				if _, isExist := cards[k]; isExist == false {
					// remove
					delete(v.GameplayView.CardViews, k)
				}
			}

			for k, card := range cards {
				if _, isExist := v.GameplayView.CardViews[k]; isExist == false {
					// new
					v.GameplayView.CardViews[k] = card
				}
			}

			offsetX := 100
			offsetY := 100
			cardW := 30
			cardH := 50

			for _, player := range v.Gameplay.Players {
				for i, card := range v.Gameplay.Desktop.CardStacks[gameplay.CardStackIDHand(player)] {
					cardView := v.GameplayView.CardViews[card.ID]
					isActive := player.ID == v.Gameplay.ActivePlayerID
					var _ = cardView
					var _ = isActive

					tx := float32(offsetX + i*cardW)
					ty := float32(offsetY)
					cx := cardView.Position.X + (tx-cardView.Position.X)/9
					cy := cardView.Position.Y + (ty-cardView.Position.Y)/9
					cardView.Position.X = cx
					cardView.Position.Y = cy
					v.GameplayView.CardViews[card.ID] = cardView

					p.Call("rect", cx, cy, cardW, cardH)
					p.Call("text", card.CardPrototypeID, cx, cy+15)
				}
				offsetY += cardH

				for i, card := range v.Gameplay.Desktop.CardStacks[gameplay.CardStackIDEquip(player)] {
					cardView := v.GameplayView.CardViews[card.ID]
					isActive := player.ID == v.Gameplay.ActivePlayerID
					var _ = cardView
					var _ = isActive

					tx := float32(offsetX + i*cardW)
					ty := float32(offsetY)
					cx := cardView.Position.X + (tx-cardView.Position.X)/9
					cy := cardView.Position.Y + (ty-cardView.Position.Y)/9
					cardView.Position.X = cx
					cardView.Position.Y = cy
					v.GameplayView.CardViews[card.ID] = cardView

					p.Call("rect", cx, cy, cardW, cardH)
					p.Call("text", card.CardPrototypeID, cx, cy+15)
				}
				offsetY += cardH
			}

			offsetX = CanvasWidth >> 1
			offsetY = CanvasHeight >> 1
			for i, card := range v.Gameplay.Desktop.CardStacks[gameplay.CardStackGravyard] {
				cardView := v.GameplayView.CardViews[card.ID]

				tx := float32(offsetX + i*2)
				ty := float32(offsetY)
				cx := cardView.Position.X + (tx-cardView.Position.X)/9
				cy := cardView.Position.Y + (ty-cardView.Position.Y)/9
				cardView.Position.X = cx
				cardView.Position.Y = cy
				v.GameplayView.CardViews[card.ID] = cardView

				p.Call("rect", cx, cy, cardW, cardH)
				p.Call("text", card.CardPrototypeID, cx, cy+15)
			}

			offsetX = 0
			offsetY = 0
			for i, card := range v.Gameplay.Desktop.CardStacks[gameplay.CardStackHome] {
				cardView := v.GameplayView.CardViews[card.ID]

				tx := float32(offsetX + i*2)
				ty := float32(offsetY)
				cx := cardView.Position.X + (tx-cardView.Position.X)/9
				cy := cardView.Position.Y + (ty-cardView.Position.Y)/9
				cardView.Position.X = cx
				cardView.Position.Y = cy
				v.GameplayView.CardViews[card.ID] = cardView

				p.Call("rect", cx, cy, cardW, cardH)
				p.Call("text", card.CardPrototypeID, cx, cy+15)
			}

			if msg != nil {
				p.Call("text", fmt.Sprintf("%+v", msg.(string)), 0, 300)
			}
		})
	}, "canvas")
}
