package common

import (
	"app/tool/def"
	"app/tool/uidata"
)

func ObserveGameplayPage(origin uidata.UI, id int) (uidata.UI, error) {
	ret, err := def.Model.RenderGameplay(origin, id)
	return ret.(uidata.UI), err
}
