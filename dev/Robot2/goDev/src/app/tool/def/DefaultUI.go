package def

import (
	"app/tool/protocol"
	. "app/tool/uidata"
)

var (
	DefaultUI = UI{
		Actives: map[string]bool{
			PageBattleMenu: false,
			PageUnitMenu:   false,
		},
		Menus: map[string]ListString{
			PageStart: []string{
				Menu1DStartMenu,
			},
			PageLobby: []string{
				Menu1DLobbyMenu,
			},
			PageBuyRobot: []string{
				Menu1DRobotListMenu, Menu1DBuyOrSellOrElseMenu, Menu1DBuyRobotMenu,
			},
			PageBuyPilot: []string{
				Menu1DPilotListMenu, Menu1DBuyOrSellOrElseMenu, Menu1DBuyPilotMenu,
			},
			PageBuyWeapon: []string{
				Menu1DWeaponListMenu, Menu1DBuyOrSellOrElseMenu, Menu1DBuyWeaponMenu,
			},
			PageBuyComponent: []string{
				Menu1DComponentListMenu, Menu1DBuyOrSellOrElseMenu, Menu1DBuyComponentMenu,
			},
			PageAssocRobotToPilot: []string{
				Menu1DRobotPilotListMenu, Menu1DAssocOrDisMenu, Menu1DPilotListMenu,
			},
			PageAssocWeaponToRobot: []string{
				Menu1DWeaponRobotListMenu, Menu1DAssocOrDisMenu, Menu1DRobotListMenu,
			},
			PageAssocComponentToRobot: []string{
				Menu1DComponentRobotListMenu, Menu1DAssocOrDisMenu, Menu1DRobotListMenu,
			},
			PageMultiUnitSelection: []string{
				Menu1DMultiUnitSelectionMenu,
			},
			PageUnitMenu: []string{
				Menu2DUnitMenu,
			},
			PageSystemMenu: []string{
				Menu1DSystemMenu,
			},
			PageBattleMenu: []string{
				BattleMenuUnitBattleMenu,
			},
			PageGameplay: []string{
				Menu2DUnitMenu, BattleMenuUnitBattleMenu,
			},
		},
		Focus: map[string]int{},
		Menu1Ds: map[string]Menu1D{
			Menu1DStartMenu: {
				Options: []string{
					MenuOptionNewGame, MenuOptionLoadGame,
				},
				Limit: 10,
			},
			Menu1DLobbyMenu: {
				Options: []string{
					MenuOptionBuyRobot,
					MenuOptionBuyPilot,
					MenuOptionBuyWeapon,
					MenuOptionBuyComponent,
					MenuOptionAssocRobotPilot,
					MenuOptionAssocWeaponRobot,
					MenuOptionAssocComponentRobot,
					MenuOptionStartGameplay,
				},
				Limit: 10,
			},
			Menu1DBuyOrSellOrElseMenu: {
				Options: []string{
					MenuOptionCreateNew, MenuOptionSell,
				},
				Limit: 10,
			},
			Menu1DAssocOrDisMenu: {
				Options: []string{
					MenuOptionAssoc, MenuOptionDissoc,
				},
				Limit: 10,
			},
			Menu1DRobotListMenu: {
				Limit: 10,
			},
			Menu1DBuyRobotMenu: {
				Limit: 10,
			},
			Menu1DPilotListMenu: {
				Limit: 10,
			},
			Menu1DBuyPilotMenu: {
				Limit: 10,
			},
			Menu1DWeaponListMenu: {
				Limit: 10,
			},
			Menu1DBuyWeaponMenu: {
				Limit: 10,
			},
			Menu1DComponentListMenu: {
				Limit: 10,
			},
			Menu1DBuyComponentMenu: {
				Limit: 10,
			},
			Menu1DRobotPilotListMenu: {
				Limit: 10,
			},
			Menu1DWeaponRobotListMenu: {
				Limit: 10,
			},
			Menu1DComponentRobotListMenu: {
				Limit: 10,
			},
			Menu1DMultiUnitSelectionMenu: {
				Limit:     10,
				Selection: map[string]bool{},
			},
			Menu1DSystemMenu: {
				Limit: 10,
			},
		},
		Menu2Ds: map[string]Menu2D{
			Menu2DUnitMenu: {},
		},
		BattleMenus: map[string]BattleMenu{
			BattleMenuUnitBattleMenu: BattleMenu{
				Left: BattleMenuSlot{
					BattleAction: protocol.BattleMenuActionAttack,
				},
				Right: BattleMenuSlot{
					BattleAction: protocol.BattleMenuActionAttack,
				},
			},
		},
		GameplayPages: map[string]GameplayPage{
			PageGameplay: GameplayPage{
				Cursor: protocol.Position{1, 1},
				Units: []string{
					"0",
				},
				Robots: map[string]protocol.Robot{
					"0": {
						WeaponsByTransform: map[string]protocol.Weapons{
							"": {
								"0": {},
							},
						},
					},
				},
				Positions: map[string]protocol.Position{
					"0": {0, 0},
				},
				Items:       map[string]protocol.Item{},
				MoveRange:   []protocol.Position{{0, 0}, {0, 1}},
				AttackRange: []protocol.Position{{0, 1}, {1, 1}},
				RobotMenu:   protocol.RobotMenu{},
			},
		},
	}
)
