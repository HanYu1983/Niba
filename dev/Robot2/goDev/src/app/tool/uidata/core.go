package uidata

import (
	"app/tool/data"
	"app/tool/protocol"
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

// BattleMenuSlot is
type BattleMenuSlot struct {
	Robot        protocol.Robot
	Pilot        protocol.Pilot
	BattleAction int
	Weapon       protocol.Weapon
	Info         struct {
		HitRate float64
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

// GameplayPage is
type GameplayPage struct {
	Map         [MapHeight][MapWidth]int
	Cursor      protocol.Position
	Camera      protocol.Position
	Units       []string
	Robots      map[string]protocol.Robot
	Items       map[string]protocol.Item
	Positions   map[string]protocol.Position
	Tags        map[string]protocol.Tag
	MoveRange   []protocol.Position
	AttackRange []protocol.Position
	RobotMenu   protocol.RobotMenu
}

// ListInt is
type ListInt []int
type ListString []string

// UI is
type UI struct {
	Model         protocol.IModel
	Actives       map[string]bool
	Menus         map[string]ListString
	Focus         map[string]int
	Menu1Ds       map[string]Menu1D
	Menu2Ds       map[string]Menu2D
	BattleMenus   map[string]BattleMenu
	GameplayPages map[string]GameplayPage
	Info          struct {
		Money                int
		CanBuyRobots         map[string]data.RobotProto
		CanBuyPilots         map[string]data.PilotProto
		CanBuyWeapons        map[string]data.WeaponProto
		CanBuyComponents     map[string]data.ComponentProto
		Robots               map[string]protocol.Robot
		Pilots               map[string]protocol.Pilot
		Weapons              map[string]protocol.Weapon
		Components           map[string]protocol.Component
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
	MenuOptionUnitDone  = "MenuOptionUnitDone"

	MenuOptionUnitGuard = "MenuOptionUnitGuard"
	MenuOptionUnitEvade = "MenuOptionUnitEvade"
	MenuOptionConfirm   = "MenuOptionConfirm"

	MenuOptionTurnDone = "MenuOptionTurnDone"
)

//
const (
	PageStart                 = "PageStart"
	PageLobby                 = "PageLobby"
	PageBuyRobot              = "PageBuyRobot"
	PageBuyPilot              = "PageBuyPilot"
	PageBuyWeapon             = "PageBuyWeapon"
	PageBuyComponent          = "PageBuyComponent"
	PageAssocRobotToPilot     = "PageAssocRobotToPilot"
	PageAssocWeaponToRobot    = "PageAssocWeaponToRobot"
	PageAssocComponentToRobot = "PageAssocComponentToRobot"
	PageMultiUnitSelection    = "PageMultiUnitSelection"
	PageGameplay              = "PageGameplay"
	PageUnitMenu              = "PageUnitMenu"
	PageSystemMenu            = "PageSystemMenu"
	PageBattleMenu            = "PageBattleMenu"

	Menu1DStartMenu              = "Menu1DStartMenu"
	Menu1DLobbyMenu              = "Menu1DLobbyMenu"
	Menu1DRobotListMenu          = "Menu1DRobotListMenu"
	Menu1DPilotListMenu          = "Menu1DPilotListMenu"
	Menu1DWeaponListMenu         = "Menu1DWeaponListMenu"
	Menu1DComponentListMenu      = "Menu1DComponentListMenu"
	Menu1DBuyRobotMenu           = "Menu1DBuyRobotMenu"
	Menu1DBuyPilotMenu           = "Menu1DBuyPilotMenu"
	Menu1DBuyWeaponMenu          = "Menu1DBuyWeaponMenu"
	Menu1DBuyComponentMenu       = "Menu1DBuyComponentMenu"
	Menu1DBuyOrSellOrElseMenu    = "Menu1DBuyOrSellOrElseMenu"
	Menu1DRobotPilotListMenu     = "Menu1DRobotPilotListMenu"
	Menu1DWeaponRobotListMenu    = "Menu1DWeaponRobotListMenu"
	Menu1DComponentRobotListMenu = "Menu1DComponentRobotListMenu"
	Menu1DAssocOrDisMenu         = "Menu1DAssocOrDisMenu"
	Menu1DMultiUnitSelectionMenu = "Menu1DMultiUnitSelectionMenu"
	Menu2DUnitMenu               = "Menu2DUnitMenu"
	Menu1DSystemMenu             = "Menu1DSystemMenu"
	BattleMenuUnitBattleMenu     = "BattleMenuUnitBattleMenu"
)
