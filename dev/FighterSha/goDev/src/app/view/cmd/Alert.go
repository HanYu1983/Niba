package cmd

import "fmt"

// Alert is
func (v CmdView) Alert(msg interface{}) {
	switch t := msg.(type) {
	case error:
		fmt.Println(t.Error())
	case string:
		fmt.Println(t)
	default:
		panic(msg)
	}
}
