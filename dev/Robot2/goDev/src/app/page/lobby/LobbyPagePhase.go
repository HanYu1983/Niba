package lobby

import (
	"app/page/common"
	"app/page/gameplay"
	"app/tool/def"
	"app/tool/protocol"
	"app/tool/uidata"
	"tool/log"
)

func LobbyPagePhase(origin uidata.UI) (uidata.UI, error) {
	log.Log(protocol.LogCategoryPhase, "LobbyPagePhase", "start")
	var err error
	ctx := origin
	view := def.View
	ctx.Actives = uidata.AssocIntBool(ctx.Actives, uidata.PageLobby, true)
	ctx, err = common.BasicPagePhase(
		ctx,
		uidata.PageLobby,
		false,
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
					ctx.Actives = uidata.AssocIntBool(ctx.Actives, uidata.PageLobby, false)
				SELECT_LEVEL:
					for {
						var levelSelection protocol.SelectLevelSelection
						ctx, levelSelection, cancel, err = SelectLevelPhase(ctx)
						if err != nil {
							return origin, cancel, err
						}
						if cancel {
							return origin, false, err
						}
						for {
							var unitSelection map[string]bool
							ctx, unitSelection, cancel, err = MultiUnitSelectionPagePhase(ctx)
							if err != nil {
								return origin, cancel, err
							}
							if cancel {
								continue SELECT_LEVEL
							}
							ctx.Model, err = ctx.Model.New(protocol.NewGameplayWithSelection{
								SelectLevelSelection: levelSelection,
								Selection:            unitSelection,
							})
							if err != nil {
								view.Alert(err.Error())
								continue
							}
							break
						}
						break
					}

					ctx, err = gameplay.GameLoop(ctx)
					if err != nil {
						return origin, cancel, err
					}
					reason := ctx.Model.IsDone()
					var _ = reason

					ctx.Actives = uidata.AssocIntBool(ctx.Actives, uidata.PageLobby, true)
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
	ctx.Actives = uidata.AssocIntBool(ctx.Actives, uidata.PageLobby, false)
	log.Log(protocol.LogCategoryPhase, "LobbyPagePhase", "end")
	return ctx, nil
}
