package gameplay

import (
	"app/tool"
	"app/tool/def"
	"app/tool/uidata"
)

func HandleCursor(origin uidata.UI, evt interface{}) (uidata.UI, error) {
	ctx := origin
	model := def.Model
	switch detail := evt.(type) {
	case uidata.CommandKeyDown:
		switch detail.KeyCode {
		case uidata.KeyCodeUp:
			gameplayPage := ctx.GameplayPages[uidata.PageGameplay]
			if gameplayPage.Cursor[1] == 0 {
				gameplayPage.Camera[1]--
			} else {
				gameplayPage.Cursor[1]--
			}
			model.SetCursor(tool.Local2World(gameplayPage.Camera, gameplayPage.Cursor))
			ctx.GameplayPages = uidata.AssocIntGameplayPage(ctx.GameplayPages, uidata.PageGameplay, gameplayPage)
		case uidata.KeyCodeDown:
			gameplayPage := ctx.GameplayPages[uidata.PageGameplay]
			if gameplayPage.Cursor[1] == uidata.MapHeight-1 {
				gameplayPage.Camera[1]++
			} else {
				gameplayPage.Cursor[1]++
			}
			model.SetCursor(tool.Local2World(gameplayPage.Camera, gameplayPage.Cursor))
			ctx.GameplayPages = uidata.AssocIntGameplayPage(ctx.GameplayPages, uidata.PageGameplay, gameplayPage)
		case uidata.KeyCodeLeft:
			gameplayPage := ctx.GameplayPages[uidata.PageGameplay]
			if gameplayPage.Cursor[0] == 0 {
				gameplayPage.Camera[0]--
			} else {
				gameplayPage.Cursor[0]--
			}
			model.SetCursor(tool.Local2World(gameplayPage.Camera, gameplayPage.Cursor))
			ctx.GameplayPages = uidata.AssocIntGameplayPage(ctx.GameplayPages, uidata.PageGameplay, gameplayPage)
		case uidata.KeyCodeRight:
			gameplayPage := ctx.GameplayPages[uidata.PageGameplay]
			if gameplayPage.Cursor[0] == uidata.MapWidth-1 {
				gameplayPage.Camera[0]++
			} else {
				gameplayPage.Cursor[0]++
			}
			model.SetCursor(tool.Local2World(gameplayPage.Camera, gameplayPage.Cursor))
			ctx.GameplayPages = uidata.AssocIntGameplayPage(ctx.GameplayPages, uidata.PageGameplay, gameplayPage)
		}
	}

	// switch detail := evt.(type) {
	// case uidata.CommandKeyDown:
	// 	switch detail.KeyCode {
	// 	case uidata.KeyCodeUp:
	// 		gameplayPage := ctx.GameplayPages[uidata.PageGameplay]
	// 		gameplayPage.Cursor[1]--
	// 		ctx.GameplayPages = uidata.AssocIntGameplayPage(ctx.GameplayPages, uidata.PageGameplay, gameplayPage)
	// 	case uidata.KeyCodeDown:
	// 		gameplayPage := ctx.GameplayPages[uidata.PageGameplay]
	// 		gameplayPage.Cursor[1]++
	// 		ctx.GameplayPages = uidata.AssocIntGameplayPage(ctx.GameplayPages, uidata.PageGameplay, gameplayPage)
	// 	case uidata.KeyCodeLeft:
	// 		gameplayPage := ctx.GameplayPages[uidata.PageGameplay]
	// 		gameplayPage.Cursor[0]--
	// 		ctx.GameplayPages = uidata.AssocIntGameplayPage(ctx.GameplayPages, uidata.PageGameplay, gameplayPage)
	// 	case uidata.KeyCodeRight:
	// 		gameplayPage := ctx.GameplayPages[uidata.PageGameplay]
	// 		gameplayPage.Cursor[0]++
	// 		ctx.GameplayPages = uidata.AssocIntGameplayPage(ctx.GameplayPages, uidata.PageGameplay, gameplayPage)
	// 	}
	// }
	return ctx, nil
}
