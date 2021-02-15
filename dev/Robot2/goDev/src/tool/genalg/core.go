package genalg

import (
	"math/rand"
)

type IGene interface {
	GetFitness() float64
	Crossover(IGene) (IGene, error)
	Mutate() (IGene, error)
}

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

func CreatePool(population []IGene, maxFitness float64) []IGene {
	pool := []IGene{}
	for i := 0; i < len(population); i++ {
		num := int((population[i].GetFitness() / maxFitness) * 100)
		for n := 0; n < num; n++ {
			pool = append(pool, population[i])
		}
	}
	return pool
}

func NaturalSelection(population []IGene, bestOrganism IGene) ([]IGene, error) {
	pool := CreatePool(population, bestOrganism.GetFitness())
	next := make([]IGene, len(population))
	for i := 0; i < len(population); i++ {
		r1, r2 := rand.Intn(len(pool)), rand.Intn(len(pool))
		a := pool[r1]
		b := pool[r2]
		child, err := a.Crossover(b)
		if err != nil {
			return next, err
		}
		child, err = child.Mutate()
		if err != nil {
			return next, err
		}
		next[i] = child
	}
	return next, nil
}
