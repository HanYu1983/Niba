package v1

import (
	"app/tool/helper"
	"app/tool/protocol"
	"app/tool/uidata"
	"math/rand"
)

func OnClickSystemMenu(origin uidata.UI, selection string) (uidata.UI, error) {
	var err error
	ctx := origin
	switch selection {
	case uidata.MenuOptionTest2:
		var tempMap [][]int
		tempMap, err = helper.GenerateMap(helper.GenerateMapConfig{
			Deepsea:  rand.Float64(),
			Sea:      rand.Float64(),
			Sand:     rand.Float64(),
			Grass:    rand.Float64(),
			Mountain: rand.Float64(),
			City:     rand.Float64(),
			Tree:     rand.Float64(),
		}, 0, 0, 1, 25, 25, rand.Int(), rand.Int())
		if err != nil {
			return origin, err
		}
		model := ctx.Model.(model)
		model.App.Gameplay.Map = tempMap
		ctx.Model = model
	case uidata.MenuOptionTest:
		model := ctx.Model.(model)
		model.App.Gameplay.Units = []string{}
		model.App.Gameplay.Robots = map[string]protocol.Robot{}
		model.App.Gameplay.Positions = map[string]protocol.Position{}
		model, err = GenerateLevelByPSO(model, "ai1")
		if err != nil {
			return origin, err
		}
		ctx.Model = model
	}
	return ctx, nil
}
