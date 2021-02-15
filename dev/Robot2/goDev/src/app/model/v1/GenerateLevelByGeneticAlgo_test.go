package v1

import (
	"app/tool/data"
	"app/tool/helper"
	"testing"
	"tool/genalg"
)

func TestLevelGene(t *testing.T) {
	tempMap, err := helper.GenerateMap(helper.GenerateMapConfigDefault, 0, 0, 1, 25, 25, 0, 0)
	if err != nil {
		t.Fatal(err)
	}
	gene := LevelGene{
		Map:   tempMap,
		Units: map[[2]int]string{{0, 0}: "gaite_sky", {0, 1}: "gaite_sea"},
	}
	gene, err = gene.CalcFitness()
	if err != nil {
		t.Fatal(err)
	}
	if gene.GetFitness() == 0 {
		t.Fatal("fitness must not be 0")
	}
}

func TestLevelGene2(t *testing.T) {
	tempMap, err := helper.GenerateMap(helper.GenerateMapConfig{
		Deepsea:  0,
		Sea:      1,
		Sand:     0.05,
		Grass:    5,
		Mountain: 3,
		City:     0.2,
		Tree:     0.3,
		Award:    0.1,
	}, 0, 0, 1, 25, 25, 0, 0)
	if err != nil {
		t.Fatal(err)
	}
	count, err := QuerySuitabilityIDCount(tempMap)
	if err != nil {
		t.Fatal(err)
	}
	if count[data.SuitabilitySea] < 10 || count[data.SuitabilitySea] > 30 {
		t.Fatalf("產生的地圖海域格必須小於10~30格")
	}
	levelGene := LevelGene{
		Map:        tempMap,
		TargetCost: 1000000,
		Units: map[[2]int]string{
			{0, 1}: "gaite_sea",
			{0, 2}: "gaite_sea",
			{0, 3}: "gaite_sea",
			{0, 4}: "gaite_sea",
		},
	}
	for pos := range levelGene.Units {
		tid := levelGene.Map[pos[1]][pos[0]]
		terrain, err := helper.TerrainID2Terrain(tid)
		if err != nil {
			t.Fatal(err)
		}
		suit, err := data.GetSuitabilityIDBelongTerrain(terrain)
		if err != nil {
			t.Fatal(err)
		}
		if suit != data.SuitabilityGround {
			t.Fatal("一開始必須都在地上")
		}
	}

	levelGene, err = levelGene.CalcFitness()
	if err != nil {
		t.Fatal(err)
	}

	var gene genalg.IGene = levelGene
	for i := 0; i < 300; i++ {
		clone, err := gene.Mutate()
		if err != nil {
			t.Fatal(err)
		}
		if clone.GetFitness() > gene.GetFitness() {
			gene = clone
		}
	}

	levelGene = gene.(LevelGene)
	for pos := range levelGene.Units {
		tid := levelGene.Map[pos[1]][pos[0]]
		terrain, err := helper.TerrainID2Terrain(tid)
		if err != nil {
			t.Fatal(err)
		}
		suit, err := data.GetSuitabilityIDBelongTerrain(terrain)
		if err != nil {
			t.Fatal(err)
		}
		if suit != data.SuitabilitySea {
			t.Fatal("校正完後, 應該都要在海域")
		}
	}
}
