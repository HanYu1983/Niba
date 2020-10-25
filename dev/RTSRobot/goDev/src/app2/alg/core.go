package alg

import "app2/data"

func CreateRobotMenu(origin data.Gameplay, unitID string) (data.Menu, error) {
	menu := data.Menu{}
	if origin.ActivePlayerID == data.PlayerIDPlayer {
		menu.Options = [][]string{
			[]string{data.MenuOptionMove},
			[]string{"weapon1"},
		}
		menu.WeaponID = 1
		menu.TransformID = 2
	}
	return menu, nil
}

func CreateItemMenu(origin data.Gameplay, itemID string) (data.Menu, error) {
	return data.Menu{}, nil
}
