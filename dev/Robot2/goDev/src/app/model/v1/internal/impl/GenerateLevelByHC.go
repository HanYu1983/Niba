package impl

import (
	"app/model/v1/internal/tool/types"
	"app/tool/data"
	"app/tool/helper"
	"app/tool/protocol"
	"fmt"
	"math"
	"math/rand"
	"tool/optalg"

	"github.com/go-gl/mathgl/mgl64"
)

type LevelGeneByHC struct {
	Map        [][]int
	Units      map[[2]int]string
	Fitness    float64
	TargetCost int
	Center     [2]int
	Weight     map[string]float64
}

func (self LevelGeneByHC) TotalCost() (int, error) {
	var totalCost int
	for _, protoID := range self.Units {
		proto, err := data.TryGetStringRobotProto(data.GameData.Robot, protoID)
		if err != nil {
			return 0, err
		}
		totalCost += proto.Cost
	}
	return totalCost, nil
}

func (self LevelGeneByHC) CalcFitness() (optalg.IGene, error) {
	if len(self.Units) == 0 {
		return self, nil
	}
	centerV2 := mgl64.Vec2{float64(self.Center[0]), float64(self.Center[1])}
	var fitness float64
	{
		var fitnessForRobot float64
		for pos, robotProtoID := range self.Units {
			robotProto, err := data.TryGetStringRobotProto(data.GameData.Robot, robotProtoID)
			if err != nil {
				return self, err
			}
			// 所在位置
			{
				tid := self.Map[pos[1]][pos[0]]
				terrain, err := helper.TerrainID2Terrain(tid)
				if err != nil {
					return self, err
				}
				suit, err := data.GetSuitabilityIDBelongTerrain(terrain)
				if err != nil {
					return self, err
				}
				// 不要在山上
				if terrain.ID == "mountain" {
					fitnessForRobot = 0
				} else {
					// fitnessForRobot += math.Max(robotProto.Suitability[data.SuitabilitySky], robotProto.Suitability[suit]) * 10
					fitnessForRobot += robotProto.Suitability[suit] * 10
				}
			}

			// 距離中心
			{
				posV2 := mgl64.Vec2{float64(pos[0]), float64(pos[1])}
				dis := math.Max(1, centerV2.Sub(posV2).LenSqr())
				fitnessForRobot += math.Pow(2.0/dis, 3)
			}

			// 加權
			// {
			// 	weight, has := self.Weight[robotProtoID]
			// 	if has {
			// 		fitnessForRobot *= weight
			// 	}
			// }
		}
		fitness += fitnessForRobot
	}
	// cost
	// {
	// 	fitnessForCost := 0.0
	// 	totalCost, err := self.TotalCost()
	// 	if err != nil {
	// 		return self, err
	// 	}
	// 	if totalCost < self.TargetCost {
	// 		fitnessForCost = (1 / math.Abs(float64(self.TargetCost)-float64(totalCost))) * 100
	// 	} else {
	// 		fitnessForCost = 0
	// 	}
	// 	fitness += fitnessForCost
	// }

	ret := self
	ret.Fitness = fitness / float64(len(self.Units))
	return ret, nil
}
func (self LevelGeneByHC) GetFitness() float64 {
	return self.Fitness
}
func (self LevelGeneByHC) Crossover(b optalg.IGene) (optalg.IGene, error) {
	return self, nil
}
func (self LevelGeneByHC) Mutate() (optalg.IGene, error) {
	generateOne := func(origin map[[2]int]string) map[[2]int]string {
		units := map[[2]int]string{}
		for k, v := range origin {
			units[k] = v
		}
		mapH, mapW := len(self.Map), len(self.Map[0])
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
		mapH, mapW := len(self.Map), len(self.Map[0])
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

	totalCost, err := self.TotalCost()
	if err != nil {
		return self, err
	}

	ret := self
	if totalCost > self.TargetCost {
		ret.Units = deleteOne(self.Units)
		return ret, nil
	}

	// if totalCost < self.TargetCost {
	// 	ret.Units = deleteOne(self.Units)
	// 	return ret, nil
	// }

	idx := rand.Float64()
	switch {
	// case idx < 0.1:
	// 	ret.Units = deleteOne(self.Units)
	// case idx < 0.2:
	// 	ret.Units = generateOne(self.Units)
	case idx < 0.4:
		ret.Units = deleteOne(self.Units)
		ret.Units = generateOne(self.Units)
	default:
		ret.Units = moveOne(self.Units)
	}
	return ret, nil
}
func GenerateLevelByHC(origin types.Model, playerID string) (types.Model, error) {
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
		Map:        ctx.App.Gameplay.Map,
		Units:      units,
		TargetCost: 1000000,
		Center:     [2]int{25, 0},
		Weight: map[string]float64{
			"gaite_sea": 2,
			"moshen":    1.2,
		},
	}
	gene, err = optalg.HillClimbing(300, gene)
	if err != nil {
		return origin, err
	}
	totalCost, err := gene.(LevelGeneByHC).TotalCost()
	if err != nil {
		return origin, err
	}
	fmt.Printf("totalCost(%v)\n", totalCost)
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
