package optalg

import (
	"time"
)

// HillClimbing is 爬山演算法
func HillClimbing(iteration int, gene IGene) (IGene, error) {
	var err error
	gene, err = gene.CalcFitness()
	if err != nil {
		return nil, err
	}
	for i := 0; i < iteration; i++ {
		// fmt.Printf("[HillClimbing] ieration(%v/%v) score(%v)\n", i, iteration, gene.GetFitness())
		time.Sleep(1)
		clone, err := gene.Mutate()
		if err != nil {
			return nil, err
		}
		clone, err = clone.CalcFitness()
		if err != nil {
			return nil, err
		}
		if clone.GetFitness() > gene.GetFitness() {
			gene = clone
		}
	}
	return gene, nil
}
