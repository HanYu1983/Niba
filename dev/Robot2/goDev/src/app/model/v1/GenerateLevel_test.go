package v1

import (
	"app/tool/helper"
	"testing"
)

func TestGenerateLevel(t *testing.T) {
	var err error
	tempMap, err := helper.GenerateMap(helper.GenerateMapConfigDefault, 0, 0, 1, 25, 25, 0, 0)
	if err != nil {
		t.Fatal(err)
	}
	ctx := DefaultModel
	ctx.App.Gameplay.Map = tempMap
	ctx, err = GenerateLevel(ctx, "abc")
	if err != nil {
		t.Fatal(err)
	}
}
