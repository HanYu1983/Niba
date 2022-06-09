package cmd

import (
	"app/gameplay"
	"app/gameplay/ai"
	"tool/desktop"
)

// AskOneCard 等待玩家選一張卡
func (view CmdView) AskOneCard(gameplayCtx gameplay.Gameplay, player gameplay.Player, targetCS desktop.CardStack, validFn func(desktop.Card) bool) (desktop.Card, error) {
	if player.GroupID != gameplay.GroupIDPlayer {
		return ai.AskOneCard(gameplayCtx, player, targetCS, validFn)
	}
	return AskOneDesktopCard(gameplayCtx, player, "AskOneCard", targetCS, validFn)
}
