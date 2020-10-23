package alg

import (
	"app2/data"
)

func PlayerTurn(origin data.Gameplay) (data.Gameplay, error) {
	gameplay := origin
	for {
		cmd, err := AskCommand(gameplay)
		if err != nil {
			Alert(err)
			continue
		}
		switch detail := cmd.(type) {
		case data.CommandKeyDown:
			switch detail.KeyCode {
			case "w":
			default:
				gameplay, err = UnitMenu(gameplay, "")
				if err != nil {
					Alert(err)
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
