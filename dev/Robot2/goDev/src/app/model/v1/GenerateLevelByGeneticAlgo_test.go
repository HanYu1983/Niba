package v1

import (
	"app/tool/data"
	"app/tool/helper"
	"fmt"
	"testing"
)

func TestGenerateLevelByGeneticAlgo(t *testing.T) {
	tempMap, err := helper.GenerateMap(helper.GenerateMapConfig{
		Deepsea:  1,
		Sea:      0,
		Sand:     0,
		Grass:    0,
		Mountain: 0,
		City:     0.2,
		Tree:     0.3,
		Award:    0.1,
	}, 0, 0, 1, 25, 25, 0, 0)
	if err != nil {
		t.Fatal(err)
	}
	model := DefaultModel
	model.App.Gameplay.Map = tempMap
	ctx, err := GenerateLevelByGeneticAlgo(model, "0")
	if err != nil {
		t.Fatal(err)
	}
	countOfGaiteSea := 0
	for _, robot := range ctx.App.Gameplay.Robots {
		pos := ctx.App.Gameplay.Positions[robot.ID]
		robotProto, err := data.TryGetStringRobotProto(data.GameData.Robot, robot.ProtoID)
		if err != nil {
			t.Fatal(err)
		}
		if robotProto.ID == "gaite_sea" {
			countOfGaiteSea++
		}
		fmt.Printf("robotProtoID(%v) pos(%v) suit(%v)\n", robot.ProtoID, pos, robotProto.Suitability)
	}
	fmt.Printf("countOfGaiteSea(%v/%v)\n", countOfGaiteSea, len(ctx.App.Gameplay.Robots))

	if float64(countOfGaiteSea)/float64(len(ctx.App.Gameplay.Robots)) < 0.5 {
		t.Fatalf("GaiteSea必須佔了一半以上")
	}
}
