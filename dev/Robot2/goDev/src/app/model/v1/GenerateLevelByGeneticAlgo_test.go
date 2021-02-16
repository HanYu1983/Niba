package v1

import (
	"app/tool/data"
	"app/tool/helper"
	"fmt"
	"math"
	"math/rand"
	"testing"
	"tool/optalg"
)

type testLevelGene struct {
	Map     [][]int
	Units   map[[2]int]string
	Fitness float64
}

func (this testLevelGene) CalcFitness() (optalg.IGene, error) {
	var fitness float64
	{
		var fitnessForRobot float64
		for pos, robotProtoID := range this.Units {
			robotProto, err := data.TryGetStringRobotProto(data.GameData.Robot, robotProtoID)
			if err != nil {
				return this, err
			}
			// 所在位置
			{
				tid := this.Map[pos[1]][pos[0]]
				terrain, err := helper.TerrainID2Terrain(tid)
				if err != nil {
					return this, err
				}
				suit, err := data.GetSuitabilityIDBelongTerrain(terrain)
				if err != nil {
					return this, err
				}
				fitnessForRobot += math.Max(robotProto.Suitability[data.SuitabilitySky], robotProto.Suitability[suit]) * 10
			}
		}
		fitness += fitnessForRobot
	}
	this.Fitness = fitness
	return this, nil
}
func (this testLevelGene) Crossover(b optalg.IGene) (optalg.IGene, error) {
	return this, nil
}
func (this testLevelGene) GetFitness() float64 {
	return this.Fitness
}
func (this testLevelGene) Mutate() (optalg.IGene, error) {
	moveOne := func(origin map[[2]int]string) map[[2]int]string {
		units := map[[2]int]string{}
		i := rand.Int() % len(origin)
		var j int
		var removedValue string
		for k, v := range origin {
			if j == i {
				removedValue = v
				j++
				continue
			}
			units[k] = v
			j++
		}
		mapH, mapW := len(this.Map), len(this.Map[0])
		for i := 0; i < 3; i++ {
			pos := [2]int{rand.Int() % mapW, rand.Int() % mapH}
			if _, has := units[pos]; has {
				continue
			}
			units[pos] = removedValue
			break
		}
		return units
	}
	this.Units = moveOne(this.Units)
	return this, nil
}

func TestLevelGene(t *testing.T) {
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
	levelGene := testLevelGene{
		Map: tempMap,
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

	var gene optalg.IGene = levelGene
	gene, err = optalg.SimulatedAnnealing(0.00001, 0.999, 300, gene)
	if err != nil {
		t.Fatal(err)
	}

	levelGene = gene.(testLevelGene)
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

func TestLevelGeneForAstar(t *testing.T) {
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
	levelGene := testLevelGene{
		Map: tempMap,
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

	var gene optalg.IGene = levelGene
	gene, err = optalg.OptAlgByAstar(
		1,
		func(gene optalg.IGene) float64 {
			return 0
		},
		func(gene optalg.IGene) bool {
			levelGene = gene.(testLevelGene)
			for pos := range levelGene.Units {
				tid := levelGene.Map[pos[1]][pos[0]]
				terrain, err := helper.TerrainID2Terrain(tid)
				if err != nil {
					fmt.Println(err.Error())
					return true
				}
				suit, err := data.GetSuitabilityIDBelongTerrain(terrain)
				if err != nil {
					fmt.Println(err.Error())
					return true
				}
				if suit != data.SuitabilitySea {
					return false
				}
			}
			return true
		},
		300,
		gene)
	if err != nil {
		t.Fatal(err)
	}

	levelGene = gene.(testLevelGene)
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
