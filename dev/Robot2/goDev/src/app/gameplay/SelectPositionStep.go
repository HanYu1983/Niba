package gameplay

import "app/data"

func SelectPositionStep(origin data.Gameplay, robotID string, moveRange []data.Position) (data.Gameplay, data.Position, bool, error) {
	var err error
	gameplay := origin
WaitSpace:
	for {
		evt := view.AskCommand()
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
			case data.KeyCodeEsc:
				return origin, data.Position{}, true, nil
			case data.KeyCodeSpace:
				break WaitSpace
			}
		}
	}
	return gameplay, gameplay.Cursor, false, nil
}
