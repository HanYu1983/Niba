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

type CmdExit struct{}
type CmdEndTurn struct{}
