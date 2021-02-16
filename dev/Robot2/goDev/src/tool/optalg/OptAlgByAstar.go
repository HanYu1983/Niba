package optalg

import (
	"fmt"
	"tool/astar"
)

// OptAlgByAstar is
func OptAlgByAstar(mutateCount int, estimateF func(IGene) float64, goalF func(IGene) bool, iteration int, gene IGene) (IGene, error) {
	gene, err := gene.CalcFitness()
	if err != nil {
		return nil, err
	}
	geneMapping := []IGene{}
	currIdx := len(geneMapping)
	geneMapping = append(geneMapping, gene)
	bestGene := gene
	generation := 0
	astar.ShortedPathTree(currIdx,
		func(curr *astar.Node) bool {
			currIdx := curr.Pather.(int)
			currGene := geneMapping[currIdx]
			bestGene = currGene
			generation++
			if generation >= iteration {
				return true
			}
			fmt.Println("====")
			fmt.Println(bestGene.GetFitness())
			return goalF(gene)
		},
		func(curr *astar.Node) []astar.NeighborsNode {
			currIdx := curr.Pather.(int)
			currGene := geneMapping[currIdx]
			ret := []astar.NeighborsNode{}
			for i := 0; i < mutateCount; i++ {
				nextGene := currGene
				// 挑到更好的解
				for i := 0; i < iteration; i++ {
					nextGene, err = currGene.Mutate()
					if err != nil {
						fmt.Println(err.Error())
						continue
					}
					nextGene, err = nextGene.CalcFitness()
					if err != nil {
						fmt.Println(err.Error())
						continue
					}
					if nextGene.GetFitness() <= currGene.GetFitness() {
						continue
					}
					// 倒數, 因為要優先選最小值
					cost := 1.0 / nextGene.GetFitness()
					currIdx := len(geneMapping)
					geneMapping = append(geneMapping, nextGene)
					ret = append(ret, astar.NeighborsNode{
						Pather: currIdx,
						Cost:   cost,
					})
					break
				}
			}
			return ret
		},
		func(curr *astar.Node) float64 {
			currIdx := curr.Pather.(int)
			currGene := geneMapping[currIdx]
			return estimateF(currGene)
		})
	return bestGene, nil
}
