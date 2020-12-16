package gameplay

import (
	"app/data"
	"app/lib"
)

func CreateRobotMenu(origin data.Gameplay, unitID string) (data.Gameplay, error) {
	gameplay := origin
	menu := data.Menu{}
	if origin.ActivePlayerID == data.PlayerIDPlayer {
		menu.Options = [][]string{
			[]string{data.MenuOptionMove},
			[]string{"weapon1"},
		}
		menu.WeaponID = 1
		menu.TransformID = 2
	}
	gameplay.MenuStack = append(gameplay.MenuStack, menu)
	return gameplay, nil
}

func CreateItemMenu(origin data.Gameplay, itemID string) (data.Gameplay, error) {
	return origin, nil
}

func GetRobotMoveRange(origin data.Gameplay, robotID string) ([]data.Position, error) {
	return []data.Position{}, nil
}

var (
	UnitByPosition = map[data.Position]string{}
)

func SearchUnitByPosition(posComs map[string]data.Position, pos data.Position) string {
	// remove
	for unitPos, unitID := range UnitByPosition {
		if _, has := posComs[unitID]; has == false {
			delete(UnitByPosition, unitPos)
		}
	}
	// add or update
	for unitID, unitPos := range posComs {
		if _, has := UnitByPosition[unitPos]; has == false {
			UnitByPosition[unitPos] = unitID
		} else {
			UnitByPosition[unitPos] = unitID
		}
	}
	if unitID, has := UnitByPosition[pos]; has {
		return unitID
	}

	return ""
}

var (
	view = lib.View
)

func Render(ctx data.Gameplay) {
	view.Render(data.App{
		Page:     data.PageGameplay,
		Gameplay: ctx,
	})
}
