package p5

import (
	"app/gameplay"
	"tool/desktop"
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

type P5View struct {
	Page         string
	Gameplay     gameplay.Gameplay
	EventChan    chan interface{}
	AlertPopup   chan string
	GameplayView GameplayView
}

type StartGameplayEvent struct{}
