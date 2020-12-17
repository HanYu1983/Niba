package app

import (
	"app/tool/data"
	"app/tool/ui_data"
)

func CreateRobotMenu(origin ui_data.UI, unitID string) (ui_data.UI, error) {
	return origin, nil
}

func CreateItemMenu(origin ui_data.UI, unitID string) (ui_data.UI, error) {
	return origin, nil
}

func UnitMenuPhase(origin ui_data.UI, unitID string) (ui_data.UI, error) {
	ctx := origin
	if robot, is := model.QueryGameplayRobots()[unitID]; is {
		// append menu
		ctx, err := CreateRobotMenu(ctx, robot.ID)
		if err != nil {
			return origin, err
		}
	WaitMenu:
		for {
			ctx, _, cancel, err := Menu2DStep(ctx, ui_data.Menu2DUnitMenu)
			if err != nil {
				return origin, err
			}
			if cancel {
				break WaitMenu
			}
			topMenu := ctx.Menu2Ds[ui_data.Menu2DUnitMenu]
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
		ctx, selection, _, err := Menu2DStep(ctx, ui_data.Menu2DUnitMenu)
		if err != nil {
			return origin, err
		}
		var _ = selection
		// pop menu
		return ctx, nil
	}
	return origin, nil
}

func SystemMenuPhase(origin ui_data.UI) (ui_data.UI, error) {
	return origin, nil
}

func PlayerTurnPhase(origin ui_data.UI) (ui_data.UI, error) {
	model.Push()
	defer model.Pop()
	var err error
	ctx := origin
	for {
		view.Render(ctx)
		cmd := view.AskCommand()
		err = model.HandlePlayerTurnEvent(cmd)
		if err != nil {
			model.Reset()
			return origin, err
		}
		switch detail := cmd.(type) {
		case data.CommandKeyDown:
			switch detail.KeyCode {
			default:
				cursor := model.QueryCursorInMap()
				var notFound string
				unitID, err := model.QueryUnitByPosition(cursor)
				if err != nil {
					model.Reset()
					return origin, err
				}
				if unitID == notFound {
					ctx, err = SystemMenuPhase(ctx)
				} else {
					ctx, err = UnitMenuPhase(ctx, unitID)
				}
				if err != nil {
					model.Reset()
					view.Alert(err)
					continue
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
func EnemyTurnPhase(origin ui_data.UI) (ui_data.UI, error) {
	model.Push()
	defer model.Pop()
	return origin, nil
}

func TurnPhase(origin ui_data.UI) (ui_data.UI, error) {
	switch model.QueryActivePlayer() {
	case data.PlayerIDPlayer:
		return PlayerTurnPhase(origin)
	default:
		return EnemyTurnPhase(origin)
	}
}

func GameLoop(origin ui_data.UI) (ui_data.UI, error) {
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
