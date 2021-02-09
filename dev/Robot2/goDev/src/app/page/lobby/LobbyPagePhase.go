package lobby

import (
	"app/page/common"
	"app/tool/uidata"
)

func LobbyPagePhase(origin uidata.UI) (uidata.UI, error) {
	var err error
	ctx := origin
	ctx.Actives = uidata.AssocStringBool(ctx.Actives, uidata.PageLobby, true)
	ctx, err = common.BasicPagePhase(
		ctx,
		uidata.PageLobby,
		func(origin uidata.UI) (uidata.UI, error) {
			return origin, nil
		},
		func(origin uidata.UI, focus int, selection string, cancel bool, tab bool) (uidata.UI, bool, error) {
			ctx := origin
			menuID := ctx.Menus[uidata.PageLobby][focus]
			switch menuID {
			case uidata.Menu1DLobbyMenu:
				switch selection {
				case uidata.MenuOptionBuyPilot:
					ctx, err = BuyPhase(ctx, uidata.PageBuyPilot)
					if err != nil {
						return origin, cancel, err
					}
				case uidata.MenuOptionBuyRobot:
					ctx, err = BuyPhase(ctx, uidata.PageBuyRobot)
					if err != nil {
						return origin, cancel, err
					}
				case uidata.MenuOptionBuyWeapon:
					ctx, err = BuyPhase(ctx, uidata.PageBuyWeapon)
					if err != nil {
						return origin, cancel, err
					}
				case uidata.MenuOptionBuyComponent:
					ctx, err = BuyPhase(ctx, uidata.PageBuyComponent)
					if err != nil {
						return origin, cancel, err
					}
				case uidata.MenuOptionAssocRobotPilot:
					ctx, err = AssocPhase(ctx, uidata.PageAssocRobotToPilot)
					if err != nil {
						return origin, cancel, err
					}
				case uidata.MenuOptionAssocWeaponRobot:
					ctx, err = AssocPhase(ctx, uidata.PageAssocWeaponToRobot)
					if err != nil {
						return origin, cancel, err
					}
				case uidata.MenuOptionAssocComponentRobot:
					ctx, err = AssocPhase(ctx, uidata.PageAssocComponentToRobot)
					if err != nil {
						return origin, cancel, err
					}
				case uidata.MenuOptionStartGameplay:
					ctx.Actives = uidata.AssocStringBool(ctx.Actives, uidata.PageLobby, false)
					ctx, err = MultiUnitSelectionPagePhase(ctx)
					if err != nil {
						return origin, cancel, err
					}
					ctx.Actives = uidata.AssocStringBool(ctx.Actives, uidata.PageLobby, true)
				}
			}
			return ctx, cancel, nil
		},
		func(origin uidata.UI, focus int, selection string, cancel bool, tab bool) (uidata.UI, bool, error) {
			return origin, cancel, nil
		},
	)
	if err != nil {
		return ctx, err
	}
	ctx.Actives = uidata.AssocStringBool(ctx.Actives, uidata.PageLobby, false)
	return ctx, nil
}
