package optalg

import (
	"fmt"
	"math"
	"math/rand"
)

// SimulatedAnnealing is 退火演算法
// 當溫度(T)幾乎降到零的時候，模擬退火法基本上就會退化成爬山演算法
func SimulatedAnnealing(T float64, factor float64, iteration int, gene IGene) (IGene, error) {
	if T <= 0 {
		return nil, fmt.Errorf("T can not be 0")
	}
	var err error
	gene, err = gene.CalcFitness()
	if err != nil {
		return nil, err
	}
	// http://web.ntnu.edu.tw/~algo/Optimization.html
	P := func(old float64, new float64, T float64) float64 {
		if new > old {
			return 1.0
		}
		return math.Exp((new - old) / T)
	}
	for i := 0; i < iteration; i++ {
		clone, err := gene.Mutate()
		if err != nil {
			return nil, err
		}
		clone, err = clone.CalcFitness()
		if err != nil {
			return nil, err
		}
		T = T * factor
		old := gene.GetFitness()
		new := clone.GetFitness()
		pv := P(old, new, T)
		if pv > rand.Float64() {
			gene = clone
		}
	}
	return gene, nil
}
