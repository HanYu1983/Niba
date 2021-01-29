package log

import "fmt"

var (
	Category = map[string]bool{}
)

func Log(category string, title string, msg string) {
	if Category[category] == false {
		return
	}
	fmt.Printf("[%v][%v]%v\n", category, title, msg)
}
