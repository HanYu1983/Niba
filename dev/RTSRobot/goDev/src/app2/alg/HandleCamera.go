package alg

import "app2/data"

func HandleCamera(origin data.Gameplay, evt interface{}) (data.Gameplay, error) {
	gameplay := origin
	switch detail := evt.(type) {
	case data.CommandKeyDown:
		switch detail.KeyCode {
		case "ArrowUp":
			gameplay.Camera[1]--
		case "ArrowDown":
			gameplay.Camera[1]++
		case "ArrowLeft":
			gameplay.Camera[0]--
		case "ArrowRight":
			gameplay.Camera[0]++
		}
	}
	return gameplay, nil
}
