package def

import (
	"app/tool/protocol"
	. "app/tool/uidata"
)

var (
	DefaultUI = UI{
		Actives: map[int]bool{
			PageBattleMenu: false,
			PageUnitMenu:   false,
		},
		Menus: map[int]ListInt{
			PageStart: []int{
				Menu1DStartMenu,
			},
			PageLobby: []int{
				Menu1DLobbyMenu,
			},
			PageBuyRobot: []int{
				Menu1DRobotListMenu, Menu1DBuyOrSellOrElseMenu, Menu1DBuyRobotMenu,
			},
			PageBuyPilot: []int{
				Menu1DPilotListMenu, Menu1DBuyOrSellOrElseMenu, Menu1DBuyPilotMenu,
			},
			PageBuyWeapon: []int{
				Menu1DWeaponListMenu, Menu1DBuyOrSellOrElseMenu, Menu1DBuyWeaponMenu,
			},
			PageBuyComponent: []int{
				Menu1DComponentListMenu, Menu1DBuyOrSellOrElseMenu, Menu1DBuyComponentMenu,
			},
			PageAssocRobotToPilot: []int{
				Menu1DRobotPilotListMenu, Menu1DAssocOrDisMenu, Menu1DPilotListMenu,
			},
			PageAssocWeaponToRobot: []int{
				Menu1DWeaponRobotListMenu, Menu1DAssocOrDisMenu, Menu1DRobotListMenu,
			},
			PageAssocComponentToRobot: []int{
				Menu1DComponentRobotListMenu, Menu1DAssocOrDisMenu, Menu1DRobotListMenu,
			},
			PageMultiUnitSelection: []int{
				Menu1DMultiUnitSelectionMenu,
			},
			PageUnitMenu: []int{
				Menu2DUnitMenu,
			},
			PageSystemMenu: []int{
				Menu1DSystemMenu,
			},
			PageBattleMenu: []int{
				BattleMenuUnitBattleMenu,
			},
			PageGameplay: []int{
				Menu2DUnitMenu, BattleMenuUnitBattleMenu,
			},
			PageSelectLevel: []int{
				Menu1DGroundLevelMenu, Menu1DSeaLevelMenu, Menu1DRandomLevelMenu,
			},
		},
		Focus: map[int]int{},
		Menu1Ds: map[int]Menu1D{
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
			Menu1DGroundLevelMenu: {
				Limit:   10,
				Options: []string{"Ground1", "Ground2", "Ground3", "Ground4", "Ground5"},
			},
			Menu1DSeaLevelMenu: {
				Limit:   10,
				Options: []string{"Sea1", "Sea2", "Sea3", "Sea4", "Sea5"},
			},
			Menu1DRandomLevelMenu: {
				Limit:   10,
				Options: []string{"Random1", "Random2", "Random3", "Random4", "Random5"},
			},
		},
		Menu2Ds: map[int]Menu2D{
			Menu2DUnitMenu: {},
		},
		BattleMenus: map[int]BattleMenu{
			BattleMenuUnitBattleMenu: BattleMenu{
				Left: BattleMenuSlot{
					BattleAction: protocol.BattleMenuActionAttack,
				},
				Right: BattleMenuSlot{
					BattleAction: protocol.BattleMenuActionAttack,
				},
			},
		},
		GameplayPages: map[int]GameplayPage{
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
