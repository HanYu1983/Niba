package gameplay

import (
	"app/tool/uidata"
)

func HandleCamera(origin uidata.UI, evt interface{}) (uidata.UI, error) {
	ctx := origin
	switch detail := evt.(type) {
	case uidata.CommandKeyDown:
		switch detail.KeyCode {
		case uidata.KeyCodeArrowUp:
			gameplayPage := ctx.GameplayPages[uidata.PageGameplay]
			gameplayPage.Camera[1]--
			ctx.GameplayPages = uidata.AssocStringGameplayPage(ctx.GameplayPages, uidata.PageGameplay, gameplayPage)
		case uidata.KeyCodeArrowDown:
			gameplayPage := ctx.GameplayPages[uidata.PageGameplay]
			gameplayPage.Camera[1]++
			ctx.GameplayPages = uidata.AssocStringGameplayPage(ctx.GameplayPages, uidata.PageGameplay, gameplayPage)
		case uidata.KeyCodeArrowLeft:
			gameplayPage := ctx.GameplayPages[uidata.PageGameplay]
			gameplayPage.Camera[0]--
			ctx.GameplayPages = uidata.AssocStringGameplayPage(ctx.GameplayPages, uidata.PageGameplay, gameplayPage)
		case uidata.KeyCodeArrowRight:
			gameplayPage := ctx.GameplayPages[uidata.PageGameplay]
			gameplayPage.Camera[0]++
			ctx.GameplayPages = uidata.AssocStringGameplayPage(ctx.GameplayPages, uidata.PageGameplay, gameplayPage)
		}
	}
	return ctx, nil
}
