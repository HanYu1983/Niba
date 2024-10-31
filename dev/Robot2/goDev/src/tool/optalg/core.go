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


export function getBest(population: IGene[]): IGene {
  let bestFitness = 0;
  let bestIndex = 0;

  for (let i = 0; i < population.length; i++) {
    const fitness = population[i].getFitness();
    if (fitness > bestFitness) {
      bestFitness = fitness;
      bestIndex = i;
    }
  }

  return population[bestIndex];
}