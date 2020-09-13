package view

import (
	"tool/desktop"
)

type CmdUseCard struct {
	Card desktop.Card
}
type CmdSellCard struct {
	Card desktop.Card
}

const (
	ItemIDPower  = "力量藥"
	ItemIDPotion = "回復藥"
	ItemIDDodge  = "敏捷藥"
	ItemIDInt    = "智慧藥"
)

type CmdBuyItem struct {
	ItemID string
}

type CmdExit struct{}
type CmdEndTurn struct{}
