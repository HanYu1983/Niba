package optalg

import (
	"math/rand"
	"testing"
)

type testLevelGene4 struct {
	Map     [10]int
	Fitness int
}

func (this testLevelGene4) CalcFitness() (IGene, error) {
	var fitness int
	for _, value := range this.Map {
		fitness += value
	}
	this.Fitness = fitness
	return this, nil
}
func (this testLevelGene4) Crossover(b IGene) (IGene, error) {
	offset := rand.Intn(len(this.Map))
	newMap := [10]int{}
	for x := 0; x < len(this.Map); x++ {
		if x > offset {
			newMap[x] = b.(testLevelGene4).Map[x]
		} else {
			newMap[x] = this.Map[x]
		}
	}
	return testLevelGene4{
		Map: newMap,
	}, nil
}
func (this testLevelGene4) GetFitness() float64 {
	return float64(this.Fitness)
}
func (this testLevelGene4) Mutate() (IGene, error) {
	offset := rand.Intn(len(this.Map))
	this.Map[offset] = rand.Intn(5)
	return this, nil
}

func TestGeneticAlgorithm(t *testing.T) {
	var err error
	genes := []IGene{}
	for i := 0; i < 5; i++ {
		gene := testLevelGene4{
			Map: [10]int{rand.Intn(5), rand.Intn(5), rand.Intn(5), rand.Intn(5), rand.Intn(5), rand.Intn(5), rand.Intn(5), rand.Intn(5), rand.Intn(5)},
		}
		genes = append(genes, gene)
	}
	genes, err = GeneticAlgorithm(0.1, 200, genes)
	if err != nil {
		t.Fatal(err)
	}
	gene := GetBest(genes)
	for _, v := range gene.(testLevelGene4).Map {
		if v != 4 {
			t.Fatalf("所有值必須等於4(%v)\n", gene.(testLevelGene4).Map)
		}
	}
}
