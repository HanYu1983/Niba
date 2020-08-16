package gameplay

import (
	"tool/desktop"
)

var (
	CardTypeAttack     = desktop.CardType{"Attack"}
	CardTypeDodge      = desktop.CardType{"Dodge"}
	CardTypeStealMoney = desktop.CardType{"StealMoney"}
	CardTypeSteal      = desktop.CardType{"Steal"}
)

type Player struct {
	ID      string
	CardID  string
	GroupID string
	Order   int
}

type PlayerBasicCom struct {
	AttackTimes     int
	StealTimes      int
	StealMoneyTimes int
}

type Gameplay struct {
	Desktop         desktop.Desktop
	Players         map[string]Player
	PlayerBasicComs map[string]PlayerBasicCom
}

const (
	CardStackHome     = "_CardStackHome"
	CardStackGravyard = "_CardStackGravyard"
	CardStackEquip    = "_CardStackEquip"
)

var (
	DefaultGamePlay = Gameplay{
		desktop.Desktop{
			map[string]desktop.CardStack{
				CardStackHome:     desktop.CardStack{},
				CardStackGravyard: desktop.CardStack{},
				CardStackEquip:    desktop.CardStack{},
			},
		},
		map[string]Player{
			"A": Player{},
		},
		map[string]PlayerBasicCom{
			"A": PlayerBasicCom{},
		},
	}
)
