package v1

import (
	"app/page/common"
	"app/tool/uidata"
)

func (model *model) EnemyTurnPhase(origin interface{}) (interface{}, bool, error) {
	var err error
	var cancel bool
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
