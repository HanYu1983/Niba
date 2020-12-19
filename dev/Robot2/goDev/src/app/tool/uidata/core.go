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
	KeyCodeSpace      = 32
	KeyCodeEsc        = 222 // '
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
	Options []string
	Cursor  int
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
	RobotID      string
	BattleAction int
	Weapon       data.Weapon
	HitRate      float32
}

// BattleMenu is
type BattleMenu struct {
	Left  BattleMenuSlot
	Right BattleMenuSlot
}

// GameplayPage is
type GameplayPage struct {
	Active     bool
	Map        [][]int
	Cursor     data.Position
	Units      []string
	UnitMenu   Menu2D
	BattleMenu BattleMenu
	Robots     map[string]data.Robot
	Items      map[string]data.Item
	Positions  map[string]data.Position
}

//
const (
	PageStart = iota
	PageGameplay
	PageLobby
)

// ListInt is
type ListInt []int

// UI is
type UI struct {
	Actives       map[int]bool
	Menus         map[int]ListInt
	Focus         map[int]int
	Menu1Ds       map[int]Menu1D
	Menu2Ds       map[int]Menu2D
	GameplayPages map[int]GameplayPage
}

//
const (
	MenuOptionNewGame       = "MenuOptionNewGame"
	MenuOptionLoadGame      = "MenuOptionLoadGame"
	MenuOptionPrepare       = "MenuOptionPrepare"
	MenuOptionStartGameplay = "MenuOptionStartGameplay"
)

//
const (
	Menu1DStartMenu = iota
	Menu1DLobbyMenu
	Menu2DUnitMenu
)

//
var (
	DefaultUI = UI{
		Menus: map[int]ListInt{
			PageStart: []int{
				Menu1DStartMenu, Menu1DLobbyMenu,
			},
			PageLobby: []int{
				Menu1DLobbyMenu,
			},
		},
		Focus: map[int]int{
			PageStart: 0,
			PageLobby: 0,
		},
		Menu1Ds: map[int]Menu1D{
			Menu1DStartMenu: {
				Options: []string{
					MenuOptionNewGame, MenuOptionLoadGame,
				},
			},
			Menu1DLobbyMenu: {
				Options: []string{
					MenuOptionPrepare, MenuOptionStartGameplay,
				},
			},
		},
		Menu2Ds: map[int]Menu2D{
			Menu2DUnitMenu: {},
		},
		GameplayPages: map[int]GameplayPage{
			PageGameplay: GameplayPage{
				Active: true,
				Map: [][]int{
					{0, 1, 2, 3, 4},
				},
				Cursor: data.Position{1, 1},
				Units: []string{
					"",
				},
				UnitMenu: Menu2D{
					Options: [][]string{
						{"move"},
						{"weapon1", "weapon2"},
					},
				},
				BattleMenu: BattleMenu{
					Left: BattleMenuSlot{
						RobotID:      "",
						BattleAction: BattleActionAttack,
						Weapon:       data.Weapon{},
						HitRate:      0.0,
					},
					Right: BattleMenuSlot{
						RobotID:      "",
						BattleAction: BattleActionAttack,
						Weapon:       data.Weapon{},
						HitRate:      0.0,
					},
				},
				Robots: map[string]data.Robot{},
				Items:  map[string]data.Item{},
			},
		},
	}
)
