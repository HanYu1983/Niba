package uidata

import (
	"app/tool/data"
)

// is
const (
	KeyCodeUp         = 87
	KeyCodeDown       = 83
	KeyCodeLeft       = 65
	KeyCodeRight      = 68
	KeyCodeEnter      = 13
	KeyCodeSubEnter   = 32
	KeyCodeCancel     = 222 // '
	KeyCodeL          = 81
	KeyCodeR          = 69
	KeyCodeArrowUp    = 38
	KeyCodeArrowDown  = 40
	KeyCodeArrowLeft  = 37
	KeyCodeArrowRight = 39
	KeyCodeTab        = 186 // ;
)

// CommandKeyDown is
type CommandKeyDown struct {
	KeyCode int
}

// CommandKeyUp is
type CommandKeyUp struct {
	KeyCode int
}

// CommandFlush is
type CommandFlush struct {
}

// Menu1D is
type Menu1D struct {
	Options   []string
	Selection map[string]bool
	Cursor    int
	Offset    int
	Limit     int
}

// Menu2D is
type Menu2D struct {
	Options [][]string
	Cursor1 int
	Cursor2 []int
}

//
const (
	BattleActionAttack = iota
	BattleActionGuard
	BattleActionEvade
)

// BattleMenuSlot is
type BattleMenuSlot struct {
	Robot        data.Robot
	BattleAction int
	Weapon       data.Weapon
	Info         struct {
		HitRate float32
	}
}

// BattleMenu is
type BattleMenu struct {
	Left  BattleMenuSlot
	Right BattleMenuSlot
}

const (
	MapWidth  = 20
	MapHeight = 20
)

type RobotMenuInfo struct {
	WeaponID    int
	TransformID int
	Weapons     map[string]data.Weapon
	Transforms  map[string]data.Robot
}

// GameplayPage is
type GameplayPage struct {
	Map           [MapHeight][MapWidth]int
	Cursor        data.Position
	Camera        data.Position
	Units         []string
	Robots        map[string]data.Robot
	Items         map[string]data.Item
	Positions     map[string]data.Position
	MoveRange     []data.Position
	AttackRange   []data.Position
	RobotMenuInfo RobotMenuInfo
}

// ListInt is
type ListInt []int

// UI is
type UI struct {
	Actives       map[int]bool
	Menus         map[int]ListInt
	Focus         map[int]int
	Menu1Ds       map[int]Menu1D
	Menu2Ds       map[int]Menu2D
	BattleMenus   map[int]BattleMenu
	GameplayPages map[int]GameplayPage
	Info          struct {
		Money                int
		CanBuyRobots         map[string]data.RobotProto
		CanBuyPilots         map[string]data.PilotProto
		CanBuyWeapons        map[string]data.WeaponProto
		CanBuyComponents     map[string]data.ComponentProto
		Robots               map[string]data.Robot
		Pilots               map[string]data.Pilot
		Weapons              map[string]data.Weapon
		Components           map[string]data.Component
		RobotIDByWeaponID    map[string]string
		RobotIDByComponentID map[string]string
		PilotIDByRobotID     map[string]string
	}
}

//
const (
	MenuOptionNewGame       = "MenuOptionNewGame"
	MenuOptionLoadGame      = "MenuOptionLoadGame"
	MenuOptionStartGameplay = "MenuOptionStartGameplay"

	MenuOptionBuyRobot            = "MenuOptionBuyRobot"
	MenuOptionBuyPilot            = "MenuOptionBuyPilot"
	MenuOptionBuyWeapon           = "MenuOptionBuyWeapon"
	MenuOptionBuyComponent        = "MenuOptionBuyComponent"
	MenuOptionAssocRobotPilot     = "MenuOptionAssocRobotPilot"
	MenuOptionAssocWeaponRobot    = "MenuOptionAssocWeaponRobot"
	MenuOptionAssocComponentRobot = "MenuOptionAssocComponentRobot"

	MenuOptionCreateNew = "MenuOptionCreateNew"
	MenuOptionSell      = "MenuOptionSell"

	MenuOptionAssoc  = "MenuOptionAssoc"
	MenuOptionDissoc = "MenuOptionDissoc"

	MenuOptionMove      = "MenuOptionMove"
	MenuOptionSkyGround = "MenuOptionSkyGround"
)

//
const (
	PageStart = iota
	PageLobby
	PageBuyRobot
	PageBuyPilot
	PageBuyWeapon
	PageBuyComponent
	PageAssocRobotToPilot
	PageAssocWeaponToRobot
	PageAssocComponentToRobot
	PageMultiUnitSelection
	PageGameplay
	PageUnitMenu
	PageSystemMenu
	PageBattleMenu

	Menu1DStartMenu
	Menu1DLobbyMenu
	Menu1DRobotListMenu
	Menu1DPilotListMenu
	Menu1DWeaponListMenu
	Menu1DComponentListMenu
	Menu1DBuyRobotMenu
	Menu1DBuyPilotMenu
	Menu1DBuyWeaponMenu
	Menu1DBuyComponentMenu
	Menu1DBuyOrSellOrElseMenu
	Menu1DRobotPilotListMenu
	Menu1DWeaponRobotListMenu
	Menu1DComponentRobotListMenu
	Menu1DAssocOrDisMenu
	Menu1DMultiUnitSelectionMenu
	Menu2DUnitMenu
	Menu1DSystemMenu
	BattleMenuUnitBattleMenu
)

//
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
		},
		Menu2Ds: map[int]Menu2D{
			Menu2DUnitMenu: {},
		},
		BattleMenus: map[int]BattleMenu{
			BattleMenuUnitBattleMenu: BattleMenu{
				Left: BattleMenuSlot{
					BattleAction: BattleActionAttack,
				},
				Right: BattleMenuSlot{
					BattleAction: BattleActionAttack,
				},
			},
		},
		GameplayPages: map[int]GameplayPage{
			PageGameplay: GameplayPage{
				Cursor: data.Position{1, 1},
				Units: []string{
					"0",
				},
				Robots: map[string]data.Robot{
					"0": {
						WeaponsByTransform: map[string]data.Weapons{
							"": {
								"0": {},
							},
						},
					},
				},
				Positions: map[string]data.Position{
					"0": {0, 0},
				},
				Items:       map[string]data.Item{},
				MoveRange:   []data.Position{{0, 0}, {0, 1}},
				AttackRange: []data.Position{{0, 1}, {1, 1}},
			},
		},
	}
)
