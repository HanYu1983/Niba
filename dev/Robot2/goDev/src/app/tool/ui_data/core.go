package ui_data

import (
	"app/tool/data"
)

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
	Menus1Ds     map[int]Menu1D
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
		Menus1Ds: map[int]Menu1D{
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
