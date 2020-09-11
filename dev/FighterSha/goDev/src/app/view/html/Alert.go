package html

import "fmt"

func (v HTMLView) Alert(msg interface{}) {
	switch t := msg.(type) {
	case error:
		fmt.Println(t.Error())
	case string:
		fmt.Println(t)
	default:
		panic(msg)
	}
}
