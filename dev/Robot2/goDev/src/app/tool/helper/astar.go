package helper

import (
	"app/tool/protocol"
	"tool/astar"
)

func MoveRangeTree2MoveRange(tree astar.NodeMap) []protocol.Position {
	moveRange := []protocol.Position{}
	for key := range tree {
		moveRange = append(moveRange, key.(protocol.Position))
	}
	return moveRange
}

func MoveRangeTree2Path(tree astar.NodeMap, from protocol.Position) []protocol.Position {
	path := astar.BuildPath(tree[from])
	ret := []protocol.Position{}
	for _, posObj := range path {
		ret = append(ret, posObj.(protocol.Position))
	}
	return ret
}
