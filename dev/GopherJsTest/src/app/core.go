package app

import "github.com/gopherjs/gopherjs/js"

// Println is
func Println(args ...interface{}) {
	js.Global.Get("console").Call("log", args...)
}
