package ui_data

import (
	"app/tool/data"
)

const (
	KeyCodeUp    = 87
	KeyCodeDown  = 83
	KeyCodeLeft  = 65
	KeyCodeRight = 68
	KeyCodeSpace = 32
	// '
	KeyCodeEsc        = 222
	KeyCodeArrowUp    = 38
	KeyCodeArrowDown  = 40
	KeyCodeArrowLeft  = 37
	KeyCodeArrowRight = 39
)

type CommandKeyDown struct {
	KeyCode int
}

type CommandKeyUp struct {
	KeyCode int
}

type CommandFlush struct {
}

type Menu1D struct {
	Options []string
	Cursor  int
}

type Menu2D struct {
	Options [][]string
	Cursor1 int
	Cursor2 []int
}

const (
	BattleActionAttack = iota
	BattleActionGuard
	BattleActionEvade
)

type BattleMenuSlot struct {
	RobotID      string
	BattleAction int
	Weapon       data.Weapon
	HitRate      float32
}

type BattleMenu struct {
	Left  BattleMenuSlot
	Right BattleMenuSlot
}

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

type LobbyPage struct {
	Active    bool
	Menus     []int
	FocusMenu int
}

type StartPage struct {
	Active    bool
	Menus     []int
	FocusMenu int
}

const (
	PageStart = iota
	PageGameplay
	PageLobby
)

type UI struct {
	StartPage    StartPage
	LobbyPage    LobbyPage
	GameplayPage GameplayPage
	Menu1Ds      map[int]Menu1D
	Menu2Ds      map[int]Menu2D
}

const (
	MenuOptionNewGame       = "MenuOptionNewGame"
	MenuOptionLoadGame      = "MenuOptionLoadGame"
	MenuOptionPrepare       = "MenuOptionPrepare"
	MenuOptionStartGameplay = "MenuOptionStartGameplay"
)

const (
	Menu1DStartMenu = iota
	Menu1DLobbyMenu
	Menu2DUnitMenu
)

var (
	DefaultUI = UI{
		StartPage: StartPage{
			Menus: []int{
				Menu1DStartMenu,
			},
		},
		LobbyPage: LobbyPage{
			Menus: []int{
				Menu1DLobbyMenu,
			},
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
		GameplayPage: GameplayPage{
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
	}
)
