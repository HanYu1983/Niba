package p5

import (
	"app/gameplay"
	"app/gameplay/ai"
	"tool/desktop"
)

// AskOneCard 等待玩家選一張卡
func (view *P5View) AskOneCard(gameplayCtx gameplay.Gameplay, player gameplay.Player, targetCS desktop.CardStack, validFn func(desktop.Card) bool) (desktop.Card, error) {
	return ai.AskOneCard(gameplayCtx, player, targetCS, validFn)
}
