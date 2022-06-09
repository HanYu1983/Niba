package cmd

import (
	"app/gameplay"
	"fmt"
)

// Render is
func (v CmdView) Render(gameplayCtx gameplay.Gameplay) {
	/*
		fmt.Println("==== Gameplay ====")
		for csKey, cs := range gameplayCtx.Desktop.CardStacks {
			if csKey == gameplay.CardStackHome {
				continue
			}
			for _, card := range cs {
				fmt.Printf("%v): %+v\n", csKey, card.ID)
			}
		}
		fmt.Println("==== Gameplay ====")
	*/
	dupCheck := map[string]bool{}
	for csKey, cs := range gameplayCtx.Desktop.CardStacks {
		for _, c := range cs {
			if _, isExist := dupCheck[c.ID]; isExist {
				panic("duplicated!!" + c.ID + ")" + csKey)
			}
			dupCheck[c.ID] = true
		}
	}

	fmt.Println("==== Gameplay ====")
	activePlayer := gameplayCtx.Players[gameplayCtx.ActivePlayerID]
	fmt.Printf("ActivePlayer: %+v\n", activePlayer)

	fmt.Println("== CardStacks ==")
	for key, cs := range gameplayCtx.Desktop.CardStacks {
		fmt.Printf("%+v: %d\n", key, len(cs))
	}

	fmt.Println("== Players ==")
	for key, player := range gameplayCtx.Players {
		gameplay.UpdateCharacterCom(gameplayCtx, player, func(com gameplay.CharacterCardCom) (gameplay.CharacterCardCom, error) {
			fmt.Printf("%+v: %+v\n", key, com)
			return com, nil
		})
	}

	fmt.Println("== Hand ==")
	hand := gameplayCtx.Desktop.CardStacks[gameplay.CardStackIDHand(activePlayer)]
	for idx, card := range hand {
		fmt.Printf("%d): %+v\n", idx, card)
	}
	fmt.Println("==== Gameplay ====")
}
