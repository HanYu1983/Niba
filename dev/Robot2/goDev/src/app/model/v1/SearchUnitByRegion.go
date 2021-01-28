package v1

import (
	"app/tool"
	"app/tool/protocol"
)

var (
	unitByRegion = map[protocol.Position][]string{}
)

func proj(pos protocol.Position) protocol.Position {
	pos[0] = pos[0] / 5
	pos[1] = pos[1] / 5
	return pos
}

func SearchUnitByRegion(posComs map[string]protocol.Position, p1 protocol.Position, p2 protocol.Position) []string {
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

	// add
	for unitID, unitPos := range posComs {
		unitPos = proj(unitPos)
		has := len(tool.FilterString(unitByRegion[unitPos], func(id string) bool {
			return id == unitID
		})) > 0
		if has == false {
			// add
			unitByRegion[unitPos] = append(unitByRegion[unitPos], unitID)
		}
	}

	// update
	for unitOldPos, units := range unitByRegion {
		for _, unitID := range units {
			unitNewPos := proj(posComs[unitID])
			if unitOldPos != unitNewPos {
				// remove old
				unitByRegion[unitOldPos] = tool.FilterString(units, func(id string) bool {
					return id != unitID
				})
				// add to new
				unitByRegion[unitNewPos] = append(units, unitID)
			}
		}
	}

	p1 = proj(p1)
	p2 = proj(p2)
	ret := []string{}
	for x := p1[0]; x <= p2[0]; x++ {
		for y := p1[1]; y <= p2[1]; y++ {
			if unitIDs, has := unitByRegion[protocol.Position{x, y}]; has {
				ret = append(ret, unitIDs...)
			}
		}
	}
	return ret
}
