package p5

import "app/gameplay"

type P5View struct {
	Gameplay   gameplay.Gameplay
	EventChan  chan interface{}
	AlertPopup chan string
}

type StartGameplayEvent struct{}
