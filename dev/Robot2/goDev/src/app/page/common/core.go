package common

import (
	"app/tool/data"
	"app/tool/def"
	"app/tool/viewer"
)

var (
	view  viewer.IViwer = def.View
	model IModel        = &DefaultModel{App: App{
		Money: 10000,
	}}
)

var (
	View  = view
	Model = model
)

const (
	size = 10
)

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
	for unitPos, unitID := range unitByPosition {
		unitPos = proj(unitPos)
		if _, has := posComs[unitID]; has == false {
			nextUnitByRegion := []string{}
			for _, id := range unitByRegion[unitPos] {
				if id == unitID {
					continue
				}
				nextUnitByRegion = append(nextUnitByRegion, id)
			}
			unitByRegion[unitPos] = nextUnitByRegion
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
