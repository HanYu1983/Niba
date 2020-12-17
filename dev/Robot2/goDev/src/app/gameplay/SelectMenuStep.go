package gameplay

import (
	"app/tool"
	"app/tool/data"
	"app/tool/ui_data"
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
		case ui_data.CommandKeyDown:
			switch detail.KeyCode {
			case ui_data.KeyCodeUp:
				topMenu.Cursor1--
			case ui_data.KeyCodeDown:
				topMenu.Cursor1++
			case ui_data.KeyCodeLeft:
				topMenu.Cursor2 = tool.ReplaceIndex(
					topMenu.Cursor2,
					map[int]int{
						topMenu.Cursor1: topMenu.Cursor2[topMenu.Cursor1] - 1,
					},
				)
			case ui_data.KeyCodeRight:
				topMenu.Cursor2 = tool.ReplaceIndex(
					topMenu.Cursor2,
					map[int]int{
						topMenu.Cursor1: topMenu.Cursor2[topMenu.Cursor1] + 1,
					},
				)
			case ui_data.KeyCodeSpace:
				break WaitCommand
			case ui_data.KeyCodeEsc:
				return origin, "", true, nil
			default:

			}
		}
	}
	topMenu.Active = false
	gameplay.MenuStack[len(gameplay.MenuStack)-1] = topMenu
	return gameplay, topMenu.Options[topMenu.Cursor1][topMenu.Cursor2[topMenu.Cursor1]], false, nil
}
