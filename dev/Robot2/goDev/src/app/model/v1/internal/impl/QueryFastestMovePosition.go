package impl

import (
	"app/model/v1/internal/common"
	"app/model/v1/internal/tool/types"
	"app/tool/protocol"
	"sort"
	"tool/astar"
)

type ByAstarNodeEstimatedCost []*astar.Node

func (a ByAstarNodeEstimatedCost) Len() int      { return len(a) }
func (a ByAstarNodeEstimatedCost) Swap(i, j int) { a[i], a[j] = a[j], a[i] }
func (a ByAstarNodeEstimatedCost) Less(i, j int) bool {
	return a[i].Rank-a[i].Cost < a[j].Rank-a[j].Cost
}

func QueryFastestMovePosition(model types.Model, weightMap [][]float64, robotID string, target protocol.Position) (bool, protocol.Position, astar.NodeMap, error) {
	originPos, err := protocol.TryGetStringPosition(model.App.Gameplay.Positions, robotID)
	if err != nil {
		return false, protocol.Position{}, nil, err
	}
	if originPos == target {
		return false, protocol.Position{}, nil, err
	}
	movePower, err := common.QueryRobotMovePower(model, robotID)
	if err != nil {
		return false, protocol.Position{}, nil, err
	}
	costFn, err := common.RobotMoveCost(model, robotID, movePower, false)
	if err != nil {
		return false, protocol.Position{}, nil, err
	}
	tree, _ := astar.ShortedPathTree(
		originPos,
		func(curr *astar.Node) bool {
			currPos := curr.Pather.(protocol.Position)
			return currPos == target
		},
		costFn,
		func(curr *astar.Node) float64 {
			currPos := curr.Pather.(protocol.Position)
			ox, oy := target[0]-currPos[0], target[1]-currPos[1]
			targetCost := float64(ox*ox + oy*oy)
			weightCost := 0.0
			if weightMap != nil {
				if ox >= 0 && ox < len(weightMap[0]) {
					if oy >= 0 && oy < len(weightMap) {
						weightCost = weightMap[oy][ox]
					}
				}
			}
			return targetCost + weightCost
		},
	)
	nodes := []*astar.Node{}
	for _, node := range tree {
		nodes = append(nodes, node)
	}
	sort.Sort(ByAstarNodeEstimatedCost(nodes))
	for _, node := range nodes {
		pos := node.Pather.(protocol.Position)
		var notFound string
		unitAtPos := common.SearchUnitByPosition(model.App.Gameplay.Positions, pos)
		if unitAtPos == notFound {
			return true, pos, tree, nil
		}
		if pos == originPos {
			break
		}
	}
	return false, originPos, nil, nil
}
