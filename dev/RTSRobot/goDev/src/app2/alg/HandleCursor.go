package alg

import "app2/data"

func HandleCursor(origin data.Gameplay, evt interface{}) (data.Gameplay, error) {
	gameplay := origin
	switch detail := evt.(type) {
	case data.CommandKeyDown:
		switch detail.KeyCode {
		case "w":
			gameplay.Cursor[1]--
		case "s":
			gameplay.Cursor[1]++
		case "a":
			gameplay.Cursor[0]--
		case "d":
			gameplay.Cursor[0]++
		}
	}
	return gameplay, nil
}
