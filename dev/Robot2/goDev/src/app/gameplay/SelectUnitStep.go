package gameplay

import (
	"app/tool/data"
	"app/tool/uidata"
)

func SelectUnitStep(origin data.Gameplay, unitID string, validFn func(unitID string) error) (data.Gameplay, string, bool, error) {
	var err error
	gameplay := origin
	for {
		evt := view.AskCommand()
		gameplay, err = HandleCursor(gameplay, evt)
		if err != nil {
			return origin, "", false, err
		}
		gameplay, err = HandleCamera(gameplay, evt)
		if err != nil {
			return origin, "", false, err
		}
		switch detail := evt.(type) {
		case uidata.CommandKeyDown:
			switch detail.KeyCode {
			case uidata.KeyCodeEsc:
				return origin, "", true, nil
			case uidata.KeyCodeSpace:
				for unitID, pos := range gameplay.Positions {
					if pos == gameplay.Cursor {
						err := validFn(unitID)
						if err == nil {
							return gameplay, unitID, false, nil
						}
						view.Alert(err.Error())
					}
				}
			}
		}
	}
}
