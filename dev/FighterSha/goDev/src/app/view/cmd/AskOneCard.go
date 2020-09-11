package cmd

import (
	"app/gameplay"
	"tool/desktop"
)

// AskOneCard 等待玩家選一張卡
func (view CmdView) AskOneCard(gameplay gameplay.Gameplay, player gameplay.Player, targetCS desktop.CardStack) (desktop.Card, error) {
	return desktop.Card{}, nil
}
