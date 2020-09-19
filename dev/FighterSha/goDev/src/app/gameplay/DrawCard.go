package gameplay

import (
	"fmt"
	"tool/desktop"
)

// DrawCard is
func DrawCard(ctx IView, gameplayCtx Gameplay, player Player, cnt int) (Gameplay, error) {
	ctx.Alert(fmt.Sprintf("%v抽牌", player.ID))
	if cnt > len(gameplayCtx.Desktop.CardStacks[CardStackHome]) {
		cnt = len(gameplayCtx.Desktop.CardStacks[CardStackHome])
	}
	cards := gameplayCtx.Desktop.CardStacks[CardStackHome][:cnt]
	nextHomeCS := gameplayCtx.Desktop.CardStacks[CardStackHome][cnt:]
	gameplayCtx.Desktop.CardStacks = desktop.AssocStringCardStack(gameplayCtx.Desktop.CardStacks, CardStackHome, nextHomeCS)

	for idx := range cards {
		cards[idx].Player = player.ID
	}
	nextHand := append(gameplayCtx.Desktop.CardStacks[CardStackIDHand(player)], cards...)
	gameplayCtx.Desktop.CardStacks = desktop.AssocStringCardStack(gameplayCtx.Desktop.CardStacks, CardStackIDHand(player), nextHand)
	return gameplayCtx, nil
}
