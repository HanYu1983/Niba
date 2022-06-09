package optalg

import (
	"fmt"
	"tool/astar"
)

// OptAlgByAstar is
// mutateCount 每次產生新解的個數
// forwardCount 新解中一定要最少的數目朝目標前進
func OptAlgByAstar(mutateCount int, forwardCount int, estimateF func(IGene) float64, goalF func(IGene) bool, iteration int, gene IGene) (IGene, error) {
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
			if currGene.GetFitness() > bestGene.GetFitness() {
				bestGene = currGene
			}
			generation++
			if generation >= iteration {
				return true
			}
			return goalF(gene)
		},
		func(curr *astar.Node) []astar.NeighborsNode {
			currIdx := curr.Pather.(int)
			currGene := geneMapping[currIdx]
			ret := []astar.NeighborsNode{}
			for i := 0; i < mutateCount; i++ {
				nextGene := currGene
				if i < forwardCount {
					nextGene, err = HillClimbing(10, currGene)
					if err != nil {
						fmt.Println(err.Error())
						continue
					}
				} else {
					nextGene, err = currGene.Mutate()
					if err != nil {
						fmt.Println(err.Error())
						continue
					}
					nextGene, err = currGene.CalcFitness()
					if err != nil {
						fmt.Println(err.Error())
						continue
					}
				}
				// 倒數, 因為要優先選最小值
				cost := 1.0 / nextGene.GetFitness()
				currIdx := len(geneMapping)
				geneMapping = append(geneMapping, nextGene)
				ret = append(ret, astar.NeighborsNode{
					Pather: currIdx,
					Cost:   cost,
				})
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
