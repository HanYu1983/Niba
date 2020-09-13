package cmd

import (
	"app/gameplay"
	"bufio"
	"fmt"
	"os"
	"strconv"
)

// AskOption is
func (v CmdView) AskOption(gameplayCtx gameplay.Gameplay, player gameplay.Player, title string, options []string) (string, error) {
	if len(options) == 0 {
		return "", nil
	}
	scanner := bufio.NewScanner(os.Stdin)
	for {
		fmt.Println("==Options==")
		fmt.Println(title)
		for i, option := range options {
			fmt.Printf("%v) %+v\n", i, option)
		}
		fmt.Print("AskOption->")
		scanner.Scan()
		idxStr := scanner.Text()
		if idxStr == "exit" {
			return "", nil
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
		picked := options[idx]
		return picked, nil
	}
}
