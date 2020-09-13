package cmd

import (
	"app/gameplay"
	"tool/desktop"
)

// AskOneCard 等待玩家選一張卡
func (view CmdView) AskOneCard(gameplayCtx gameplay.Gameplay, player gameplay.Player, targetCS desktop.CardStack, validFn func(desktop.Card) bool) (desktop.Card, error) {
	return AskOneDesktopCard(gameplayCtx, player, "AskOneCard", targetCS, validFn)
}
