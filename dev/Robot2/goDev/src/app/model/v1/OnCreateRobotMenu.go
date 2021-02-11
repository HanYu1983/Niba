package v1

import "app/tool/uidata"

func OnCreateRobotMenu(origin uidata.UI, unitID string) (uidata.UI, error) {
	var err error
	ctx := origin
	ctx.Model, err = ctx.Model.EnableRobotMenu(unitID, nil)
	if err != nil {
		return origin, err
	}
	return ctx, nil
}
