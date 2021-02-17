package v1

import (
	"app/tool/data"
	"app/tool/helper"
	"app/tool/protocol"
	"fmt"
	"math/rand"
	"tool/optalg"
)

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

type LevelGene struct {
	Map     [][]int
	Units   map[[2]int]string
	Fitness float64
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
	if len(this.Units) == 0 {
		return LevelGene{
			Units:   this.Units,
			Map:     this.Map,
			Fitness: 0.0,
		}, nil
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
				// fitnessForRobot += math.Max(robotProto.Suitability[data.SuitabilitySky], robotProto.Suitability[suit]) * 10
				fitnessForRobot += robotProto.Suitability[suit] * 10
			}
			// 平均地型適性
			// groundScore := (float64(_count[data.SuitabilityGround]) / float64(_total)) * robotProto.Suitability[data.SuitabilityGround]
			// seaScore := (float64(_count[data.SuitabilitySea]) / float64(_total)) * robotProto.Suitability[data.SuitabilitySea]
			// skyScore := robotProto.Suitability[data.SuitabilitySky]
			// fitnessForRobot += (groundScore + seaScore + skyScore)
			// 武器分數
			// for _, weaponProtoID := range robotProto.Weapons {
			// 	weaponProto, err := data.TryGetStringWeaponProto(data.GameData.Weapon, weaponProtoID)
			// 	if err != nil {
			// 		return this, err
			// 	}
			// 	// 武器地型適性
			// 	groundScore := (float64(_count[data.SuitabilityGround]) / float64(_total)) * weaponProto.Suitability[data.SuitabilityGround]
			// 	seaScore := (float64(_count[data.SuitabilitySea]) / float64(_total)) * weaponProto.Suitability[data.SuitabilitySea]
			// 	skyScore := weaponProto.Suitability[data.SuitabilitySky]
			// 	fitnessForRobot += (groundScore + seaScore + skyScore) / float64(len(robotProto.Weapons))
			// }
			// // 成本分數
			// var _ = pos
			// if robotProto.Cost == 0 {
			// 	return this, fmt.Errorf("cost must not 0. (%v)", robotProto)
			// }
			// fitnessForRobot += float64(robotProto.Cost)
		}
		fitness += fitnessForRobot
	}

	// 應該是不需要建一個新的才對
	// 但js環境很像和桌面環境不一樣, 不這樣做的話, 會修改到this記憶體(沒有copy前)的值(this應該是copy過後的值, 修改它應該是要安全的. 但在JS環境並不)
	// 以上並不確定
	// 但確定的是一定要建一個新的, 才有預期中的效果
	// 程式碼1和程式碼2應該是一樣的效果才對(淺複製與傳值), 但程式碼1不行
	// ===============程式碼1
	// this.Fitness = fitness / float64(len(this.Units))
	// return this
	// ===============程式碼2
	// return LevelGene{
	// 	Units:   this.Units,
	// 	Map:     this.Map,
	// 	Fitness: fitness / float64(len(this.Units)),
	// }, nil
	// 但由以上來看, this可能不是複製後的值
	ret := this
	ret.Fitness = fitness / float64(len(this.Units))
	return ret, nil
}
func (this LevelGene) GetFitness() float64 {
	return this.Fitness
}
func (this LevelGene) Crossover(b optalg.IGene) (optalg.IGene, error) {
	units := map[[2]int]string{}
	mapH, mapW := len(this.Map), len(this.Map[0])
	switch rand.Intn(3) {
	case 0:
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
				if _, has := this.Units[pos1]; has {
					units[pos1] = this.Units[pos1]
				}
				if _, has := b.(LevelGene).Units[pos2]; has {
					units[pos2] = b.(LevelGene).Units[pos2]
				}
			}
		}
	case 1:
		for y := 0; y < mapH; y++ {
			for x := 0; x < mapW; x += 2 {
				pos1 := [2]int{x, y}
				if _, has := this.Units[pos1]; has {
					units[pos1] = this.Units[pos1]
				}
				if x+1 < mapW {
					pos2 := [2]int{x + 1, y}
					if _, has := b.(LevelGene).Units[pos2]; has {
						units[pos2] = b.(LevelGene).Units[pos2]
					}
				}
			}
		}
	case 2:
		for y := 0; y < mapH; y += 2 {
			for x := 0; x < mapW; x++ {
				pos1 := [2]int{x, y}
				if _, has := this.Units[pos1]; has {
					units[pos1] = this.Units[pos1]
				}
				if y+1 < mapH {
					pos2 := [2]int{x, y + 1}
					if _, has := b.(LevelGene).Units[pos2]; has {
						units[pos2] = b.(LevelGene).Units[pos2]
					}
				}
			}
		}
	}
	return LevelGene{
		Units: units,
		Map:   this.Map,
	}, nil
}
func (this LevelGene) Mutate() (optalg.IGene, error) {
	generateOne := func(origin map[[2]int]string) map[[2]int]string {
		units := map[[2]int]string{}
		for k, v := range origin {
			units[k] = v
		}
		mapH, mapW := len(this.Map), len(this.Map[0])
		for i := 0; i < 10; i++ {
			pos := [2]int{rand.Intn(mapW), rand.Intn(mapH)}
			if _, has := units[pos]; has {
				continue
			}
			robotProto, err := data.RandRobotProto()
			if err != nil {
				fmt.Println(err.Error())
				continue
			}
			var _ = robotProto
			units[pos] = robotProto.ID
			break
		}
		return units
	}

	deleteOne := func(origin map[[2]int]string) map[[2]int]string {
		if len(origin) <= 0 {
			return origin
		}
		units := map[[2]int]string{}
		i := rand.Intn(len(origin))
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
		if len(origin) <= 0 {
			return origin
		}
		units := map[[2]int]string{}
		i := rand.Intn(len(origin))
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

	if len(this.Units) > 20 {
		this.Units = deleteOne(this.Units)
		return this, nil
	}

	ret := this

	idx := rand.Float64()
	switch {
	case idx < 0.05:
		ret.Units = deleteOne(this.Units)
		ret.Units = generateOne(this.Units)
	case idx < 0.2:
		ret.Units = generateOne(this.Units)
	default:
		ret.Units = moveOne(this.Units)
	}
	// this.Units = generateOne(this.Units)
	// var _, _, _ = generateOne, deleteOne, moveOne

	return ret, nil
}
func GenerateLevelByPSO(origin model, playerID string) (model, error) {
	var err error
	ctx := origin
	mapW, mapH := len(ctx.App.Gameplay.Map), len(ctx.App.Gameplay.Map[0])

	genes := []optalg.IGene{}
	for i := 0; i < 5; i++ {
		robotProto, err := data.RandRobotProto()
		if err != nil {
			return origin, err
		}
		units := map[[2]int]string{}
		for j := 0; j < 20; j++ {
			pos := [2]int{rand.Intn(mapW), rand.Intn(mapH)}
			units[pos] = robotProto.ID
		}
		gene := LevelGene{
			Map:   ctx.App.Gameplay.Map,
			Units: units,
		}
		genes = append(genes, gene)
	}
	genes, err = optalg.OptAlgByPSO(100, genes)
	if err != nil {
		return origin, err
	}
	gene := optalg.GetBest(genes)
	for pos, protoID := range gene.(LevelGene).Units {
		var pilot protocol.Pilot
		ctx, pilot, err = NewPilot(ctx, protocol.Pilot{ProtoID: "amuro"})
		if err != nil {
			return origin, err
		}
		ctx, _, err = NewRobot(ctx, protocol.Position{pos[0], pos[1]}, protocol.Robot{
			ProtoID:  protoID,
			PlayerID: playerID,
			PilotID:  pilot.ID,
		})
		if err != nil {
			return origin, err
		}
	}
	return ctx, nil
}
