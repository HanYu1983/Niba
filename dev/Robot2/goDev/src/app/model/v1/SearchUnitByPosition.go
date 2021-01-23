package v1

import "app/tool/data"

var (
	unitByPosition = map[data.Position]string{}
)

func SearchUnitByPosition(posComs map[string]data.Position, pos data.Position) string {
	// remove
	for unitPos, unitID := range unitByPosition {
		if _, has := posComs[unitID]; has == false {
			delete(unitByPosition, unitPos)
		}
	}
	// add or update
	for unitID, unitPos := range posComs {
		if _, has := unitByPosition[unitPos]; has == false {
			unitByPosition[unitPos] = unitID
		} else {
			unitByPosition[unitPos] = unitID
		}
	}
	if unitID, has := unitByPosition[pos]; has {
		return unitID
	}

	return ""
}
