package genalg

import (
	"math"
	"math/rand"
)

func HillClimbing(iteration int, gene IGene) (IGene, error) {
	for i := 0; i < iteration; i++ {
		clone, err := gene.Mutate()
		if err != nil {
			return nil, err
		}
		if clone.GetFitness() > gene.GetFitness() {
			gene = clone
		}
	}
	return gene, nil
}

func p(old float64, new float64, T float64) float64 {
	if new < old {
		return 1.0
	}
	return math.Exp((old - new) / T)
}

// https://ccckmit.github.io/aibook/htm/simulatedAnnealing.html
func SimulatedAnnealing(iteration int, gene IGene) (IGene, error) {
	T := 100.0
	for i := 0; i < iteration; i++ {
		clone, err := gene.Mutate()
		if err != nil {
			return gene, err
		}
		T = T * 0.999
		if p(1/gene.GetFitness(), 1/clone.GetFitness(), T) > rand.Float64() {
			gene = clone
		}
	}
	return gene, nil
}
