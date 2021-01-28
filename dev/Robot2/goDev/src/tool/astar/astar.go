package astar

// 修改自github.com/beefsack/go-astar
import (
	"container/heap"
	"reflect"
)

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

func ReverseSlice(s interface{}) {
	size := reflect.ValueOf(s).Len()
	swap := reflect.Swapper(s)
	for i, j := 0, size-1; i < j; i, j = i+1, j-1 {
		swap(i, j)
	}
}

func BuildPath(current *Node) (path []interface{}) {
	p := []interface{}{}
	curr := current
	for curr != nil {
		p = append(p, curr.Pather)
		curr = curr.parent
	}
	ReverseSlice(p)
	return p
}

type NeighborsNode struct {
	Pather interface{}
	Cost   float64
}

func ShortedPathTree(
	from interface{},
	isGoal func(curr *Node) bool,
	pathNeighbors func(curr *Node) []NeighborsNode,
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
		isFind := isGoal(current)
		if isFind {
			return nm, true
		}
		for _, neighbor := range pathNeighbors(current) {
			Cost := current.Cost + neighbor.Cost
			neighborNode := nm.get(neighbor.Pather)
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
