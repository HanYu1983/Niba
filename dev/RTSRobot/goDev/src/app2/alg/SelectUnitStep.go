package alg

import (
	"app2/data"
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
		case data.CommandKeyDown:
			switch detail.KeyCode {
			case data.KeyCodeEsc:
				return origin, "", true, nil
			case data.KeyCodeSpace:
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
