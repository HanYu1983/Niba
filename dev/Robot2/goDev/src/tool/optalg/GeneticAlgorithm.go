package optalg

import (
	"math/rand"
)

// GeneticAlgorithm is 基因演算法
func GeneticAlgorithm(mutateRate float64, iteration int, population []IGene) ([]IGene, error) {
	for i, gene := range population {
		gene, err := gene.CalcFitness()
		if err != nil {
			return nil, err
		}
		population[i] = gene
	}
	for i := 0; i < iteration; i++ {
		// 找出最優解來計算後選池(賭輪選擇法)
		bestGene := GetBest(population)
		pool := []IGene{}
		for i := 0; i < len(population); i++ {
			num := int((population[i].GetFitness() / bestGene.GetFitness()) * 100)
			for n := 0; n < num; n++ {
				pool = append(pool, population[i])
			}
		}
		nextPopulation := make([]IGene, len(population))
		for i := 0; i < len(population); i++ {
			// 選出較優的2個解
			r1, r2 := rand.Intn(len(pool)), rand.Intn(len(pool))
			a := pool[r1]
			b := pool[r2]
			// 雜交
			child, err := a.Crossover(b)
			if err != nil {
				return nil, err
			}
			// 突變
			if rand.Float64() < mutateRate {
				// 加快登頂
				child, err = HillClimbing(10, child)
				if err != nil {
					return nil, err
				}
			}
			child, err = child.CalcFitness()
			if err != nil {
				return nil, err
			}
			nextPopulation[i] = child
		}
		population = nextPopulation
	}
	return population, nil
}
