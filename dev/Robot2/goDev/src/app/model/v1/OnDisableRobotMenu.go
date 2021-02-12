package v1

import "app/tool/uidata"

func OnDisableRobotMenu(origin uidata.UI) (uidata.UI, error) {
	ctx := origin
	_model := ctx.Model.(model)
	_model.App.Gameplay.RobotMenu.Active = false
	ctx.Model = _model
	return ctx, nil
}
