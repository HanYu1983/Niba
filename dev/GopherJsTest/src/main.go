package main

import (
	"net/http"

	"app"

	"github.com/gopherjs/gopherjs/js"
)

func main() {
	js.Global.Set("pet", map[string]interface{}{
		"New": New,
	})
	app.Println("XX")
	app.Println(js.Global.Get("pet"))

	resp, err := http.Get("http://www.yahoo.com.tw")
	app.Println(resp, err.Error())
}

// Pet is
type Pet struct {
	name string
}

// New is
func New(name string) *js.Object {
	return js.MakeWrapper(&Pet{name})
}

// Name is
func (p *Pet) Name() string {
	return p.name
}

// SetName is
func (p *Pet) SetName(name string) {
	p.name = name
}
