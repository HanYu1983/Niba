package common

import (
	"app/tool/data"
	"app/tool/uidata"
)

func ObserveGameplayPage(origin uidata.UI, id int) (uidata.UI, error) {
	//var err error
	ctx := origin
	gameplay := ctx.GameplayPages[id]
	gameplay.Map[0][0] = 2
	leftTop := gameplay.Camera
	rightBottom := data.Position{leftTop[0] + 20, leftTop[1] + 20}
	gameplay.Units = SearchUnitByRegion(gameplay.Positions, leftTop, rightBottom)
	ctx.GameplayPages = uidata.AssocIntGameplayPage(ctx.GameplayPages, id, gameplay)
	return ctx, nil
}
