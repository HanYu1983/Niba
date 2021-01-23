package v1

import (
	"app/tool"
	"app/tool/data"
)

var (
	unitByRegion = map[data.Position][]string{}
)

func proj(pos data.Position) data.Position {
	pos[0] = pos[0] / 5
	pos[1] = pos[1] / 5
	return pos
}

func SearchUnitByRegion(posComs map[string]data.Position, p1 data.Position, p2 data.Position) []string {
	// remove
	for unitPos, units := range unitByRegion {
		for _, unitID := range units {
			if _, has := posComs[unitID]; has == false {
				nextUnitByRegion := tool.FilterString(units, func(id string) bool {
					return id != unitID
				})
				unitByRegion[unitPos] = nextUnitByRegion
			}
		}
	}

	for unitID, unitPos := range posComs {
		unitPos = proj(unitPos)
		if _, has := unitByPosition[unitPos]; has == false {
			// add
			unitByRegion[unitPos] = append(unitByRegion[unitPos], unitID)
		} else {
			// update
		}
	}

	p1 = proj(p1)
	p2 = proj(p2)
	ret := []string{}
	for x := p1[0]; x <= p2[0]; x++ {
		for y := p1[1]; y <= p2[1]; y++ {
			if unitIDs, has := unitByRegion[data.Position{x, y}]; has {
				ret = append(ret, unitIDs...)
			}
		}
	}
	return ret
}
