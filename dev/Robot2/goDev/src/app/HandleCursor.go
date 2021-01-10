package app

import (
	"app/tool/uidata"
)

func HandleCursor(origin uidata.UI, evt interface{}) (uidata.UI, error) {
	ctx := origin
	switch detail := evt.(type) {
	case uidata.CommandKeyDown:
		switch detail.KeyCode {
		case uidata.KeyCodeUp:
			gameplayPage := ctx.GameplayPages[uidata.PageGameplay]
			gameplayPage.Cursor[1]--
			ctx.GameplayPages = uidata.AssocIntGameplayPage(ctx.GameplayPages, uidata.PageGameplay, gameplayPage)
		case uidata.KeyCodeDown:
			gameplayPage := ctx.GameplayPages[uidata.PageGameplay]
			gameplayPage.Cursor[1]++
			ctx.GameplayPages = uidata.AssocIntGameplayPage(ctx.GameplayPages, uidata.PageGameplay, gameplayPage)
		case uidata.KeyCodeLeft:
			gameplayPage := ctx.GameplayPages[uidata.PageGameplay]
			gameplayPage.Cursor[0]--
			ctx.GameplayPages = uidata.AssocIntGameplayPage(ctx.GameplayPages, uidata.PageGameplay, gameplayPage)
		case uidata.KeyCodeRight:
			gameplayPage := ctx.GameplayPages[uidata.PageGameplay]
			gameplayPage.Cursor[0]++
			ctx.GameplayPages = uidata.AssocIntGameplayPage(ctx.GameplayPages, uidata.PageGameplay, gameplayPage)
		}
	}
	return ctx, nil
}
