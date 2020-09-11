package cmd

import (
	"app/gameplay"
	"fmt"
)

// Render is
func (v CmdView) Render(gameplayCtx gameplay.Gameplay) {
	fmt.Println("==== Gameplay ====")
	fmt.Printf("ActivePlayer: %v\n", gameplayCtx.ActivePlayerID)

	fmt.Println("== CardStacks ==")
	for key, cs := range gameplayCtx.Desktop.CardStacks {
		fmt.Printf("%+v: %d\n", key, len(cs))
	}

	fmt.Println("== Hand ==")
	hand := gameplayCtx.Desktop.CardStacks[gameplay.CardStackIDHand(gameplay.PlayerA)]
	for idx, card := range hand {
		fmt.Printf("%d): %+v\n", idx, card)
	}
	fmt.Println("==== Gameplay ====")
}
