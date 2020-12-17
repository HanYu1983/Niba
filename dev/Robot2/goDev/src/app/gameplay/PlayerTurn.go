package gameplay

import (
	"app/data"
)

func PlayerTurn(origin data.Gameplay) (data.Gameplay, error) {
	var err error
	gameplay := origin
	for {
		Render(gameplay)
		cmd := view.AskCommand()
		gameplay, err = HandleCursor(gameplay, cmd)
		if err != nil {
			return origin, err
		}
		gameplay, err = HandleCamera(gameplay, cmd)
		if err != nil {
			return origin, err
		}
		switch detail := cmd.(type) {
		case data.CommandKeyDown:
			switch detail.KeyCode {
			default:
				cursor := gameplay.Cursor
				var notFound string
				unitAtCursor := SearchUnitByPosition(gameplay.Positions, cursor)
				if unitAtCursor == notFound {
					gameplay, err = SystemMenu(gameplay)
				} else {
					gameplay, err = UnitMenuPhase(gameplay, unitAtCursor)
				}
				if err != nil {
					view.Alert(err)
					continue
				}
			}
		default:
			var _ = detail
		}
		if gameplay.Done != nil {
			break
		}
	}
	return gameplay, nil
}
