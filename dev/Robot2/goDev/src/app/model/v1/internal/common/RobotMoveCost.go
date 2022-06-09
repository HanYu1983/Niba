package common

import (
	"app/model/v1/internal/tool/types"
	"app/tool/data"
	"app/tool/helper"
	"app/tool/protocol"
	"fmt"
	"tool/astar"

	"github.com/go-gl/mathgl/mgl64"
)

var (
	terrainCache map[protocol.Position]data.TerrainProto
)

func RobotMoveCost(model types.Model, robotID string, movePower int, ignoreOccupy bool) (func(curr *astar.Node) []astar.NeighborsNode, error) {
	suitability, err := QueryRobotSuitability(model, robotID, true)
	if err != nil {
		return func(curr *astar.Node) []astar.NeighborsNode {
			return nil
		}, err
	}
	isSky := model.App.Gameplay.Tags[robotID].Sky
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
				factor := mgl64.Vec2{suitability[0], suitability[1]}.Dot(mgl64.Vec2{terrain1.Cost[0], terrain1.Cost[1]})
				cost1 = 0.5 / factor
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
			if ignoreOccupy == false {
				var notFound string
				unitAtPos := SearchUnitByPosition(model.App.Gameplay.Positions, nextPos)
				if unitAtPos != notFound {
					isFriendlyRobot, err := IsFriendlyRobot(model, robotID, unitAtPos)
					if err != nil {
						fmt.Println(err)
						continue
					}
					if isFriendlyRobot == false {
						continue
					}
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
					factor := mgl64.Vec2{suitability[0], suitability[1]}.Dot(mgl64.Vec2{terrain2.Cost[0], terrain2.Cost[1]})
					cost2 = 0.5 / factor
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
