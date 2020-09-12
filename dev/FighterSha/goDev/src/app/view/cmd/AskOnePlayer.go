package cmd

import (
	"app/gameplay"
	"bufio"
	"fmt"
	"os"
	"strconv"
)

// AskOnePlayer is
func (view CmdView) AskOnePlayer(gameplayCtx gameplay.Gameplay, player gameplay.Player, players map[string]gameplay.Player) (gameplay.Player, error) {
	otherPlayers := gameplay.FilterPlayer(gameplay.ValsStringPlayer(players), func(p gameplay.Player) bool {
		return p.ID != player.ID
	})
	if len(otherPlayers) == 0 {
		return player, fmt.Errorf("players length not be 0")
	}
	scanner := bufio.NewScanner(os.Stdin)
	for {
		fmt.Println("==Players==")
		for i, otherPlayer := range otherPlayers {
			fmt.Printf("%v) %+v\n", i, otherPlayer)
		}
		fmt.Println("AskOnePlayer->")
		scanner.Scan()
		idxStr := scanner.Text()
		if idxStr == "exit" {
			return gameplay.Player{}, nil
		}
		idx, err := strconv.Atoi(idxStr)
		if err != nil {
			fmt.Println("Please enter integer")
			continue
		}
		return otherPlayers[idx], nil
	}
}
