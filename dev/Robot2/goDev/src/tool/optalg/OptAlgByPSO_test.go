package optalg

import (
	"math/rand"
	"testing"
)

type testLevelGene2 struct {
	Map     [10]int
	Fitness int
}

func (this testLevelGene2) CalcFitness() (IGene, error) {
	var fitness int
	for _, value := range this.Map {
		fitness += value
	}
	this.Fitness = fitness
	return this, nil
}
func (this testLevelGene2) Crossover(b IGene) (IGene, error) {
	offset := rand.Intn(len(this.Map))
	newMap := [10]int{}
	for x := 0; x < len(this.Map); x++ {
		if x > offset {
			newMap[x] = b.(testLevelGene2).Map[x]
		} else {
			newMap[x] = this.Map[x]
		}
	}
	return testLevelGene2{
		Map: newMap,
	}, nil
}
func (this testLevelGene2) GetFitness() float64 {
	return float64(this.Fitness)
}
func (this testLevelGene2) Mutate() (IGene, error) {
	offset := rand.Intn(len(this.Map))
	this.Map[offset] = rand.Intn(5)
	return this, nil
}

func TestLevelGeneForPSO(t *testing.T) {
	var err error

	genes := []IGene{}
	for i := 0; i < 5; i++ {
		gene := testLevelGene2{
			Map: [10]int{rand.Intn(5), rand.Intn(5), rand.Intn(5), rand.Intn(5), rand.Intn(5), rand.Intn(5), rand.Intn(5), rand.Intn(5), rand.Intn(5)},
		}
		genes = append(genes, gene)
	}

	genes, err = OptAlgByPSO(100, genes)
	if err != nil {
		t.Fatal(err)
	}

	gene := GetBest(genes)
	for _, v := range gene.(testLevelGene2).Map {
		if v != 4 {
			t.Fatalf("所有值必須等於4(%v)\n", gene.(testLevelGene2).Map)
		}
	}
}
