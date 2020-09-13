package template

import (
	"app/gameplay"
	"bufio"
	"fmt"
	"os"
	"strconv"
)

// AskOneItem is
func AskOneItem(gameplayCtx gameplay.Gameplay, player gameplay.Player, title string, options []Item, validFn func(Item) bool) (Item, error) {
	fmt.Println(title)
	if len(options) == 0 {
		return *new(Item), nil
	}
	scanner := bufio.NewScanner(os.Stdin)
	for {
		fmt.Println("==Item==")
		for i, card := range options {
			fmt.Printf("%v) %+v\n", i, card)
		}
		fmt.Print("AskOneItem->")
		scanner.Scan()
		idxStr := scanner.Text()
		if idxStr == "exit" {
			return *new(Item), nil
		}
		idx, err := strconv.Atoi(idxStr)
		if err != nil {
			fmt.Println("Please enter integer")
			continue
		}
		if idx >= len(options) {
			fmt.Println("Please enter valid integer")
			continue
		}
		pickCard := options[idx]
		if validFn(pickCard) == false {
			fmt.Printf("card invalid %+v\n", pickCard)
			continue
		}
		return pickCard, nil
	}
}
