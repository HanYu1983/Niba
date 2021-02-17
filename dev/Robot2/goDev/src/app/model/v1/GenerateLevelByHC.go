package v1

import (
	"app/tool/data"
	"app/tool/helper"
	"app/tool/protocol"
	"fmt"
	"math/rand"
	"tool/optalg"
)

type LevelGeneByHC struct {
	Map     [][]int
	Units   map[[2]int]string
	Fitness float64
}

func (this LevelGeneByHC) CalcFitness() (optalg.IGene, error) {
	if len(this.Units) == 0 {
		return this, nil
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

		}
		fitness += fitnessForRobot
	}
	ret := this
	ret.Fitness = fitness / float64(len(this.Units))
	return ret, nil
}
func (this LevelGeneByHC) GetFitness() float64 {
	return this.Fitness
}
func (this LevelGeneByHC) Crossover(b optalg.IGene) (optalg.IGene, error) {
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
				if _, has := b.(LevelGeneByHC).Units[pos2]; has {
					units[pos2] = b.(LevelGeneByHC).Units[pos2]
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
					if _, has := b.(LevelGeneByHC).Units[pos2]; has {
						units[pos2] = b.(LevelGeneByHC).Units[pos2]
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
					if _, has := b.(LevelGeneByHC).Units[pos2]; has {
						units[pos2] = b.(LevelGeneByHC).Units[pos2]
					}
				}
			}
		}
	}
	return LevelGeneByHC{
		Units: units,
		Map:   this.Map,
	}, nil
}
func (this LevelGeneByHC) Mutate() (optalg.IGene, error) {
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
	if len(this.Units) > 20 {
		ret.Units = deleteOne(this.Units)
		return ret, nil
	}

	idx := rand.Float64()
	switch {
	case idx < 0.3:
		ret.Units = deleteOne(this.Units)
		ret.Units = generateOne(this.Units)
	case idx < 0.6:
		ret.Units = generateOne(this.Units)
	default:
		ret.Units = moveOne(this.Units)
	}
	return ret, nil
}
func GenerateLevelByHC(origin model, playerID string) (model, error) {
	var err error
	ctx := origin
	mapW, mapH := len(ctx.App.Gameplay.Map), len(ctx.App.Gameplay.Map[0])
	robotProto, err := data.RandRobotProto()
	if err != nil {
		return origin, err
	}
	units := map[[2]int]string{}
	for j := 0; j < 20; j++ {
		pos := [2]int{rand.Intn(mapW), rand.Intn(mapH)}
		units[pos] = robotProto.ID
	}
	var gene optalg.IGene = LevelGeneByHC{
		Map:   ctx.App.Gameplay.Map,
		Units: units,
	}
	gene, err = optalg.HillClimbing(400, gene)
	if err != nil {
		return origin, err
	}
	for pos, protoID := range gene.(LevelGeneByHC).Units {
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
