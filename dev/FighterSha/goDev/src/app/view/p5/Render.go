package p5

import (
	"app/gameplay"
	"tool/desktop"

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
	CardWidth    = 30
	CardHeight   = 50
	PlayerWidth  = 150
	PlayerHeight = 100
	MsgWidth     = 200
	MsgHeight    = 100
)

func (v *P5View) RenderCardView(p *js.Object, cardView CardView, tx float32, ty float32) {
	p.Call("push")
	defer p.Call("pop")

	cx := cardView.Position.X + (tx-cardView.Position.X)/9
	cy := cardView.Position.Y + (ty-cardView.Position.Y)/9
	cardView.Position.X = cx
	cardView.Position.Y = cy
	v.GameplayView.CardViews[cardView.Card.ID] = cardView

	isMyCard := cardView.Card.Player == v.Gameplay.ActivePlayerID
	isFaceUp := cardView.Card.Face == desktop.FaceUp
	isCanSee := isMyCard || isFaceUp
	if isCanSee == false {
		p.Call("strokeWeight", 1)
		p.Call("fill", 100)
		p.Call("stroke", 255)
		p.Call("rect", cx, cy, CardWidth, CardHeight)
		p.Call("image", v.Assets.ImgCardBack, cx, cy, CardWidth, CardHeight)
		return
	}

	p.Call("strokeWeight", 1)
	p.Call("fill", 255)
	p.Call("stroke", 0)
	p.Call("rect", cx, cy, CardWidth, CardHeight)
	switch cardView.Card.CardPrototypeID.CardType {
	case gameplay.CardTypeAttack:
		p.Call("image", v.Assets.ImgKill, cx, cy, CardWidth, CardHeight)
	case gameplay.CardTypeDodge:
		p.Call("image", v.Assets.ImgDodge, cx, cy, CardWidth, CardHeight)
	case gameplay.CardTypeSteal:
		p.Call("image", v.Assets.ImgSteal, cx, cy, CardWidth, CardHeight)
	case gameplay.CardTypeStealMoney:
		p.Call("image", v.Assets.ImgStealMoney, cx, cy, CardWidth, CardHeight)
	case gameplay.CardTypeArm:
		p.Call("image", v.Assets.ImgArm, cx, cy, CardWidth, CardHeight)
	case gameplay.CardTypeArmor:
		p.Call("image", v.Assets.ImgArmor, cx, cy, CardWidth, CardHeight)
	case gameplay.CardTypeAccessory:
		p.Call("image", v.Assets.ImgAccessory, cx, cy, CardWidth, CardHeight)
	case gameplay.CardTypeGrind, gameplay.CardTypeBarrier:
		p.Call("image", v.Assets.ImgOtherEquip, cx, cy, CardWidth, CardHeight)
	case gameplay.CardTypeJob:
		p.Call("image", v.Assets.ImgJob, cx, cy, CardWidth, CardHeight)
	case gameplay.CardTypeMake:
		p.Call("image", v.Assets.ImgMake, cx, cy, CardWidth, CardHeight)
	default:

	}
}

func (v *P5View) RenderPlayer(p *js.Object, gameplayCtx gameplay.Gameplay, player gameplay.Player, tx float32, ty float32) {
	p.Call("push")
	defer p.Call("pop")

	characterCard, err := gameplay.GetCharacterCard(v.Gameplay, player)
	if err != nil {
		p.Call("text", err.Error(), CanvasWidth>>1, CanvasHeight>>1)
	}

	characterCom, err := gameplay.GetCharacterCardCom(v.Gameplay, player)
	if err != nil {
		p.Call("text", err.Error(), CanvasWidth>>1, CanvasHeight>>1)
	}

	isMyTurn := player.ID == v.Gameplay.ActivePlayerID
	if isMyTurn {
		p.Call("fill", 255, 255, 100)
		p.Call("stroke", 255)
	} else {
		p.Call("fill", 100)
		p.Call("stroke", 255)
	}
	p.Call("strokeWeight", 3)
	p.Call("rect", tx, ty, PlayerWidth, PlayerHeight)

	p.Call("strokeWeight", 1)
	p.Call("fill", 0)
	p.Call("stroke", 0)
	p.Call("text", "ID:"+player.ID, tx+5, ty+20)
	p.Call("text", "Character:"+characterCard.CardPrototypeID.ID, tx+5, ty+30)
	/*
		hand := gameplayCtx.Desktop.CardStacks[gameplay.CardStackIDHand(player)]
		for i, card := range hand {
			p.Call("text", fmt.Sprintf("%v)%+v", card.ID, card.CardPrototypeID.CardType), tx+5, ty+30+float32(i*10))
		}
	*/
	for i := 0; i < characterCom.Life; i++ {
		p.Call("image", v.Assets.ImgHeart, tx+float32(i*24), ty+50)
	}
	for i := 0; i < characterCom.Money; i++ {
		p.Call("image", v.Assets.ImgMoney, tx+float32(i*24), ty+70)
	}
}

