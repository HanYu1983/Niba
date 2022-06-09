package alg

import "app2/data"

func HandleCursor(origin data.Gameplay, evt interface{}) (data.Gameplay, error) {
	gameplay := origin
	switch detail := evt.(type) {
	case data.CommandKeyDown:
		switch detail.KeyCode {
		case data.KeyCodeUp:
			gameplay.Cursor[1]--
		case data.KeyCodeDown:
			gameplay.Cursor[1]++
		case data.KeyCodeLeft:
			gameplay.Cursor[0]--
		case data.KeyCodeRight:
			gameplay.Cursor[0]++
		}
	}
	return gameplay, nil
}
