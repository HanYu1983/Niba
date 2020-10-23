package alg

import "app2/data"

func RenderMenu(menu data.Menu) {

}

func SelectMenu(origin data.Gameplay, menu data.Menu) (data.Menu, string, error) {
	gameplay := origin
	RenderMenu(menu)
WaitCommand:
	for {
		cmd, err := AskCommand(gameplay)
		if err != nil {
			Alert(err)
			continue
		}
		switch detail := cmd.(type) {
		case data.CommandKeyDown:
			switch detail.KeyCode {
			case "w":
				menu.Cursor[0]++
			case "space":
				break WaitCommand
			default:

			}
		default:
			var _ = detail
		}
		if gameplay.Done != nil {
			break
		}
	}
	return menu, menu.Options[menu.Cursor[0]][menu.Cursor[1]], nil
}

func CreateMenu(origin data.Gameplay, obj interface{}) (data.Menu, error) {
	return data.Menu{}, nil
}

func UnitMenu(origin data.Gameplay, unitID string) (data.Gameplay, error) {
	gameplay := origin
	if robot, is := gameplay.Robots[unitID]; is {
		menu, err := CreateMenu(gameplay, robot)
		if err != nil {
			return origin, err
		}
		menu, selection, err := SelectMenu(gameplay, menu)
		if err != nil {
			return origin, err
		}
		switch menu.Cursor[0] {
		case menu.WeaponID:
			weaponID := selection
			var _ = weaponID
		case menu.TransformID:
			transformID := selection
			var _ = transformID
		}
		return gameplay, nil
	}
	if item, is := gameplay.Items[unitID]; is {
		menu, err := CreateMenu(gameplay, item)
		if err != nil {
			return origin, err
		}
		menu, selection, err := SelectMenu(gameplay, menu)
		if err != nil {
			return origin, err
		}
		var _ = selection
		return gameplay, nil
	}
	return origin, nil
}