func (v *P5View) InstallCanvas() {

	var msg interface{}

	go func() {
		for {
			msg = <-v.AlertPopup
		}
	}()

	_p5.New(func(p *js.Object) {

		p.Set("keyPressed", func(e *js.Object) {
			if v.Page == PageStart {
				v.EventChan <- StartGameplayEvent{}
			}
		})

		p.Set("setup", func() {
			v.Assets.ImgHeart = p.Call("loadImage", "assets/heart.png")
			v.Assets.ImgMoney = p.Call("loadImage", "assets/money.png")
			v.Assets.ImgCardBack = p.Call("loadImage", "assets/casino.png")
			v.Assets.ImgKill = p.Call("loadImage", "assets/evidence.png")
			v.Assets.ImgSteal = p.Call("loadImage", "assets/trolley.png")
			v.Assets.ImgStealMoney = p.Call("loadImage", "assets/robbery.png")
			v.Assets.ImgArm = p.Call("loadImage", "assets/sword.png")
			v.Assets.ImgArmor = p.Call("loadImage", "assets/armor.png")
			v.Assets.ImgAccessory = p.Call("loadImage", "assets/sunglasses.png")
			v.Assets.ImgOtherEquip = p.Call("loadImage", "assets/bottle.png")
			v.Assets.ImgJob = p.Call("loadImage", "assets/cash.png")
			v.Assets.ImgMake = p.Call("loadImage", "assets/card-game.png")
			v.Assets.ImgDodge = p.Call("loadImage", "assets/jogging.png")
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

			cards := map[string]CardView{}
			for cskey, cs := range v.Gameplay.Desktop.CardStacks {
				for _, c := range cs {
					if _, isExist := cards[c.ID]; isExist {
						panic("duplicated!!" + c.ID)
					}
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

			for k, cardView := range v.GameplayView.CardViews {
				cardView.Card = cards[k].Card
				v.GameplayView.CardViews[k] = cardView
			}

			offsetX := 100
			offsetY := 100
			for _, player := range v.Gameplay.Players {
				for i, card := range v.Gameplay.Desktop.CardStacks[gameplay.CardStackIDHand(player)] {
					cardView := v.GameplayView.CardViews[card.ID]
					tx := float32(offsetX + i*CardWidth)
					ty := float32(offsetY)
					v.RenderCardView(p, cardView, tx, ty)
				}
				offsetY += CardHeight

				for i, card := range v.Gameplay.Desktop.CardStacks[gameplay.CardStackIDEquip(player)] {
					cardView := v.GameplayView.CardViews[card.ID]
					tx := float32(offsetX + i*CardWidth)
					ty := float32(offsetY)
					v.RenderCardView(p, cardView, tx, ty)
				}
				offsetY += CardHeight
			}

			offsetX = CanvasWidth >> 1
			offsetY = CanvasHeight >> 1
			for i, card := range v.Gameplay.Desktop.CardStacks[gameplay.CardStackGravyard] {
				cardView := v.GameplayView.CardViews[card.ID]
				tx := float32(offsetX + i*2)
				ty := float32(offsetY)
				v.RenderCardView(p, cardView, tx, ty)
			}

			offsetX = 0
			offsetY = 0
			for i, card := range v.Gameplay.Desktop.CardStacks[gameplay.CardStackHome] {
				cardView := v.GameplayView.CardViews[card.ID]
				tx := float32(offsetX + i*2)
				ty := float32(offsetY)
				v.RenderCardView(p, cardView, tx, ty)
			}

			offsetX = 0
			offsetY = CanvasHeight - PlayerHeight
			for i, player := range gameplay.ValsStringPlayer(v.Gameplay.Players) {
				tx := float32(offsetX + i*PlayerWidth)
				ty := float32(offsetY)
				v.RenderPlayer(p, v.Gameplay, player, tx, ty)
			}

			if msg != nil {

				tx := PlayerWidth << 1
				ty := CanvasHeight - MsgHeight

				p.Call("push")
				p.Call("strokeWeight", 3)
				p.Call("fill", 100)
				p.Call("stroke", 255)
				p.Call("rect", tx, ty, MsgWidth, MsgHeight)

				p.Call("strokeWeight", 1)
				p.Call("fill", 255)
				p.Call("stroke", 255)
				p.Call("text", msg.(string), tx, ty+(MsgHeight>>1))
				p.Call("pop")
			}
		})
	}, "canvas")
}
