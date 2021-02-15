package optalg

import (
	"fmt"
	"tool/astar"
)

// OptAlgByAstar is
func OptAlgByAstar(mutateCount int, estimateF func(IGene) float64, goalF func(IGene) bool, iteration int, gene IGene) (IGene, error) {
	i := 0
	tree, _ := astar.ShortedPathTree(gene,
		func(curr *astar.Node) bool {
			i++
			if i >= iteration {
				return true
			}
			gene := curr.Pather.(IGene)
			return goalF(gene)
		},
		func(curr *astar.Node) []astar.NeighborsNode {
			gene := curr.Pather.(IGene)
			ret := []astar.NeighborsNode{}
			for i := 0; i < mutateCount; i++ {
				nextGene, err := gene.Mutate()
				if err != nil {
					fmt.Println(err.Error())
					continue
				}
				nextGene, err = nextGene.CalcFitness()
				if err != nil {
					fmt.Println(err.Error())
					continue
				}
				// 倒數, 因為要優先選最小值
				cost := 1.0 / nextGene.GetFitness()
				ret = append(ret, astar.NeighborsNode{
					Pather: nextGene,
					Cost:   cost,
				})
			}
			return nil
		},
		func(curr *astar.Node) float64 {
			gene := curr.Pather.(IGene)
			return estimateF(gene)
		})
	var genes []IGene
	for gene := range tree {
		genes = append(genes, gene.(IGene))
	}
	return GetBest(genes), nil
}
