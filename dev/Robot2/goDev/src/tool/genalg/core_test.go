package genalg

import "testing"

type GeneFloat64 float64

func (this GeneFloat64) GetFitness() float64 {
	return float64(this)
}
func (this GeneFloat64) Crossover(b IGene) (IGene, error) {
	return GeneFloat64(float64(this) + float64(b.(GeneFloat64))), nil
}
func (this GeneFloat64) Mutate() (IGene, error) {
	return this, nil
}

func TestCore(t *testing.T) {
	gene := []IGene{}
	for i := 0; i < 10; i++ {
		gene = append(gene, GeneFloat64(i+0.0))
	}
	best := GetBest(gene)
	if best.(GeneFloat64) != 9.0 {
		t.Fatal("best must be 9")
	}
	geneAfter, err := NaturalSelection(gene, best)
	if err != nil {
		t.Fatal(err)
	}
	if len(gene) != len(geneAfter) {
		t.Fatal("gene's length must be the same.")
	}
}
