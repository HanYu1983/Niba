package optalg

type IGene interface {
	CalcFitness() (IGene, error)
	GetFitness() float64
	Mutate() (IGene, error)
	Crossover(IGene) (IGene, error)
}
