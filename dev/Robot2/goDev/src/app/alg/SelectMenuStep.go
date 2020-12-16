package alg

import (
	"app/data"
	"app/lib"
	"fmt"
)

func SelectMenuStep(origin data.Gameplay) (data.Gameplay, string, bool, error) {
	gameplay := origin
	if len(gameplay.MenuStack) == 0 {
		return origin, "", false, fmt.Errorf("must have menu")
	}
	topMenu := gameplay.MenuStack[len(gameplay.MenuStack)-1]
	topMenu.Active = true
WaitCommand:
	for {
		cmd := view.AskCommand()
		switch detail := cmd.(type) {
		case data.CommandKeyDown:
			switch detail.KeyCode {
			case data.KeyCodeUp:
				topMenu.Cursor1--
			case data.KeyCodeDown:
				topMenu.Cursor1++
			case data.KeyCodeLeft:
				topMenu.Cursor2 = lib.ReplaceIndex(
					topMenu.Cursor2,
					map[int]int{
						topMenu.Cursor1: topMenu.Cursor2[topMenu.Cursor1] - 1,
					},
				)
			case data.KeyCodeRight:
				topMenu.Cursor2 = lib.ReplaceIndex(
					topMenu.Cursor2,
					map[int]int{
						topMenu.Cursor1: topMenu.Cursor2[topMenu.Cursor1] + 1,
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
	topMenu.Active = false
	gameplay.MenuStack[len(gameplay.MenuStack)-1] = topMenu
	return gameplay, topMenu.Options[topMenu.Cursor1][topMenu.Cursor2[topMenu.Cursor1]], false, nil
}
