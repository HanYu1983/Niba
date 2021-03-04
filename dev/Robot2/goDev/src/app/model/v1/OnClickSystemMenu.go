package v1

import (
	"app/model/v1/internal/impl"
	"app/model/v1/internal/tool/types"
	"app/tool/def"
	"app/tool/helper"
	"app/tool/protocol"
	"app/tool/uidata"
	"math/rand"
)

func OnClickSystemMenu(origin uidata.UI, selection string) (uidata.UI, error) {
	var err error
	ctx := origin
	view := def.View
	switch selection {
	case uidata.MenuOptionGiveUp:
		model := ctx.Model.(Model)
		model.App.Gameplay.State = protocol.GameplayModelStateDone
		model.App.Gameplay.StateReason = "giveUp"
		ctx.Model = model
		return ctx, err
	case uidata.MenuOptionSaveGame:
		err = ctx.Model.Save()
		if err != nil {
			return origin, err
		}
	case uidata.MenuOptionLoadGame:
		ctx.Model, err = ctx.Model.Load()
		if err != nil {
			return origin, err
		}
		if ctx.Model.State() != protocol.GameplayModelStatePlaying {
			view.Alert("你沒有戰鬥中存檔")
			return origin, nil
		}
	case uidata.MenuOptionTest:
		var tempMap [][]int
		tempMap, err = helper.GenerateMap(helper.GenerateMapConfig{
			Deepsea:  rand.Float64(),
			Sea:      rand.Float64(),
			Sand:     rand.Float64(),
			Grass:    rand.Float64(),
			Mountain: rand.Float64(),
			City:     rand.Float64(),
			Tree:     rand.Float64(),
		}, 0, 0, 1, uidata.MapWidth, uidata.MapHeight, rand.Int(), rand.Int())
		if err != nil {
			return origin, err
		}
		model := ctx.Model.(Model)
		model.App.Gameplay.Map = tempMap
		ctx.Model = model
	case uidata.MenuOptionTest2:
		model := types.Model(ctx.Model.(Model))
		model.App.Gameplay.Units = []string{}
		model.App.Gameplay.Robots = map[string]protocol.Robot{}
		model.App.Gameplay.Positions = map[string]protocol.Position{}
		model, err = impl.GenerateLevelByPSO(model, "ai1")
		if err != nil {
			return origin, err
		}
		ctx.Model = Model(model)
	case uidata.MenuOptionTest3:
		model := types.Model(ctx.Model.(Model))
		model.App.Gameplay.Units = []string{}
		model.App.Gameplay.Robots = map[string]protocol.Robot{}
		model.App.Gameplay.Positions = map[string]protocol.Position{}
		model, err = impl.GenerateLevelByHC(model, "ai1", protocol.Position{uidata.MapWidth - 1, uidata.MapHeight - 1}, 200000)
		if err != nil {
			return origin, err
		}
		model, err = impl.GenerateLevelByHC(model, protocol.PlayerIDPlayer, protocol.Position{0, 0}, 200000)
		if err != nil {
			return origin, err
		}
		ctx.Model = Model(model)
	}
	return ctx, nil
}
