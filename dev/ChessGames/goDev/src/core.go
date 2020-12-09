package main

import (
	"app"

	"github.com/gopherjs/gopherjs/js"
)

//goDev/src/go generate
//go:generate genny -in tool/template/map.go -out app2/data/MapStringWeapon.go -pkg data gen "Key=string Value=Weapon"

func init() {
	js.Global.Get("console").Call("log", "gojs")
	app.Main()
}

func main() {

}
