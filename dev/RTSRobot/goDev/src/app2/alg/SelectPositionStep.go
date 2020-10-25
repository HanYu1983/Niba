package alg

import "app2/data"

func SelectPositionStep(origin data.Gameplay, robotID string, inputCh <-chan interface{}) (data.Gameplay, data.Position, bool, error) {
	var err error
	gameplay := origin
WaitSpace:
	for {
		evt := <-inputCh
		gameplay, err = HandleCursor(gameplay, evt)
		if err != nil {
			return origin, data.Position{}, false, err
		}
		gameplay, err = HandleCamera(gameplay, evt)
		if err != nil {
			return origin, data.Position{}, false, err
		}
		switch detail := evt.(type) {
		case data.CommandKeyDown:
			switch detail.KeyCode {
			case "esc":
				return origin, data.Position{}, true, nil
			case "space":
				break WaitSpace
			}
		}
	}
	return gameplay, gameplay.Cursor, false, nil
}
