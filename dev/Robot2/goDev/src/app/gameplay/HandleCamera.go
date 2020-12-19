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
		case uidata.KeyCodeArrowUp:
			gameplay.Camera[1]--
		case uidata.KeyCodeArrowDown:
			gameplay.Camera[1]++
		case uidata.KeyCodeArrowLeft:
			gameplay.Camera[0]--
		case uidata.KeyCodeArrowRight:
			gameplay.Camera[0]++
		}
	}
	return gameplay, nil
}
