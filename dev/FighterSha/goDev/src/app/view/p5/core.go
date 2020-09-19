package p5

import (
	"app/gameplay"
	"tool/desktop"

	"github.com/gopherjs/gopherjs/js"
)

const (
	PageStart    = ""
	PageGameplay = "PageGameplay"
)

type Position struct {
	X float32
	Y float32
}

type CardView struct {
	Card        desktop.Card
	CardStackID string
	Position    Position
}

type GameplayView struct {
	CardViews map[string]CardView
}

type Assets struct {
	ImgHeart      *js.Object
	ImgMoney      *js.Object
	ImgCardBack   *js.Object
	ImgKill       *js.Object
	ImgStealMoney *js.Object
	ImgSteal      *js.Object
	ImgDodge      *js.Object
	ImgArm        *js.Object
	ImgArmor      *js.Object
	ImgAccessory  *js.Object
	ImgOtherEquip *js.Object
	ImgJob        *js.Object
	ImgMake       *js.Object
}

type P5View struct {
	Page         string
	Gameplay     gameplay.Gameplay
	EventChan    chan interface{}
	AlertPopup   chan string
	GameplayView GameplayView
	Assets       Assets
}

type StartGameplayEvent struct{}
