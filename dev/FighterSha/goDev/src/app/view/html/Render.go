package html

import (
	"app/gameplay"

	"github.com/gopherjs/gopherjs/js"
)

// Render is
func (v HTMLView) Render(gameplayCtx gameplay.Gameplay) {
	js.Global.Get("View").Call("Render", gameplayCtx)
}
