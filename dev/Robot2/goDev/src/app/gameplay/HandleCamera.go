package gameplay

import (
	"app/tool/data"
	"app/tool/uidata"
)

func HandleCamera(origin data.Gameplay, evt interface{}) (data.Gameplay, error) {
	gameplay := origin
	switch detail := evt.(type) {
	case uidata.CommandKeyDown:
		switch detail.KeyCode {
		case uidata.KeyCodeUp:
			gameplay.Camera[1]--
		case uidata.KeyCodeDown:
			gameplay.Camera[1]++
		case uidata.KeyCodeLeft:
			gameplay.Camera[0]--
		case uidata.KeyCodeRight:
			gameplay.Camera[0]++
		}
	}
	return gameplay, nil
}
