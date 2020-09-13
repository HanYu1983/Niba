package ai

import (
	"app/gameplay"
	"tool/desktop"
)

// AskOneCard 等待玩家選一張卡
func AskOneCard(gameplayCtx gameplay.Gameplay, player gameplay.Player, targetCS desktop.CardStack, validFn func(desktop.Card) bool) (desktop.Card, error) {
	if len(targetCS) == 0 {
		return desktop.Card{}, nil
	}
	return desktop.Card{}, nil
}
