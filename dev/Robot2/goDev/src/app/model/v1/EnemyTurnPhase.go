package v1

import (
	"app/page/common"
	"app/tool/def"
	"app/tool/uidata"
)

func (model *model) EnemyTurnPhase(origin interface{}) (interface{}, bool, error) {
	model.Push()
	defer model.Pop()
	var err error
	var cancel bool
	view := def.View
	var _ = view
	ctx := origin.(uidata.UI)
	ctx, cancel, err = common.BattleMenuPhase(ctx, false, "unitID", "weaponID", "targetID")
	if err != nil {
		model.Reset()
		return origin, false, err
	}
	if cancel {
		model.Reset()
		return origin, cancel, nil
	}
	return ctx, false, nil
}
