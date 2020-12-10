package main

import (
	"app"

	"github.com/gopherjs/gopherjs/js"
)

//goDev/src/go generate
//go:generate genny -in tool/template/list.go -out app/tool/ChessList.go -pkg tool gen "Item=Chess"
//go:generate genny -in tool/template/list.go -out app/tool/PositionList.go -pkg tool gen "Item=Position"

func init() {
	js.Global.Get("console").Call("log", "gojs")
	app.Main()
}

func main() {

}
