export type IGene = {
  calcFitness(): number
  getFitness(): number
  mutate(): IGene
  crossover?(gene: IGene): IGene
  getStateKey?(): string
}

export function getBest(population: IGene[]): IGene {
  const copy = [...population]
  copy.sort((a, b) => b.getFitness() - a.getFitness())
  return copy[0]
}
