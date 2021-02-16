package optalg

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
	globalBestGene := GetBest(genes)
	for i := 0; i < iteration; i++ {
		for j := 0; j < len(ret); j++ {
			// 突變
			nextGene, err := HillClimbing(10, ret[j])
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
