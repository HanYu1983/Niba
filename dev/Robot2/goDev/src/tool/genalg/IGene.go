package genalg

type IGene interface {
	GetFitness() float64
	Mutate() (IGene, error)
	Crossover(IGene) (IGene, error)
}
