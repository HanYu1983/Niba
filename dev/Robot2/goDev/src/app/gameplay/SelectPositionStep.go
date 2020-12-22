package gameplay

import (
	"app/tool/data"
	"app/tool/uidata"
)

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
		case uidata.CommandKeyDown:
			switch detail.KeyCode {
			case uidata.KeyCodeEsc:
				return origin, data.Position{}, true, nil
			case uidata.KeyCodeEnter:
				break WaitSpace
			}
		}
	}
	return gameplay, gameplay.Cursor, false, nil
}
