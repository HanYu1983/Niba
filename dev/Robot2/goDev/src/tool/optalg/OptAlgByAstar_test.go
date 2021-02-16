package optalg

import (
	"math/rand"
	"testing"
)

type testLevelGene3 struct {
	Map     [10]int
	Fitness int
}

func (this testLevelGene3) CalcFitness() (IGene, error) {
	var fitness int
	for _, value := range this.Map {
		fitness += value
	}
	this.Fitness = fitness
	return this, nil
}
func (this testLevelGene3) Crossover(b IGene) (IGene, error) {
	return this, nil
}
func (this testLevelGene3) GetFitness() float64 {
	return float64(this.Fitness)
}
func (this testLevelGene3) Mutate() (IGene, error) {
	offset := rand.Intn(len(this.Map))
	this.Map[offset] = rand.Intn(5)
	return this, nil
}

func TestLevelGeneForAstar(t *testing.T) {
	var err error

	var gene IGene = testLevelGene3{
		Map: [10]int{rand.Intn(5), rand.Intn(5), rand.Intn(5), rand.Intn(5), rand.Intn(5), rand.Intn(5), rand.Intn(5), rand.Intn(5), rand.Intn(5)},
	}

	gene, err = OptAlgByAstar(
		4,
		2,
		func(gene IGene) float64 {
			return 0
		},
		func(gene IGene) bool {
			return false
		},
		1000,
		gene)
	if err != nil {
		t.Fatal(err)
	}

	for _, v := range gene.(testLevelGene3).Map {
		if v != 4 {
			t.Fatalf("所有值必須等於4(%v)\n", gene.(testLevelGene3).Map)
		}
	}
}
