package alg

import "app2/data"

func SelectMenuStep(menu data.Menu, inputCh <-chan interface{}) (data.Menu, string, bool, error) {
	RenderMenu(menu)
WaitCommand:
	for {
		cmd := <-inputCh
		switch detail := cmd.(type) {
		case data.CommandKeyDown:
			switch detail.KeyCode {
			case "w":
				menu.Cursor[0]++
			case "space":
				break WaitCommand
			case "esc":
				return menu, "", true, nil
			default:

			}
		}
	}
	return menu, menu.Options[menu.Cursor[0]][menu.Cursor[1]], false, nil
}
