package v1

import (
	"app/tool/data"
	"app/tool/helper"
	"app/tool/protocol"
	"fmt"
	"tool/astar"
)

var (
	terrainCache = map[protocol.Position]data.TerrainProto{}
)

func RobotMoveCost(model model, robot protocol.Robot) (func(curr *astar.Node) []astar.NeighborsNode, error) {
	movePower, err := QueryRobotMovePower(model, robot.ID)
	if err != nil {
		return func(curr *astar.Node) []astar.NeighborsNode {
			return nil
		}, err
	}
	suitability, err := QueryRobotSuitability(model, robot.ID)
	if err != nil {
		return func(curr *astar.Node) []astar.NeighborsNode {
			return nil
		}, err
	}
	isSky := model.App.Gameplay.Tags[robot.ID].Sky
	return func(curr *astar.Node) []astar.NeighborsNode {
		// prevent infinite loop
		if int(curr.Cost) > 100 {
			return []astar.NeighborsNode{}
		}
		currPos := curr.Pather.(protocol.Position)
		cost1 := 0.0
		{
			terrain1, err := helper.QueryTerrain(model.App.Gameplay.Map, terrainCache, currPos)
			if err != nil {
				fmt.Println(err.Error())
				return []astar.NeighborsNode{}
			}
			if isSky {
				if suitability[data.SuitabilitySky] == 0 {
					return []astar.NeighborsNode{}
				}
				cost1 = 0.4 * 1 / suitability[data.SuitabilitySky]
			} else {
				suitabilityFactor := 0.0
				switch terrain1.ID {
				case "shallowSea", "deepSea":
					suitabilityFactor = suitability[data.SuitabilitySea]
				case "mountain", "plain", "forest", "road", "city", "beach", "award":
					suitabilityFactor = suitability[data.SuitabilityGround]
				default:
					fmt.Printf("unknown terrain(%v)\n", terrain1.ID)
					return []astar.NeighborsNode{}
				}
				if suitabilityFactor == 0.0 {
					return []astar.NeighborsNode{}
				}
				cost1 = terrain1.Cost * 1 / suitabilityFactor
			}
		}
		offsets := []protocol.Position{{0, -1}, {1, 0}, {0, 1}, {-1, 0}}
		ret := []astar.NeighborsNode{}
		for _, offset := range offsets {
			x, y := currPos[0]+offset[0], currPos[1]+offset[1]
			if x < 0 || x >= len(model.App.Gameplay.Map[0]) {
				continue
			}
			if y < 0 || y >= len(model.App.Gameplay.Map) {
				continue
			}
			nextPos := protocol.Position{x, y}
			var notFound string
			unitAtPos := SearchUnitByPosition(model.App.Gameplay.Positions, nextPos)
			if unitAtPos != notFound {
				isFriendlyRobot, err := IsFriendlyRobot(model, robot.ID, unitAtPos)
				if err != nil {
					fmt.Println(err)
					continue
				}
				if isFriendlyRobot == false {
					continue
				}
			}
			cost2 := 0.0
			{
				terrain2, err := helper.QueryTerrain(model.App.Gameplay.Map, terrainCache, nextPos)
				if err != nil {
					fmt.Println(err.Error())
					return []astar.NeighborsNode{}
				}
				if isSky {
					if suitability[data.SuitabilitySky] == 0 {
						continue
					}
					cost2 = 0.4 * 1 / suitability[data.SuitabilitySky]
				} else {
					suitabilityFactor := 0.0
					switch terrain2.ID {
					case "shallowSea", "deepSea":
						suitabilityFactor = suitability[data.SuitabilitySea]
					case "mountain", "plain", "forest", "road", "city", "beach", "award":
						suitabilityFactor = suitability[data.SuitabilityGround]
					default:
						fmt.Printf("unknown terrain(%v)\n", terrain2.ID)
						return []astar.NeighborsNode{}
					}
					if suitabilityFactor == 0.0 {
						continue
					}
					cost2 = terrain2.Cost * 1 / suitabilityFactor
				}
			}
			nextCost := float64(cost1 + cost2)
			if int(curr.Cost+nextCost) > movePower {
				continue
			}
			ret = append(ret, astar.NeighborsNode{
				Pather: nextPos,
				Cost:   nextCost,
			})
		}
		return ret
	}, nil
}
