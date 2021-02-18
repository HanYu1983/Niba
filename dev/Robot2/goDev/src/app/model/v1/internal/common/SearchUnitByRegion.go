package common

import (
	"app/tool/protocol"
)

var (
	unitByRegion = map[protocol.Position]map[string]bool{}
)

func proj(pos protocol.Position) protocol.Position {
	pos[0] = pos[0] / 5
	pos[1] = pos[1] / 5
	return pos
}

func SearchUnitByRegion(posComs map[string]protocol.Position, p1 protocol.Position, p2 protocol.Position) []string {
	// remove
	for unitPos, units := range unitByRegion {
		for unitID := range units {
			if _, has := posComs[unitID]; has == false {
				delete(unitByRegion[unitPos], unitID)
			}
		}
	}

	// add
	for unitID, unitPos := range posComs {
		unitPos = proj(unitPos)
		has := unitByRegion[unitPos][unitID]
		if has == false {
			if unitByRegion[unitPos] == nil {
				unitByRegion[unitPos] = map[string]bool{}
			}
			// add
			unitByRegion[unitPos][unitID] = true
		}
	}

	// update
	for unitOldPos, units := range unitByRegion {
		for unitID := range units {
			unitNewPos := proj(posComs[unitID])
			if unitOldPos != unitNewPos {
				// remove old
				delete(unitByRegion[unitOldPos], unitID)
				if unitByRegion[unitNewPos] == nil {
					unitByRegion[unitNewPos] = map[string]bool{}
				}
				// add to new
				unitByRegion[unitNewPos][unitID] = true
			}
		}
	}

	p1 = proj(p1)
	p2 = proj(p2)
	total := map[string]bool{}
	for x := p1[0]; x <= p2[0]; x++ {
		for y := p1[1]; y <= p2[1]; y++ {
			if unitIDs, has := unitByRegion[protocol.Position{x, y}]; has {
				for unitID := range unitIDs {
					total[unitID] = true
				}
			}
		}
	}
	ret := []string{}
	for unitID := range total {
		ret = append(ret, unitID)
	}
	return ret
}
