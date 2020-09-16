package p5

import "fmt"

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
	v.AlertPopup <- m
}
