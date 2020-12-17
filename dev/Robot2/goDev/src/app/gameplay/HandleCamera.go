package gameplay

import (
	"app/tool/data"
	"app/tool/ui_data"
)

func HandleCamera(origin data.Gameplay, evt interface{}) (data.Gameplay, error) {
	gameplay := origin
	switch detail := evt.(type) {
	case ui_data.CommandKeyDown:
		switch detail.KeyCode {
		case ui_data.KeyCodeArrowUp:
			gameplay.Camera[1]--
		case ui_data.KeyCodeArrowDown:
			gameplay.Camera[1]++
		case ui_data.KeyCodeArrowLeft:
			gameplay.Camera[0]--
		case ui_data.KeyCodeArrowRight:
			gameplay.Camera[0]++
		}
	}
	return gameplay, nil
}
