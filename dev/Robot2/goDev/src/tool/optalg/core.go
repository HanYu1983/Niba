package optalg

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
