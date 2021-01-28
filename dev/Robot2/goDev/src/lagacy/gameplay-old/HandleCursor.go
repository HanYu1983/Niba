package gameplay

import (
	"app/tool/data"
	"app/tool/uidata"
)

func HandleCursor(origin data.Gameplay, evt interface{}) (data.Gameplay, error) {
	gameplay := origin
	switch detail := evt.(type) {
	case uidata.CommandKeyDown:
		switch detail.KeyCode {
		case uidata.KeyCodeUp:
			gameplay.Cursor[1]--
		case uidata.KeyCodeDown:
			gameplay.Cursor[1]++
		case uidata.KeyCodeLeft:
			gameplay.Cursor[0]--
		case uidata.KeyCodeRight:
			gameplay.Cursor[0]++
		}
	}
	return gameplay, nil
}
