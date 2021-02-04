package v1

import (
	"app/tool/protocol"
	"sort"
	"tool/astar"
)

type ByAstarNodeRank []*astar.Node

func (a ByAstarNodeRank) Len() int           { return len(a) }
func (a ByAstarNodeRank) Swap(i, j int)      { a[i], a[j] = a[j], a[i] }
func (a ByAstarNodeRank) Less(i, j int) bool { return a[i].Rank < a[j].Rank }

func QueryFastestMovePosition(model model, robot protocol.Robot, target protocol.Position) (bool, protocol.Position, astar.NodeMap, error) {
	originPos, err := protocol.TryGetStringPosition(model.App.Gameplay.Positions, robot.ID)
	if err != nil {
		return false, protocol.Position{}, nil, err
	}
	costFn, err := RobotMoveCost(model, robot)
	if err != nil {
		return false, protocol.Position{}, nil, err
	}
	tree, _ := astar.ShortedPathTree(
		originPos,
		func(curr *astar.Node) bool {
			return false
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
	sort.Sort(ByAstarNodeRank(nodes))
	for _, node := range nodes {
		pos := node.Pather.(protocol.Position)
		var notFound string
		unitAtPos := SearchUnitByPosition(model.App.Gameplay.Positions, pos)
		if unitAtPos == notFound {
			return true, pos, tree, nil
		}
	}
	return false, originPos, nil, nil
}
