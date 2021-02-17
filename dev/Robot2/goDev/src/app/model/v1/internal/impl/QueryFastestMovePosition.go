package impl

import (
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

func QueryFastestMovePosition(model Model, robot protocol.Robot, target protocol.Position) (bool, protocol.Position, astar.NodeMap, error) {
	originPos, err := protocol.TryGetStringPosition(model.App.Gameplay.Positions, robot.ID)
	if err != nil {
		return false, protocol.Position{}, nil, err
	}
	if originPos == target {
		return false, protocol.Position{}, nil, err
	}
	costFn, err := RobotMoveCost(model, robot)
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
			return float64(ox*ox + oy*oy)
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
		unitAtPos := SearchUnitByPosition(model.App.Gameplay.Positions, pos)
		if unitAtPos == notFound {
			return true, pos, tree, nil
		}
		if pos == originPos {
			break
		}
	}
	return false, originPos, nil, nil
}
