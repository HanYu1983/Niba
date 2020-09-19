package p5

import (
	"fmt"
	"time"
)

func (v *P5View) Alert(msg interface{}) {
	var m string
	switch t := msg.(type) {
	case error:
		m = t.Error()
	case string:
		m = t
	default:
		m = fmt.Sprintf("%+v\n", msg)
	}
	fmt.Println(m)
	v.AlertPopup <- m
	time.Sleep(1 * time.Second)
}
