package ui

import "app/data"

type Menu1D struct {
	Active  bool
	Options []string
	Cursor  int
}

type Menu2D struct {
	Active  bool
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
	Active bool
	Left   BattleMenuSlot
	Right  BattleMenuSlot
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
	Active   bool
	MainMenu Menu1D
}

type StartPage struct {
	Active   bool
	MainMenu Menu1D
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
}

var (
	DefaultUI = UI{
		StartPage: StartPage{
			MainMenu: Menu1D{
				Options: []string{
					"new game", "load game",
				},
			},
		},
		LobbyPage: LobbyPage{
			MainMenu: Menu1D{
				Options: []string{
					"buy robot", "buy weapon",
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
				Active: true,
				Options: [][]string{
					{"move"},
					{"weapon1", "weapon2"},
				},
			},
			BattleMenu: BattleMenu{
				Active: true,
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
