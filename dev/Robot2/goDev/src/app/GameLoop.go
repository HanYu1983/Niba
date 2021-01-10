package app

import (
	"app/tool/data"
	"app/tool/uidata"
)

func CreateRobotMenu(origin uidata.UI, unitID string) (uidata.UI, error) {
	return origin, nil
}

func CreateItemMenu(origin uidata.UI, unitID string) (uidata.UI, error) {
	return origin, nil
}

func UnitMenuPhase(origin uidata.UI, unitID string) (uidata.UI, error) {
	ctx := origin
	if robot, is := model.QueryGameplayRobots()[unitID]; is {
		// append menu
		ctx, err := CreateRobotMenu(ctx, robot.ID)
		if err != nil {
			return origin, err
		}
	WaitMenu:
		for {
			ctx, _, cancel, tab, err := Menu2DStep(ctx, uidata.PageGameplay, uidata.Menu2DUnitMenu)
			if err != nil {
				return origin, err
			}
			if tab {
				continue
			}
			if cancel {
				break WaitMenu
			}
			topMenu := ctx.Menu2Ds[uidata.Menu2DUnitMenu]
			var _ = topMenu
		}
		// pop menu
		return ctx, nil
	}
	if item, is := model.QueryGameplayItems()[unitID]; is {
		// append menu
		ctx, err := CreateItemMenu(ctx, item.ID)
		if err != nil {
			return origin, err
		}
		ctx, selection, _, _, err := Menu2DStep(ctx, uidata.PageGameplay, uidata.Menu2DUnitMenu)
		if err != nil {
			return origin, err
		}
		var _ = selection
		// pop menu
		return ctx, nil
	}
	return origin, nil
}

func SystemMenuPhase(origin uidata.UI) (uidata.UI, error) {
	return origin, nil
}

func PlayerTurnPhase(origin uidata.UI) (uidata.UI, error) {
	model.Push()
	defer model.Pop()
	var err error
	ctx := origin
	for {
		view.Render(ctx)
		cmd := view.AskCommand()
		ctx, err = HandleCursor(ctx, cmd)
		if err != nil {
			model.Reset()
			return origin, err
		}
		ctx, err = HandleCamera(ctx, cmd)
		if err != nil {
			model.Reset()
			return origin, err
		}
		switch detail := cmd.(type) {
		case uidata.CommandKeyDown:
			switch detail.KeyCode {
			default:
				gameplayPage := ctx.GameplayPages[uidata.PageGameplay]
				cursor := gameplayPage.Cursor
				unitID, err := model.QueryUnitByPosition(cursor)
				if err != nil {
					model.Reset()
					return origin, err
				}
				var notFound string
				if unitID == notFound {
					ctx, err = SystemMenuPhase(ctx)
				} else {
					ctx, err = UnitMenuPhase(ctx, unitID)
				}
				if err != nil {
					model.Reset()
					return origin, err
				}
			}
		default:
			var _ = detail
		}
		if model.IsDone() {
			break
		}
	}
	return ctx, nil
}
func EnemyTurnPhase(origin uidata.UI) (uidata.UI, error) {
	model.Push()
	defer model.Pop()
	return origin, nil
}

func TurnPhase(origin uidata.UI) (uidata.UI, error) {
	switch model.QueryActivePlayer() {
	case data.PlayerIDPlayer:
		return PlayerTurnPhase(origin)
	default:
		return EnemyTurnPhase(origin)
	}
}

func GameLoop(origin uidata.UI) (uidata.UI, error) {
	model.Push()
	defer model.Pop()
	var err error
	ctx := origin
	for {
		ctx, err = TurnPhase(ctx)
		if err != nil {
			model.Reset()
			return origin, err
		}
		model.NextPlayer()
	}
	return ctx, nil
}
