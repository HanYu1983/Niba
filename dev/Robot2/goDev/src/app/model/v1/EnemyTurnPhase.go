package v1

import (
	"app/page/common"
	"app/tool/def"
	"app/tool/uidata"
)

// func (model *model) EnemyTurnPhase(origin interface{}) (interface{}, bool, error) {

// 	var err error
// 	var cancel bool
// 	view := def.View
// 	var _ = view
// 	ctx := origin.(uidata.UI)
// 	ctx, cancel, err = common.BattleMenuPhase(ctx, false, "unitID", "weaponID", "targetID")
// 	if err != nil {

// 		return origin, false, err
// 	}
// 	if cancel {

// 		return origin, cancel, nil
// 	}
// 	return ctx, false, nil
// }
func EnemyTurnPhase(origin interface{}) (interface{}, bool, error) {
	var err error
	var cancel bool
	view := def.View
	var _ = view
	ctx := origin.(uidata.UI)
	ctx, cancel, err = common.BattleMenuPhase(ctx, false, "unitID", "weaponID", "targetID")
	if err != nil {
		return origin, false, err
	}
	if cancel {
		return origin, cancel, nil
	}
	return ctx, false, nil
}
