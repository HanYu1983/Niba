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
	var notFound string
	unitAtCursor := model.QueryUnitByPosition(model.GetCursor())
	if unitAtCursor != notFound {
		tree, err := model.QueryMoveRangeTree(unitAtCursor)
		if err != nil {
			return origin, err
		}
		moveRange := tool.MoveRangeTree2MoveRange(tree)
		model.SetMoveRange(moveRange)
	} else {
		model.SetMoveRange(nil)
	}
	return ctx, nil
}
