package astar

// 修改自github.com/beefsack/go-astar
import "container/heap"

type Node struct {
	Pather interface{}
	Cost   float64
	rank   float64
	parent *Node
	open   bool
	closed bool
	index  int
}

type NodeMap map[interface{}]*Node

func (nm NodeMap) get(p interface{}) *Node {
	n, ok := nm[p]
	if !ok {
		n = &Node{
			Pather: p,
		}
		nm[p] = n
	}
	return n
}

func BuildPath(current *Node) (path []interface{}) {
	p := []interface{}{}
	curr := current
	for curr != nil {
		p = append(p, curr.Pather)
		curr = curr.parent
	}
	return p
}

func ShortedPathTree(
	from interface{},
	isGoal func(curr *Node) (bool, bool),
	pathNeighbors func(curr *Node) []interface{},
	pathNeighborCost func(curr *Node, neighbor interface{}) float64,
	pathEstimatedCost func(curr *Node) float64,
) (tree NodeMap, found bool) {
	nm := NodeMap{}
	nq := &priorityQueue{}
	heap.Init(nq)
	fromNode := nm.get(from)
	fromNode.open = true
	heap.Push(nq, fromNode)
	for {
		if nq.Len() == 0 {
			return nm, false
		}
		current := heap.Pop(nq).(*Node)
		current.open = false
		current.closed = true
		isFind, isDone := isGoal(current)
		if isFind {
			if isDone {
				return nm, true
			}
			continue
		}
		for _, neighbor := range pathNeighbors(current) {
			Cost := current.Cost + pathNeighborCost(current, neighbor)
			neighborNode := nm.get(neighbor)
			if Cost < neighborNode.Cost {
				if neighborNode.open {
					heap.Remove(nq, neighborNode.index)
				}
				neighborNode.open = false
				neighborNode.closed = false
			}
			if !neighborNode.open && !neighborNode.closed {
				neighborNode.Cost = Cost
				neighborNode.open = true
				neighborNode.rank = Cost + pathEstimatedCost(neighborNode)
				neighborNode.parent = current
				heap.Push(nq, neighborNode)
			}
		}
	}
}
