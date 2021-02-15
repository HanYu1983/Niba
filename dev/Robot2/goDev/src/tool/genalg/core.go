package genalg

import (
	"fmt"
	"math"
	"math/rand"
)

func GetBest(population []IGene) IGene {
	best := 0.0
	index := 0
	for i := 0; i < len(population); i++ {
		if population[i].GetFitness() > best {
			index = i
			best = population[i].GetFitness()
		}
	}
	return population[index]
}

// HillClimbing is 爬山演算法
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

// SimulatedAnnealing is 退火演算法
// 當溫度(T)幾乎降到零的時候，模擬退火法基本上就會退化成爬山演算法
func SimulatedAnnealing(T float64, factor float64, iteration int, gene IGene) (IGene, error) {
	if T <= 0 {
		return nil, fmt.Errorf("T can not be 0")
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

// ParticleSwarmOptimization is PSO粒子群演算法修改
func ParticleSwarmOptimization(iteration int, genes []IGene) ([]IGene, error) {
	ret := []IGene{}
	for _, gene := range genes {
		ret = append(ret, gene)
	}
	// 個人最佳
	bestGenes := []IGene{}
	for _, gene := range genes {
		bestGenes = append(bestGenes, gene)
	}
	// 群體最佳
	globalBestGene := GetBest(genes)
	for i := 0; i < iteration; i++ {
		for j := 0; j < len(ret); j++ {
			// 突變
			nextGene, err := ret[j].Mutate()
			if err != nil {
				return nil, err
			}
			// 個人最佳解
			bestGene := bestGenes[j]
			// 和群體最佳解雜交
			// 注意雜交的演算法所選的基因位置必須有隨機性
			nextGene, err = nextGene.Crossover(globalBestGene)
			if err != nil {
				return nil, err
			}
			// 和個人最佳解雜交
			nextGene, err = nextGene.Crossover(bestGene)
			if err != nil {
				return nil, err
			}
			// 更新最佳解
			if nextGene.GetFitness() > bestGene.GetFitness() {
				bestGenes[j] = nextGene
			}
			if nextGene.GetFitness() > globalBestGene.GetFitness() {
				globalBestGene = nextGene
			}
			// 下一世代
			ret[j] = nextGene
		}
	}
	return ret, nil
}

// GeneticAlgorithms is 基因演算法
func GeneticAlgorithms(mutateRate float64, iteration int, population []IGene) ([]IGene, error) {
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
				child, err = child.Mutate()
				if err != nil {
					return nil, err
				}
			}
			nextPopulation[i] = child
		}
		population = nextPopulation
	}
	return population, nil
}
