package v1

import (
	"app/tool/data"
	"app/tool/helper"
	"fmt"
	"math"
	"math/rand"
	"tool/optalg"
)

type LevelGene struct {
	Map        [][]int
	Units      map[[2]int]string
	Fitness    float64
	TargetCost float64
}

var (
	_total int
	_count map[int]int
)

func QuerySuitabilityIDCount(gameMap [][]int) (map[int]int, error) {
	_count := map[int]int{}
	for _, row := range gameMap {
		for _, id := range row {
			terrain, err := helper.TerrainID2Terrain(id)
			if err != nil {
				return nil, err
			}
			suit, err := data.GetSuitabilityIDBelongTerrain(terrain)
			if err != nil {
				return nil, err
			}
			_count[suit]++
		}
	}
	return _count, nil
}

func (this LevelGene) CalcFitness() (optalg.IGene, error) {
	if _count == nil {
		_count, err := QuerySuitabilityIDCount(this.Map)
		if err != nil {
			return this, err
		}
		for _, c := range _count {
			_total += c
		}
	}
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
			// 平均地型適性
			groundScore := (float64(_count[data.SuitabilityGround]) / float64(_total)) * robotProto.Suitability[data.SuitabilityGround]
			seaScore := (float64(_count[data.SuitabilitySea]) / float64(_total)) * robotProto.Suitability[data.SuitabilitySea]
			skyScore := robotProto.Suitability[data.SuitabilitySky]
			fitnessForRobot += (groundScore + seaScore + skyScore)
			// 武器分數
			for _, weaponProtoID := range robotProto.Weapons {
				weaponProto, err := data.TryGetStringWeaponProto(data.GameData.Weapon, weaponProtoID)
				if err != nil {
					return this, err
				}
				// 武器地型適性
				groundScore := (float64(_count[data.SuitabilityGround]) / float64(_total)) * weaponProto.Suitability[data.SuitabilityGround]
				seaScore := (float64(_count[data.SuitabilitySea]) / float64(_total)) * weaponProto.Suitability[data.SuitabilitySea]
				skyScore := weaponProto.Suitability[data.SuitabilitySky]
				fitnessForRobot += (groundScore + seaScore + skyScore) * 5
			}
			// 成本分數
			if robotProto.Cost == 0 {
				return this, fmt.Errorf("cost must not 0. (%v)", robotProto)
			}
			fitnessForRobot += (1 / float64(robotProto.Cost)) * 10
		}
		fitness += fitnessForRobot
	}
	this.Fitness = fitness
	return this, nil
}
func (this LevelGene) GetFitness() float64 {
	return this.Fitness
}
func (this LevelGene) Crossover(b optalg.IGene) (optalg.IGene, error) {
	units := map[[2]int]string{}
	mapH, mapW := len(this.Map), len(this.Map[0])
	for y := 0; y < mapH; y++ {
		for x := 0; x < mapW; x += 2 {
			var pos1 [2]int
			{
				offset := y % 2
				cx := x + offset
				pos1 = [2]int{cx, y}
			}
			var pos2 [2]int
			{
				offset := (y + 1) % 2
				cx := x + offset
				pos2 = [2]int{cx, y}
			}
			units[pos1] = this.Units[pos1]
			units[pos2] = b.(LevelGene).Units[pos2]
		}
	}
	return LevelGene{
		Units:      units,
		Fitness:    0,
		Map:        this.Map,
		TargetCost: this.TargetCost,
	}, nil
}
func (this LevelGene) Mutate() (optalg.IGene, error) {

	generateOne := func(origin map[[2]int]string) map[[2]int]string {
		units := map[[2]int]string{}
		mapH, mapW := len(this.Map), len(this.Map[0])
		for i := 0; i < 3; i++ {
			pos := [2]int{rand.Int() % mapW, rand.Int() % mapH}
			if _, has := units[pos]; has {
				continue
			}
			units[pos] = "gundam"
			break
		}
		return units
	}

	deleteOne := func(origin map[[2]int]string) map[[2]int]string {
		units := map[[2]int]string{}
		i := rand.Int() % len(origin)
		var j int
		for k, v := range origin {
			if j == i {
				j++
				continue
			}
			units[k] = v
			j++
		}
		return units
	}

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

	var cost int
	{
		for _, robotProtoID := range this.Units {
			robotProto, err := data.TryGetStringRobotProto(data.GameData.Robot, robotProtoID)
			if err != nil {
				return this, err
			}
			cost += robotProto.Cost
		}
	}
	//fmt.Printf("cost(%v)\n", cost)

	// if cost > int(this.TargetCost) {
	// 	deleteOne()
	// 	return nil
	// }

	// if rand.Float64() < 0.1 {
	// 	deleteOne()
	// 	generateOne()
	// }

	var _, _ = deleteOne, generateOne

	this.Units = moveOne(this.Units)

	return this.CalcFitness()
}
func GenerateLevelByGeneticAlgo(origin model, playerID string) (model, error) {
	ctx := origin
	return ctx, nil
}
