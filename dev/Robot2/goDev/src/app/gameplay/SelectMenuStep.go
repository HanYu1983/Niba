package gameplay

import (
	"app/tool"
	"app/tool/data"
	"app/tool/uidata"
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
		case uidata.CommandKeyDown:
			switch detail.KeyCode {
			case uidata.KeyCodeUp:
				topMenu.Cursor1--
			case uidata.KeyCodeDown:
				topMenu.Cursor1++
			case uidata.KeyCodeLeft:
				topMenu.Cursor2 = tool.ReplaceIndex(
					topMenu.Cursor2,
					map[int]int{
						topMenu.Cursor1: topMenu.Cursor2[topMenu.Cursor1] - 1,
					},
				)
			case uidata.KeyCodeRight:
				topMenu.Cursor2 = tool.ReplaceIndex(
					topMenu.Cursor2,
					map[int]int{
						topMenu.Cursor1: topMenu.Cursor2[topMenu.Cursor1] + 1,
					},
				)
			case uidata.KeyCodeSpace:
				break WaitCommand
			case uidata.KeyCodeEsc:
				return origin, "", true, nil
			default:

			}
		}
	}
	topMenu.Active = false
	gameplay.MenuStack[len(gameplay.MenuStack)-1] = topMenu
	return gameplay, topMenu.Options[topMenu.Cursor1][topMenu.Cursor2[topMenu.Cursor1]], false, nil
}
