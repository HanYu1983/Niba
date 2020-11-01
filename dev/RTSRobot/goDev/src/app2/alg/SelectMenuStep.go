package alg

import (
	"app2/data"
	"app2/lib"
)

func SelectMenuStep(origin data.Gameplay, inputCh <-chan interface{}) (data.Gameplay, string, bool, error) {
	gameplay := origin
	gameplay.Menu.Active = true
WaitCommand:
	for {
		cmd := <-inputCh
		switch detail := cmd.(type) {
		case data.CommandKeyDown:
			switch detail.KeyCode {
			case data.KeyCodeUp:
				gameplay.Menu.Cursor1--
			case data.KeyCodeDown:
				gameplay.Menu.Cursor1++
			case data.KeyCodeLeft:
				gameplay.Menu.Cursor2 = lib.ReplaceIndex(
					gameplay.Menu.Cursor2,
					map[int]int{
						gameplay.Menu.Cursor1: gameplay.Menu.Cursor2[gameplay.Menu.Cursor1] - 1,
					},
				)
			case data.KeyCodeRight:
				gameplay.Menu.Cursor2 = lib.ReplaceIndex(
					gameplay.Menu.Cursor2,
					map[int]int{
						gameplay.Menu.Cursor1: gameplay.Menu.Cursor2[gameplay.Menu.Cursor1] + 1,
					},
				)
			case data.KeyCodeSpace:
				break WaitCommand
			case data.KeyCodeEsc:
				return origin, "", true, nil
			default:

			}
		}
	}
	gameplay.Menu.Active = false
	return gameplay, gameplay.Menu.Options[gameplay.Menu.Cursor1][gameplay.Menu.Cursor2[gameplay.Menu.Cursor1]], false, nil
}
