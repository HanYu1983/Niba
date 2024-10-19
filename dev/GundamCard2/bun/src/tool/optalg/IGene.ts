export type IGene = {
  calcFitness(): number
  getFitness(): number
  mutate(): IGene
  crossover?(gene: IGene): IGene
  getStateKey?(): string
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