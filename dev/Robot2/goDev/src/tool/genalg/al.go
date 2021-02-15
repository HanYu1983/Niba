package genalg

import (
	"fmt"
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

// https://ccckmit.github.io/aibook/htm/simulatedAnnealing.html
func p(old float64, new float64, T float64) float64 {
	if new < old {
		return 1.0
	}
	return math.Exp((old - new) / T)
}

// SimulatedAnnealing is 當溫度(T)幾乎降到零的時候，模擬退火法基本上就會退化成爬山演算法
func SimulatedAnnealing(T float64, iteration int, gene IGene) (IGene, error) {
	if T <= 0 {
		return nil, fmt.Errorf("T can not be 0")
	}
	for i := 0; i < iteration; i++ {
		clone, err := gene.Mutate()
		if err != nil {
			return nil, err
		}
		T = T * 0.999
		// 改用倒數, 因為退火演算法的機率公式是優先選小值為前提
		old := 1.0 / gene.GetFitness()
		new := 1.0 / clone.GetFitness()
		pv := p(old, new, T)
		if pv > rand.Float64() {
			gene = clone
		}
	}
	return gene, nil
}
