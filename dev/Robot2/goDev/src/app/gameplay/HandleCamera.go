package gameplay

import "app/data"

func HandleCamera(origin data.Gameplay, evt interface{}) (data.Gameplay, error) {
	gameplay := origin
	switch detail := evt.(type) {
	case data.CommandKeyDown:
		switch detail.KeyCode {
		case data.KeyCodeArrowUp:
			gameplay.Camera[1]--
		case data.KeyCodeArrowDown:
			gameplay.Camera[1]++
		case data.KeyCodeArrowLeft:
			gameplay.Camera[0]--
		case data.KeyCodeArrowRight:
			gameplay.Camera[0]++
		}
	}
	return gameplay, nil
}
