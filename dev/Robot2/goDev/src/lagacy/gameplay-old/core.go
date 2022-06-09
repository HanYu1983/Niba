package gameplay

import (
	"app/tool/data"
	"app/tool/def"
)

func CreateRobotMenu(origin data.Gameplay, unitID string) (data.Gameplay, error) {
	gameplay := origin
	menu := data.Menu{}
	if origin.ActivePlayerID == protocol.PlayerIDPlayer {
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

func GetRobotMoveRange(origin data.Gameplay, robotID string) ([]protocol.Position, error) {
	return []protocol.Position{}, nil
}

var (
	UnitByPosition = map[protocol.Position]string{}
)

func SearchUnitByPosition(posComs map[string]protocol.Position, pos protocol.Position) string {
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
	UnitByRegion = map[protocol.Position][]string{}
)

func proj(pos protocol.Position) protocol.Position {
	pos[0] = pos[0] / 5
	pos[1] = pos[1] / 5
	return pos
}

func SearchUnitByRegion(posComs map[string]protocol.Position, p1 protocol.Position, p2 protocol.Position) []string {
	// remove
	for unitPos, unitID := range UnitByPosition {
		unitPos = proj(unitPos)
		if _, has := posComs[unitID]; has == false {
			nextUnitByRegion := []string{}
			for _, id := range UnitByRegion[unitPos] {
				if id == unitID {
					continue
				}
				nextUnitByRegion = append(nextUnitByRegion, id)
			}
			UnitByRegion[unitPos] = nextUnitByRegion
		}
	}
	for unitID, unitPos := range posComs {
		unitPos = proj(unitPos)
		if _, has := UnitByPosition[unitPos]; has == false {
			// add
			UnitByRegion[unitPos] = append(UnitByRegion[unitPos], unitID)
		} else {
			// update
		}
	}

	p1 = proj(p1)
	p2 = proj(p2)
	ret := []string{}
	for x := p1[0]; x <= p2[0]; x++ {
		for y := p1[1]; y <= p2[1]; y++ {
			if unitIDs, has := UnitByRegion[protocol.Position{x, y}]; has {
				ret = append(ret, unitIDs...)
			}
		}
	}
	return ret
}

var (
	view = def.View
)
