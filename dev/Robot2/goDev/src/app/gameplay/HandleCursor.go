package gameplay

import (
	"app/tool/data"
	"app/tool/ui_data"
)

func HandleCursor(origin data.Gameplay, evt interface{}) (data.Gameplay, error) {
	gameplay := origin
	switch detail := evt.(type) {
	case ui_data.CommandKeyDown:
		switch detail.KeyCode {
		case ui_data.KeyCodeUp:
			gameplay.Cursor[1]--
		case ui_data.KeyCodeDown:
			gameplay.Cursor[1]++
		case ui_data.KeyCodeLeft:
			gameplay.Cursor[0]--
		case ui_data.KeyCodeRight:
			gameplay.Cursor[0]++
		}
	}
	return gameplay, nil
}
