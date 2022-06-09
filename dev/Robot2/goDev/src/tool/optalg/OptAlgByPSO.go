package optalg

import (
	"fmt"
)

// OptAlgByPSO is PSO粒子群演算法修改
func OptAlgByPSO(iteration int, genes []IGene) ([]IGene, error) {
	ret := []IGene{}
	for _, gene := range genes {
		gene, err := gene.CalcFitness()
		if err != nil {
			return nil, err
		}
		ret = append(ret, gene)
	}
	// 個人最佳
	bestGenes := []IGene{}
	for _, gene := range ret {
		bestGenes = append(bestGenes, gene)
	}
	// 群體最佳
	globalBestGene := GetBest(bestGenes)
	for i := 0; i < iteration; i++ {
		fmt.Printf("[OptAlgByPSO] ieration(%v/%v) score(%v)\n", i, iteration, globalBestGene.GetFitness())
		for j, gene := range ret {
			//fmt.Printf("[OptAlgByPSO] ieration(%v) score(%v)\n", j, globalBestGene.GetFitness())
			//fmt.Printf("[OptAlgByPSO] before(%v)\n", gene.GetFitness())
			// 突變
			nextGene, err := HillClimbing(10, gene)
			if err != nil {
				return nil, err
			}
			//fmt.Printf("[OptAlgByPSO] after(%v)\n", nextGene.GetFitness())
			// 和群體最佳解雜交
			// 注意雜交的演算法所選的基因位置必須有隨機性
			nextGene, err = nextGene.Crossover(globalBestGene)
			if err != nil {
				return nil, err
			}
			// 和個人最佳解雜交
			bestGene := bestGenes[j]
			nextGene, err = nextGene.Crossover(bestGene)
			if err != nil {
				return nil, err
			}
			nextGene, err = nextGene.CalcFitness()
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
