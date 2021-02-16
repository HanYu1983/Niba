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

type CursorInfo struct {
	Terrain data.TerrainProto
	UnitID  string
}

// GameplayPage is
type GameplayPage struct {
	Players        map[string]protocol.Player
	Map            [MapHeight][MapWidth]int
	Cursor         protocol.Position
	Camera         protocol.Position
	Units          []string
	Robots         map[string]protocol.Robot
	Items          map[string]protocol.Item
	Positions      map[string]protocol.Position
	Tags           map[string]protocol.Tag
	MoveRange      []protocol.Position
	AttackRange    []protocol.Position
	MapAttackRange []protocol.Position
	HitMarks       map[string]protocol.HitMark
	RobotMenu      protocol.RobotMenu
	CursorInfo     CursorInfo
}

// ListInt is
type ListInt []int

// UI is
type UI struct {
	Model         protocol.IModel
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
	MenuOptionTest     = "MenuOptionTest"
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
